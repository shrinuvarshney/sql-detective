// Offline Rule-Based SQL Intelligence Engine
// Replaces external AI API requests with immediate, rule-based local simulation.
// This preserves the current UI and signatures so that AI can be easily added back
// in a future version without changing any existing component code.

import { Level, QueryResult, TableSchema } from '../types';
import { levels } from '../levels/levelsData';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface LevelContext {
  title: string;
  story: string;
  objective: string;
  schema: any;
}

/**
 * AI Hint Assistant: Instead of calling Gemini, analyze the user's incorrect query
 * against the expected query and schema to generate localized progressive hints.
 */
export async function fetchAiHint(params: {
  levelId: number;
  incorrectQuery: string;
  errorMsg: string | null;
  objective: string;
  story: string;
  schema: any;
}): Promise<string> {
  const { levelId, incorrectQuery, errorMsg, objective } = params;
  
  // Find level expected query if possible
  const originalLevel = levels.find(l => l.id === levelId);
  const expectedQuery = originalLevel?.expectedQuery || '';
  
  const queryUpper = incorrectQuery.toUpperCase();
  const expectedUpper = expectedQuery.toUpperCase();

  let advice = '';

  if (!incorrectQuery || incorrectQuery.trim() === '' || incorrectQuery.includes('-- Retrieve')) {
    return `### 🔍 ANALYSIS INITIATED // LEVEL ${levelId}\n\nTo begin, look at the objective: *"${objective}"*. You need to write a standard SQL query. Check the Schema Explorer to view the available tables and columns.`;
  }

  // 1. Syntax Error analysis
  if (errorMsg) {
    return `### ⚠️ SYNTAX FAULT DETECTED\n\nThe SQLite engine returned a syntax error:\n> *${errorMsg}*\n\n**Advice:** Double check that you've typed table and column names exactly as they appear in the Schema Explorer. Verify that all parenthesis are matched, quotes are closed, and commas are separated correctly.`;
  }

  // 2. Table check
  if (originalLevel) {
    const missingTables: string[] = [];
    originalLevel.databaseSchema.forEach(table => {
      if (!queryUpper.includes(table.name.toUpperCase())) {
        missingTables.push(table.name);
      }
    });

    if (missingTables.length > 0) {
      return `### 📁 MISSING DATA TARGETS\n\nYour query does not appear to reference the required tables: **${missingTables.join(', ')}**.\n\nMake sure to add \`FROM ${missingTables[0]}\` or use the correct join statement if the case requires multiple tables.`;
    }
  }

  // 3. Keyword / Clause Check
  const clauses = [
    { key: 'WHERE', desc: 'filtering specific records' },
    { key: 'JOIN', desc: 'combining multiple tables together' },
    { key: 'GROUP BY', desc: 'aggregating and grouping rows' },
    { key: 'HAVING', desc: 'filtering aggregated group metrics' },
    { key: 'ORDER BY', desc: 'sorting result sets' },
    { key: 'LIMIT', desc: 'restraining output rows count' },
    { key: 'LIKE', desc: 'wildcard string filtering' }
  ];

  for (const clause of clauses) {
    if (expectedUpper.includes(clause.key) && !queryUpper.includes(clause.key)) {
      advice += `- It looks like you're missing a **${clause.key}** clause, which is required for ${clause.desc}.\n`;
    }
  }

  // 4. Column selection check
  if (originalLevel) {
    const expectedColumns: string[] = [];
    originalLevel.databaseSchema.forEach(table => {
      table.columns.forEach(col => {
        if (expectedUpper.includes(col.name.toUpperCase()) && !queryUpper.includes(col.name.toUpperCase()) && !queryUpper.includes('*')) {
          expectedColumns.push(col.name);
        }
      });
    });

    if (expectedColumns.length > 0) {
      advice += `- Consider selecting or filtering on these columns: **${expectedColumns.join(', ')}**.\n`;
    }
  }

  if (advice) {
    return `### 💡 FORENSIC CLUES FOUND\n\nI compared your query with our telemetry objectives. Here are some observations:\n\n${advice}\n*Review the handcrafted clues in the "EVIDENCE BANK INTEL" sidebar for exact syntax layers!*`;
  }

  // Fallback to handcrafted hint
  const defaultHint = originalLevel?.hints[0] || 'Check table schema columns and ensure your filtering clauses match the objective precisely.';
  return `### 🎯 FORENSIC RECOMMENDATION\n\nYour syntax appears structurally complete, but the retrieved dataset doesn't match the target records.\n\n**Investigative Clue:** ${defaultHint}`;
}

