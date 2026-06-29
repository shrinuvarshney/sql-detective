import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse json payload
app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to check for API Key presence
const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is missing. Please set your Gemini API Key in the Secrets panel."
    });
  }
  next();
};

// Helper to call generateContent with retry logic (e.g. on 503 High Demand / UNAVAILABLE errors)
async function generateContentWithRetry(options: any, maxAttempts = 4, initialDelayMs = 1500) {
  let attempt = 0;
  while (true) {
    try {
      attempt++;
      return await ai.models.generateContent(options);
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      const errorStr = JSON.stringify(error) || "";
      const isTransient = 
        errorMessage.includes("503") || 
        errorMessage.includes("UNAVAILABLE") || 
        errorMessage.includes("high demand") || 
        errorMessage.includes("ResourceExhausted") ||
        errorStr.includes("503") ||
        errorStr.includes("UNAVAILABLE") ||
        error?.status === 503;

      if (isTransient && attempt < maxAttempts) {
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        console.warn(`[Gemini SDK] Transient error occurred. Retrying in ${delay}ms... (Attempt ${attempt}/${maxAttempts}). Error: ${errorMessage}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// API ROUTES FIRST

// 1. AI Hint Assistant endpoint
app.post("/api/ai/hint", checkApiKey, async (req, res) => {
  try {
    const { levelId, incorrectQuery, errorMsg, objective, story, schema } = req.body;

    const systemInstruction = `You are the chief Digital Forensics AI Assistant at the DFA Academy. 
Your goal is to guide players of a SQL Detective RPG game to correct their SQL queries without revealing the answer.
Analyze the user's incorrect SQL query, understand what objective they are trying to reach, inspect the database schema, and look at any runtime errors they encountered.
Then, provide a helpful, progressive, highly-contextual forensic hint.
CRITICAL RULES:
- DO NOT provide the corrected SQL statement or correct keywords under any circumstances.
- Speak in a professional cyber-detective investigator tone.
- Keep the hint highly actionable and concise (under 3 lines).`;

    const prompt = `Case Context:
Level ID: ${levelId}
Briefing: ${story}
Objective: ${objective}
Database Schema: ${JSON.stringify(schema)}

Player's Incorrect Query:
\`\`\`sql
${incorrectQuery}
\`\`\`
${errorMsg ? `Database Runtime Error: ${errorMsg}` : ''}

Provide a forensic hint that directs the player to focus on what is wrong in their query structure or logical filter, without telling them what query to write.`;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { systemInstruction }
    });

    res.json({ hint: response.text?.trim() || "No hint generated. Try reviewing your filters or SELECT statements." });
  } catch (error: any) {
    console.error("AI Hint Assistant Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI hint." });
  }
});

// 2. AI Query Review endpoint
app.post("/api/ai/review", checkApiKey, async (req, res) => {
  try {
    const { query, isCorrect, errorMsg, objective, expectedQuery, schema } = req.body;

    const systemInstruction = `You are an expert SQL Learning Coach. 
Your task is to review the player's SQL query submission, explain in simple yet precise terms what it actually did, and offer constructive feedback.
Keep the explanation engaging and educational. Focus on:
- Syntactical errors or logical mismatches.
- SQL style advice (e.g., table aliases, uppercase keywords).
- Performance tips or best practices.
- DO NOT reveal the exact correct solution if they got it wrong. Instead, guide them on what they should adjust.`;

    const prompt = `Submission Context:
Player's Query:
\`\`\`sql
${query}
\`\`\`
Is Query Correct (produces correct target database results)? ${isCorrect ? 'YES' : 'NO'}
${errorMsg ? `Database Error: ${errorMsg}` : ''}
Case Objective: ${objective}
Expected reference query pattern (FOR COACH REFERENCE ONLY - DO NOT EXPOSE THIS DIRECTLY TO THE PLAYER): ${expectedQuery}
Database Schema context: ${JSON.stringify(schema)}

Provide a concise, highly-structured 2-paragraph SQL forensic code review.
Use Markdown formatting.`;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { systemInstruction }
    });

    res.json({ review: response.text?.trim() || "No review analysis completed." });
  } catch (error: any) {
    console.error("AI Query Review Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze query." });
  }
});

// 3. AI Story Narrator briefing styler
app.post("/api/ai/story", checkApiKey, async (req, res) => {
  try {
    const { story, objective, style } = req.body;

    const systemInstruction = `You are an immersive cyber-fiction Story Narrator for a Digital Forensics RPG.
You will receive a standard case story and objective, and a selected narrative style (e.g. 'cyberpunk_noir', 'hightech_thrill', 'retro_scifi').
Rewrite the story to make it highly immersive, dramatic, and appropriate for that subgenre, keeping the core characters, entities, and SQL database objective fully intact.
Keep it under 150 words. Add dramatic hacker terminal atmosphere.`;

    const prompt = `Original Case Story:
${story}

Target Objective:
${objective}

Desired Stylistic Tone: ${style}

Generate the stylized immersive narrative briefing. Use rich cyber roleplaying descriptions.`;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { systemInstruction }
    });

    res.json({ stylizedStory: response.text?.trim() || story });
  } catch (error: any) {
    console.error("AI Story Narrator Error:", error);
    res.status(500).json({ error: error.message || "Failed to style narrative." });
  }
});