/**
 * AI Query Review: Analyze the user's query and provide professional, offline SQL forensic reviews.
 */
export async function fetchAiQueryReview(params: {
  query: string;
  isCorrect: boolean;
  errorMsg: string | null;
  objective: string;
  expectedQuery: string;
  schema: any;
}): Promise<string> {
  const { query, isCorrect, errorMsg, objective, expectedQuery } = params;

  if (isCorrect) {
    return `### 🟢 QUERY COMPLIANT // ANALYSIS PASS

Excellent work, Agent. Your SQL construction is precise, clean, and optimally formulated. By matching the target database schema exactly, you've recovered the classified logs.

**Performance Audit:**
- **Execution Speed:** ~2ms (Optimal)
- **Data Load:** Fully Sanitized
- **Complexity:** O(N) linear search traversal

*Keep up the stellar forensic performance in the next Case File.*`;
  }

  // Incorrect analysis
  let correctionTip = "Ensure your filters, comparisons, or JOIN keys match the objective guidelines precisely.";
  if (errorMsg) {
    correctionTip = `The database engine flagged an error: *"${errorMsg}"*. Address this syntax issue first.`;
  } else if (expectedQuery) {
    const queryUpper = query.toUpperCase();
    const expectedUpper = expectedQuery.toUpperCase();
    if (expectedUpper.includes("JOIN") && !queryUpper.includes("JOIN")) {
      correctionTip = "This case requires correlating data across multiple tables. Try using an `INNER JOIN` or `LEFT JOIN`.";
    } else if (expectedUpper.includes("GROUP BY") && !queryUpper.includes("GROUP BY")) {
      correctionTip = "The objective requires aggregation of rows. Ensure you use a `GROUP BY` clause.";
    } else if (expectedUpper.includes("WHERE") && !queryUpper.includes("WHERE")) {
      correctionTip = "Make sure to filter your records using a `WHERE` condition to isolate the exact suspects.";
    }
  }

  return `### 🔴 QUERY REJECTED // INTEGRITY WARNING

Agent, your query was executed, but it failed to isolate the correct data records. In database forensics, accuracy must be absolute.

**Forensic Guidance:**
1. **Goal:** "${objective}"
2. **Review Tip:** ${correctionTip}
3. **Double Check:** Capitalization, spelling, and null values in the Schema Explorer.`;
}

/**
 * AI Story Narrator: Transform case stories into highly atmospheric cyberpunk, high-tech, or retro starfleet styles offline.
 */
export async function fetchStylizedStory(params: {
  story: string;
  objective: string;
  style: string;
}): Promise<string> {
  const { story, objective, style } = params;

  switch (style) {
    case 'cyberpunk_noir':
      return `### 🌌 LOC: NEO-CITY UNDERBELLY // DISTRICT 9
**[TELEMETRY FREQUENCY UNSTABLE]**

The rain doesn't wash away the neon sheen of District 9. In this concrete jungle, data is the only currency that matters. 

*"${story}"*

**THE MISSION CRACKPOINT:** "${objective}"

*Keep your head down and your terminal hot. We are running out of time, operative.*`;

    case 'hightech_thrill':
      return `### ⚡ CLASSIFIED INTEL BRIEFING // SECURE NODE
**THREAT LEVEL: RED // COMMAND PROTOCOL INITIATED**

Attention Operative. An emergency alert has been broadcasted from Headquarters. The target system is under active compromise.

**SUMMARY:** ${story}

**PRIMARY VECTOR:** "${objective}"

*Time is of the essence. Mount the SQL query immediately and download the classified ledger.*`;

    case 'retro_scifi':
      return `### 🚀 STARFLEET MAIN FRAME LOGS // YEAR 2099
**COORDINATES: DEEP SPACE QUANTUM RELAY**

*LOG ENTRY:*
${story.replace(/\./g, "...")}

**SUB-GRID COMMAND:** "${objective}"

*Align your database frequencies and prepare the warp engines. Launching query compiler now.*`;

    default:
      return story;
  }
}

/**
 * AI Learning Coach & Progress Report: Generate a customized dashboard audit offline based on game stats.
 */
export async function fetchProgressReport(params: {
  completedLevels: number[];
  attemptsCount: { [key: number]: number };
  hintsUsedCount: { [key: number]: number };
  statistics: any;
}): Promise<string> {
  const { completedLevels, statistics } = params;

  const totalCompleted = completedLevels.length;
  const rank = totalCompleted >= 40 ? 'ELITE DIRECTOR' : totalCompleted >= 25 ? 'SENIOR SPECIALIST' : totalCompleted >= 10 ? 'FIELD INVESTIGATOR' : 'JUNIOR DECK AGENT';
  
  // Calculate chapter completions
  const ch1Completed = completedLevels.filter(id => id <= 15).length;
  const ch2Completed = completedLevels.filter(id => id > 15 && id <= 35).length;
  const ch3Completed = completedLevels.filter(id => id > 35).length;

  return `### 🕵️‍♂️ HEADQUARTERS COGNITIVE PERFORMANCE AUDIT

- **Agent Name:** ${statistics?.username || 'Agent'}
- **Current Rank:** **${rank}**
- **Cracked Cases:** ${totalCompleted} / 50 Completed
- **Performance Rating:** ${Math.min(100, Math.round((totalCompleted / 50) * 100))}% Efficiency
- **EP Decryption Index:** ${statistics?.hintsUnlocked || 0} Hints Purchased

### 📊 SQL CONCEPT PROGRESSION

- **Chapter 1: Standard Intrusion (SELECT, WHERE, LIMIT)**
  [${'█'.repeat(Math.round(ch1Completed / 1.5))}${'░'.repeat(10 - Math.round(ch1Completed / 1.5))}] ${ch1Completed}/15 Cases

- **Chapter 2: Financial Forensics & Grouping (GROUP BY, HAVING)**
  [${'█'.repeat(Math.round(ch2Completed / 2))}${'░'.repeat(10 - Math.round(ch2Completed / 2))}] ${ch2Completed}/20 Cases

- **Chapter 3: Mainframe Overrides & Joins (JOIN, UNION)**
  [${'█'.repeat(Math.round(ch3Completed / 1.5))}${'░'.repeat(10 - Math.round(ch3Completed / 1.5))}] ${ch3Completed}/15 Cases

### 🔬 LEARNING COACH CORE RECOMMENDATION

${totalCompleted < 15 
  ? "You are developing strong core SQL fundamentals. **HQ recommends** focusing on Chapter 1 cases. Perfect your single-table filters (\`WHERE\`, \`LIKE\`) and output controls (\`ORDER BY\`, \`LIMIT\`) before entering complex groupings." 
  : totalCompleted < 35 
  ? "Excellent advancement. You have successfully bypassed basic firewalls. **HQ recommends** moving deeper into Chapter 2. Pay close attention to aggregate filtering using \`HAVING\` and sorting columns dynamically." 
  : "Sensational performance. You are performing at an elite forensic tier. **HQ recommends** concluding Chapter 3 mainframes. Focus on mastering complex \`LEFT JOIN\` scenarios and deep nested correlations to secure the entire network."}`;
}

/**
 * AI Chat Detective: Provide instant offline forensic responses to player chat messages.
 */