// 4. AI Learning Coach & Progress Report endpoint
app.post("/api/ai/recommendation", checkApiKey, async (req, res) => {
  try {
    const { completedLevels, attemptsCount, hintsUsedCount, statistics } = req.body;

    const systemInstruction = `You are an AI Forensic Learning Coach analyzing an operative's DFA Training Syllabus performance.
Generate a structured, personalized progress report containing:
1. Strength Analysis (what SQL operations they excel at: SELECT, JOINs, aggregations).
2. Weakness & Critical Gaps (what concepts they struggled with, based on hints used or high attempt counts).
3. Recommended training roadmap (which upcoming topics or chapters they should focus on).
Write this in a motivating, highly-professional cyber-HQ commander voice.`;

    const prompt = `Operative Performance Matrix:
Completed Case File IDs: ${JSON.stringify(completedLevels)}
Level Attempt Counts (Level ID to Attempts): ${JSON.stringify(attemptsCount)}
Hints Unlocked Counts (Level ID to hints used): ${JSON.stringify(hintsUsedCount)}
Overall Statistics: ${JSON.stringify(statistics)}

Provide a detailed progress analysis. Return three clear sections with hacker-themed titles (e.g. "PERFORMANCE METRICS AUDIT", "LOGICAL SECURITY VULNERABILITIES", "UPCOMING REINTEGRATION Roadmap").`;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { systemInstruction }
    });

    res.json({ report: response.text?.trim() || "No progress report generated." });
  } catch (error: any) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze progress." });
  }
});

// 5. AI Chat Detective endpoint
app.post("/api/ai/chat", checkApiKey, async (req, res) => {
  try {
    const { messages, levelContext } = req.body;

    const systemInstruction = `You are 'Detective Sentinel', the resident AI mentor and seasoned cyber-forensics detective at the Digital Forensics Agency (DFA).
The user is a junior analyst trying to solve cyber-crime cases by writing SQL.
Your duty is to answer their questions, explain SQL concepts, and help them strategize.
IMPORTANT CONSTRAINTS:
- NEVER write complete SQL queries or solve the current case directly.
- Explain SQL topics (like JOINs, GROUP BY, aggregation) conceptually or with small, unrelated examples.
- Stay in character as an experienced, sharp, slightly cynical but supportive cyber detective.
- Use cybernetic slang / digital forensics terms (e.g., 'data packet', 'mainframe ledger', 'intruder footprints', 'grid telemetry').
- Keep responses relatively brief and conversational.`;

    const modelMessages = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    // Inject level context into the conversation as part of instructions
    const contextText = `CURRENT CASE FILES DOSSIER:
Title: ${levelContext?.title || "DFA Virtual Sandbox"}
Story: ${levelContext?.story || "General SQL sandbox practice"}
Objective: ${levelContext?.objective || "Practice querying database catalog"}
Schema: ${JSON.stringify(levelContext?.schema || {})}`;

    const finalMessages = [
      {
        role: "user",
        parts: [{ text: `SYSTEM INITIALIZATION - CONTEXT LOADED:\n${contextText}\n\nUnderstood. I will help the user analyze these footprints without giving them the code.` }]
      },
      ...modelMessages
    ];

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: finalMessages,
      config: { systemInstruction }
    });

    res.json({ reply: response.text?.trim() || "DFA Sentinel offline. Reconnecting..." });
  } catch (error: any) {
    console.error("AI Chat Detective Error:", error);
    res.status(500).json({ error: error.message || "Failed to get response from Detective Sentinel." });
  }
});

// 6. AI Case Generator - Dynamic Level Creator!
app.post("/api/ai/generate-case", checkApiKey, async (req, res) => {
  try {
    const { concept, difficulty, theme } = req.body;

    const systemInstruction = `You are a high-fidelity synthetic scenario generator for the DFA Cyber Range.
Your goal is to output a fully structured, playable custom SQL Detective level in JSON format.
The generated level MUST follow the Type schema exactly:
{
  "title": "Case File [ID] - [Fierce Cyberpunk Incident Title]",
  "story": "Dramatic story setting up the crime, the trace, or the hack.",
  "objective": "Clear statement of exactly what records are needed.",
  "concept": "[The targeted SQL concept]",
  "databaseSchema": {
    "[tableName]": [
      { "name": "[columnName]", "type": "[SQLITE_TYPE: e.g. TEXT, INTEGER, REAL]" }
    ]
  },
  "sqlSetup": "A string containing sqlite compatible SQL scripts (CREATE TABLE ...; INSERT INTO ...;) to construct the schema tables and populate them with at least 5 rows of interesting, realistic, clue-filled mock records.",
  "expectedQuery": "The exact SQL query that successfully satisfies the objective.",
  "initialQuery": "The starter SQL query for the player (e.g. 'SELECT * FROM ... LIMIT 5;' or 'SELECT * FROM ... WHERE ...;').",
  "hints": [
    "Table hints regarding which tables to select from",
    "Column hints regarding how to filter or sort",
    "Syntax hints with keyword syntax instructions"
  ]
}

CRITICAL RULES FOR SQL SETUP SCRIPT:
- Use standard SQLITE-compatible syntax.
- Ensure the tables created match the 'databaseSchema' keys and columns exactly.
- Escape all quotes and generate clean INSERT rows.
- The expectedQuery must yield at least one result from your populated data.`;

    const prompt = `Generate a custom DFA Academy SQL case with:
SQL Concept to teach: ${concept} (e.g. INNER JOIN, GROUP BY, HAVING, SELECT WHERE, subqueries)
Target difficulty: ${difficulty} (easy, medium, hard)
Incidents theme: ${theme} (e.g. blockchain ledger anomaly, corporate spy logs, self-aware AI network drift, dark-net auction tracking)

Return ONLY a single valid JSON object strictly complying with the schema. No markdown wrappers like \`\`\`json or trailing comments.`;

    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim() || "{}";
    const caseData = JSON.parse(text);

    res.json(caseData);
  } catch (error: any) {
    console.error("AI Case Generator Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate synthetic case." });
  }
});


// Vite / static file serving middleware config

async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SQL Detective server booted successfully on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to bootstrap server:", err);
});