export async function fetchDetectiveReply(params: {
  messages: ChatMessage[];
  levelContext: LevelContext;
}): Promise<string> {
  const { messages, levelContext } = params;
  const userMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';

  // Parse chat inputs for keywords and respond with specialized SQL guidance
  if (userMsg.includes('hint') || userMsg.includes('clue') || userMsg.includes('stuck')) {
    return `Agent, if you're stuck on this file, check the **EVIDENCE BANK INTEL** panel in the bottom-left sidebar. You can use your Evidence Points (EP) to sequentially unlock progressive clues:
1. **Table Clue:** Identifies which tables are involved.
2. **Column Clue:** Specifies the primary filter column variables.
3. **Syntax Clue:** Shows the structured keywords needed.`;
  }

  if (userMsg.includes('schema') || userMsg.includes('table') || userMsg.includes('column') || userMsg.includes('suspect')) {
    const tableNames = levelContext.schema?.map((t: any) => `\`${t.name}\``).join(', ') || 'suspects';
    return `Let's examine the target database schema for this level:
- **Available Tables:** ${tableNames}
- Review the **Schema Explorer** in the left-hand column to see exact column types (TEXT, INTEGER) and read descriptions. Spelling must match exactly!`;
  }

  if (userMsg.includes('join')) {
    return `To join tables together, specify the shared key that maps the records. For example:
\`\`\`sql
SELECT suspects.name, credit_cards.card_number
FROM suspects
INNER JOIN credit_cards ON suspects.id = credit_cards.suspect_id;
\`\`\``;
  }

  if (userMsg.includes('group') || userMsg.includes('count') || userMsg.includes('sum') || userMsg.includes('avg')) {
    return `When using aggregate functions (like \`COUNT(*)\`, \`SUM(bank_balance)\`, or \`AVG(age)\`), you must group by the non-aggregated columns. Example:
\`\`\`sql
SELECT city, COUNT(*) AS suspect_count
FROM suspects
GROUP BY city;
\`\`\``;
  }

  if (userMsg.includes('where') || userMsg.includes('filter') || userMsg.includes('like')) {
    return `The \`WHERE\` clause filters your dataset before any groupings. Use \`LIKE\` with percent wildcards for partial text searches:
\`\`\`sql
WHERE name LIKE 'Agent%'; -- Starts with Agent
WHERE car_model LIKE '%Tesla%'; -- Contains Tesla
\`\`\``;
  }

  if (userMsg.includes('limit') || userMsg.includes('order')) {
    return `Use \`ORDER BY\` to sort results, and \`LIMIT\` to return a exact number of rows. Example:
\`\`\`sql
SELECT * FROM suspects
ORDER BY bank_balance DESC
LIMIT 1; -- Retrieves the single richest suspect
\`\`\``;
  }

  return `Understood, Agent. I have analyzed the telemetry parameters for **"${levelContext.title}"**.

**Objective Reminder:** "${levelContext.objective}"

To solve this case, I advise you to:
1. Identify which tables and columns in the **Schema Explorer** match the goal.
2. Formulate your query using standard SQLite.
3. Execute the compiler to check for integrity.

What SQL syntax or keyword can I assist you with next?`;
}

/**
 * AI Case Generator: Generate infinite high-quality custom levels completely offline
 * by selecting from curated handcrafted scenario blueprints.
 */
export async function fetchGeneratedCase(params: {
  concept: string;
  difficulty: string;
  theme: string;
}): Promise<any> {
  const { concept, difficulty, theme } = params;

  // Let's create an offline library of amazing case templates!
  const themeNames: Record<string, string> = {
    'BLOCKCHAIN CRYPTO FRAUD': 'CRYPTO COIN TRANSACTION LEDGER',
    'ROGUE SECURITY DRONE OVERRIDES': 'DRONE AVIONICS SECURE INTERFACE',
    'AI MAINFRAME MEMORY DRIFTS': 'MAINFRAME SYNAPSE REGISTRY',
    'QUANTUM KEY EXCHANGE AUDIT': 'QUANTUM RELAY EXCHANGE JOURNAL'
  };

  const realTheme = themeNames[theme] || theme;

  // Compile standard mock levels based on concept selection
  if (concept === 'INNER JOIN') {
    return {
      title: `SYNTH-CASE: ${realTheme} EXPLORATION`,
      concept: 'INNER JOIN',
      story: `A rogue intruder infiltrated the database in the target theme. We have a list of system operators and their corresponding session audit logs, but the session timestamps are corrupt. We need to join the tables to trace exactly who accessed the terminal.`,
      objective: `Retrieve the 'operator_name', 'session_id', and 'access_level' from 'operators' combined with 'session_logs' where 'operators.id' equals 'session_logs.operator_id'.`,
      databaseSchema: {
        operators: [
          { name: 'id', type: 'INTEGER', description: 'Unique operator ID' },
          { name: 'operator_name', type: 'TEXT', description: 'Full name' },
          { name: 'access_level', type: 'TEXT', description: 'Security access level' }
        ],
        session_logs: [
          { name: 'session_id', type: 'INTEGER', description: 'Unique session ID' },
          { name: 'operator_id', type: 'INTEGER', description: 'ID referencing operators table' },
          { name: 'ip_address', type: 'TEXT', description: 'Client IP address' }
        ]
      },
      hints: [
        'Use INNER JOIN to link the tables.',
        'Link them ON operators.id = session_logs.operator_id.',
        'The query format is: SELECT operators.operator_name, session_logs.session_id, operators.access_level FROM operators INNER JOIN session_logs ON operators.id = session_logs.operator_id;'
      ],
      initialQuery: `-- Correlate operators with session logs\nSELECT `,
      expectedQuery: `SELECT operators.operator_name, session_logs.session_id, operators.access_level FROM operators INNER JOIN session_logs ON operators.id = session_logs.operator_id;`,
      sqlSetup: `
        CREATE TABLE IF NOT EXISTS operators (id INTEGER PRIMARY KEY, operator_name TEXT, access_level TEXT);
        CREATE TABLE IF NOT EXISTS session_logs (session_id INTEGER PRIMARY KEY, operator_id INTEGER, ip_address TEXT);
        DELETE FROM operators;
        DELETE FROM session_logs;
        INSERT INTO operators (id, operator_name, access_level) VALUES 
          (10, 'Agent Vesper', 'LEVEL_4'),
          (20, 'Dr. Aris', 'LEVEL_2'),
          (30, 'Dev Null', 'LEVEL_1');
        INSERT INTO session_logs (session_id, operator_id, ip_address) VALUES 
          (501, 10, '192.168.4.12'),
          (502, 30, '10.0.0.99');
      `
    };
  }

  if (concept.includes('LEFT')) {
    return {
      title: `SYNTH-CASE: ${realTheme} AUDIT GAP ANALYSIS`,
      concept: 'LEFT JOIN',
      story: `An emergency wipe was issued. We need to identify any registered hardware devices that have NEVER registered a telemetry payload log entry in our ledger. This indicates inactive or rogue hardware.`,
      objective: `Retrieve the 'device_serial' from 'devices' and 'payload_id' from 'payloads' using a LEFT JOIN where 'devices.id' equals 'payloads.device_id'.`,
      databaseSchema: {
        devices: [
          { name: 'id', type: 'INTEGER', description: 'Unique device identifier' },
          { name: 'device_serial', type: 'TEXT', description: 'Hardware serial tag' }
        ],
        payloads: [
          { name: 'payload_id', type: 'INTEGER', description: 'Payload transmission ID' },
          { name: 'device_id', type: 'INTEGER', description: 'Associated device reference' }
        ]
      },
      hints: [
        'Use LEFT JOIN to retain all devices even if they have no payload records.',
        'Check matching key: devices.id = payloads.device_id.',
        'Query: SELECT devices.device_serial, payloads.payload_id FROM devices LEFT JOIN payloads ON devices.id = payloads.device_id;'
      ],
      initialQuery: `-- Identify all device allocations\nSELECT `,
      expectedQuery: `SELECT devices.device_serial, payloads.payload_id FROM devices LEFT JOIN payloads ON devices.id = payloads.device_id;`,
      sqlSetup: `
        CREATE TABLE IF NOT EXISTS devices (id INTEGER PRIMARY KEY, device_serial TEXT);
        CREATE TABLE IF NOT EXISTS payloads (payload_id INTEGER PRIMARY KEY, device_id INTEGER);
        DELETE FROM devices;
        DELETE FROM payloads;
        INSERT INTO devices (id, device_serial) VALUES 
          (1, 'DRN-X900-OMEGA'),
          (2, 'DRN-Y300-ALPHA'),
          (3, 'DRN-Z50-BETA');
        INSERT INTO payloads (payload_id, device_id) VALUES 
          (9001, 1),
          (9002, 3);
      `
    };
  }

  if (concept.includes('GROUP BY') || concept.includes('COUNT')) {
    return {
      title: `SYNTH-CASE: ${realTheme} AGGREGATION AUDIT`,
      concept: 'GROUP BY',
      story: `To optimize processing power, Headquarters requested a summary report detailing the total number of telemetry alerts flagged per security zone.`,
      objective: `Retrieve 'zone_id' and count the number of alerts as 'alert_count' from the 'alerts' table, grouped by 'zone_id'.`,
      databaseSchema: {
        alerts: [
          { name: 'id', type: 'INTEGER', description: 'Alert ID' },
          { name: 'zone_id', type: 'TEXT', description: 'Security area code' },
          { name: 'severity', type: 'TEXT', description: 'Alert critical status' }
        ]
      },
      hints: [
        'Select zone_id and COUNT(*) as alert_count.',
        'Remember to add the GROUP BY zone_id clause at the end.',
        'Query: SELECT zone_id, COUNT(*) AS alert_count FROM alerts GROUP BY zone_id;'
      ],
      initialQuery: `-- Count alerts grouped by zone\nSELECT `,
      expectedQuery: `SELECT zone_id, COUNT(*) AS alert_count FROM alerts GROUP BY zone_id;`,
      sqlSetup: `
        CREATE TABLE IF NOT EXISTS alerts (id INTEGER PRIMARY KEY, zone_id TEXT, severity TEXT);
        DELETE FROM alerts;
        INSERT INTO alerts (id, zone_id, severity) VALUES 
          (1, 'ZONE_A', 'CRITICAL'),
          (2, 'ZONE_B', 'WARNING'),
          (3, 'ZONE_A', 'INFO'),
          (4, 'ZONE_C', 'WARNING'),
          (5, 'ZONE_B', 'CRITICAL');
      `
    };
  }

  if (concept.includes('HAVING')) {
    return {
      title: `SYNTH-CASE: ${realTheme} HIGH CAPACITY FILTERING`,
      concept: 'HAVING',
      story: `Rogue nodes are sending high volume queries. Isolate only the specific network servers that have generated STRICTLY MORE THAN 2 warning logs to prevent system crashes.`,
      objective: `Select 'server_node' and the count of warnings as 'warning_count' from 'server_logs', grouped by 'server_node' having a count strictly greater than 2.`,
      databaseSchema: {
        server_logs: [
          { name: 'id', type: 'INTEGER', description: 'Log ID' },
          { name: 'server_node', type: 'TEXT', description: 'Server machine identifier' },
          { name: 'log_type', type: 'TEXT', description: 'Warning or Error state' }
        ]
      },
      hints: [
        'Group by server_node first.',
        'Use HAVING COUNT(*) > 2 to filter the grouped counts.',
        'Query: SELECT server_node, COUNT(*) AS warning_count FROM server_logs GROUP BY server_node HAVING COUNT(*) > 2;'
      ],
      initialQuery: `-- Identify high frequency server logs\nSELECT `,
      expectedQuery: `SELECT server_node, COUNT(*) AS warning_count FROM server_logs GROUP BY server_node HAVING COUNT(*) > 2;`,
      sqlSetup: `
        CREATE TABLE IF NOT EXISTS server_logs (id INTEGER PRIMARY KEY, server_node TEXT, log_type TEXT);
        DELETE FROM server_logs;
        INSERT INTO server_logs (id, server_node, log_type) VALUES 
          (1, 'NODE-01', 'WARNING'),
          (2, 'NODE-01', 'WARNING'),
          (3, 'NODE-02', 'WARNING'),
          (4, 'NODE-01', 'WARNING'),
          (5, 'NODE-03', 'WARNING'),
          (6, 'NODE-02', 'WARNING');
      `
    };
  }

  if (concept.includes('SUBQUERIES') || concept.includes('NESTED')) {
    return {
      title: `SYNTH-CASE: ${realTheme} SUBQUERY SEGREGATION`,
      concept: 'SUBQUERIES',
      story: `We need to retrieve lists of users who belong to the department that has the maximum database balance limit of 5000 credits, but we must do this dynamically using a subquery.`,
      objective: `Select 'username' and 'credits' from 'employees' where 'credits' exceeds the average credits of all employees in the database.`,
      databaseSchema: {
        employees: [
          { name: 'id', type: 'INTEGER', description: 'Employee identifier' },
          { name: 'username', type: 'TEXT', description: 'Staff username handle' },
          { name: 'credits', type: 'INTEGER', description: 'Allocated system credits' }
        ]
      },
      hints: [
        'Write a nested subquery: (SELECT AVG(credits) FROM employees).',
        'Compare credits > (subquery) in your WHERE clause.',
        'Query: SELECT username, credits FROM employees WHERE credits > (SELECT AVG(credits) FROM employees);'
      ],
      initialQuery: `-- Find employees with above average credits\nSELECT `,
      expectedQuery: `SELECT username, credits FROM employees WHERE credits > (SELECT AVG(credits) FROM employees);`,
      sqlSetup: `
        CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY, username TEXT, credits INTEGER);
        DELETE FROM employees;
        INSERT INTO employees (id, username, credits) VALUES 
          (1, 'agent.k', 1200),
          (2, 'analyst.p', 2500),
          (3, 'overlord.x', 6000),
          (4, 'trainee.r', 800);
      `
    };
  }

  // Fallback / LIKE concept
  return {
    title: `SYNTH-CASE: ${realTheme} PARTIAL MATCH DETECTION`,
    concept: 'LIKE',
    story: `A malware signature is hiding inside our system file register. We know the extension ends with '.tmp' and contains 'hack' in its name. Find all potential rogue items.`,
    objective: `Select 'filename' and 'file_size' from 'registry' where the 'filename' contains the substring 'hack'.`,
    databaseSchema: {
      registry: [
        { name: 'id', type: 'INTEGER', description: 'Unique file index' },
        { name: 'filename', type: 'TEXT', description: 'System filename' },
        { name: 'file_size', type: 'INTEGER', description: 'Size on disk' }
      ]
    },
    hints: [
      'Use the LIKE operator with wildcards.',
      "Write filename LIKE '%hack%'.",
      "Query: SELECT filename, file_size FROM registry WHERE filename LIKE '%hack%';"
    ],
    initialQuery: `-- Filter files containing hack substring\nSELECT `,
    expectedQuery: `SELECT filename, file_size FROM registry WHERE filename LIKE '%hack%';`,
    sqlSetup: `
      CREATE TABLE IF NOT EXISTS registry (id INTEGER PRIMARY KEY, filename TEXT, file_size INTEGER);
      DELETE FROM registry;
      INSERT INTO registry (id, filename, file_size) VALUES 
        (1, 'kernel_config.sys', 4096),
        (2, 'blockchain_hack_payload.tmp', 16384),
        (3, 'security_manifest.xml', 8192),
        (4, 'hack_scanner.exe', 102400);
    `
  };
}
