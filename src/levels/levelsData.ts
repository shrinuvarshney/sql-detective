import { Level } from '../types';

export const levels: Level[] = [
  {
    id: 1,
    title: "Case File 001 - The Blueprint Theft",
    concept: "SELECT",
    story: "Someone hacked the quantum energy grid database and stole the blueprint for the Neo-City Fusion Reactor. The agency has gathered a database of potential hacker suspects, but we need to see all suspect profiles to start our investigation. Let's list everyone.",
    objective: "Retrieve all columns and records from the 'suspects' table.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER", description: "Unique suspect identifier" },
          { name: "name", type: "TEXT", description: "Full name of the suspect" },
          { name: "age", type: "INTEGER", description: "Age of the suspect" },
          { name: "occupation", type: "TEXT", description: "Registered occupation" },
          { name: "city", type: "TEXT", description: "Current city of residence" },
          { name: "bank_balance", type: "INTEGER", description: "Bank balance in credits" },
          { name: "car_model", type: "TEXT", description: "Model of personal vehicle" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "Use the SELECT keyword to fetch columns from the database.",
      "To select ALL columns at once, use the asterisk '*' symbol.",
      "The query structure should be: SELECT * FROM table_name;"
    ],
    initialQuery: "-- Retrieve all suspects to review their profiles\nSELECT ",
    expectedQuery: "SELECT * FROM suspects;"
  },
  {
    id: 2,
    title: "Case File 002 - The High-Roller",
    concept: "WHERE",
    story: "Cyber intel shows that the stolen reactor blueprint was sold on the dark web for over 1,000,000 credits. Only suspects with an unusually high net worth could afford this purchase. Let's filter the suspects to find who has a bank balance exceeding one million credits.",
    objective: "Retrieve the 'name' and 'bank_balance' of all suspects whose 'bank_balance' is strictly greater than 1000000.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "age", type: "INTEGER" },
          { name: "occupation", type: "TEXT" },
          { name: "city", type: "TEXT" },
          { name: "bank_balance", type: "INTEGER" },
          { name: "car_model", type: "TEXT" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "Specify only the 'name' and 'bank_balance' columns, separated by a comma, after the SELECT keyword.",
      "Use the WHERE clause to filter rows based on a condition.",
      "The filter condition should look like: bank_balance > 1000000."
    ],
    initialQuery: "-- Select name and bank_balance of suspects with balance > 1000000\nSELECT ",
    expectedQuery: "SELECT name, bank_balance FROM suspects WHERE bank_balance > 1000000;"
  },
  {
    id: 3,
    title: "Case File 003 - Age is Just a Number",
    concept: "ORDER BY",
    story: "An anonymous source claims the reactor thief is a veteran cyber security architect or dealer who has been in the industry for decades. We need to check our entire list of suspects, sorted by age from the oldest to the youngest.",
    objective: "Retrieve all columns from the 'suspects' table, sorted by 'age' in descending (highest to lowest) order.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "age", type: "INTEGER" },
          { name: "occupation", type: "TEXT" },
          { name: "city", type: "TEXT" },
          { name: "bank_balance", type: "INTEGER" },
          { name: "car_model", type: "TEXT" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "To retrieve all columns, use 'SELECT * FROM suspects'.",
      "Use the ORDER BY clause at the end of the query to sort results.",
      "For sorting from highest to lowest, add the 'DESC' keyword after the column name 'age'."
    ],
    initialQuery: "-- Sort suspects by age from oldest to youngest\nSELECT * FROM suspects ",
    expectedQuery: "SELECT * FROM suspects ORDER BY age DESC;"
  },
  {
    id: 4,
    title: "Case File 004 - The Prodigy Suspect",
    concept: "LIMIT",
    story: "Wait! A secondary report claims that the heist was actually pulled off by a young hacking prodigy—specifically, the youngest individual registered in our suspects database. Find this single youngest suspect.",
    objective: "Retrieve all columns of the single youngest suspect by sorting by 'age' in ascending order and limiting the results to 1 row.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "age", type: "INTEGER" },
          { name: "occupation", type: "TEXT" },
          { name: "city", type: "TEXT" },
          { name: "bank_balance", type: "INTEGER" },
          { name: "car_model", type: "TEXT" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "Use ORDER BY age ASC (or just ORDER BY age) to sort suspects from youngest to oldest.",
      "Use the LIMIT clause to restrict the output to a specified number of rows.",
      "Append 'LIMIT 1' to keep only the single first row in the sorted results."
    ],
    initialQuery: "-- Retrieve the single youngest suspect from the list\nSELECT * FROM suspects ORDER BY ",
    expectedQuery: "SELECT * FROM suspects ORDER BY age ASC LIMIT 1;"
  },
  {
    id: 5,
    title: "Case File 005 - The Safe Houses",
    concept: "DISTINCT",
    story: "The perpetrator is known to be moving frequently between cities where our syndicate suspects have properties. To coordinate with local police departments, we need to list all unique cities where our suspects reside.",
    objective: "Retrieve a list of all unique (distinct) cities from the 'suspects' table.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "age", type: "INTEGER" },
          { name: "occupation", type: "TEXT" },
          { name: "city", type: "TEXT" },
          { name: "bank_balance", type: "INTEGER" },
          { name: "car_model", type: "TEXT" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "The DISTINCT keyword filters out duplicate rows from the query output.",
      "Place DISTINCT immediately after SELECT and before the column name 'city'.",
      "The query structure: SELECT DISTINCT column_name FROM table_name;"
    ],
    initialQuery: "-- Find all unique cities where suspects live\nSELECT ",
    expectedQuery: "SELECT DISTINCT city FROM suspects;"
  },
  {
    id: 6,
    title: "Case File 006 - Syndicate Funding",
    concept: "GROUP BY",
    story: "Criminal organizations are often structured around specific occupational sectors. We suspect a particular sector is financing the black market trading of reactor parts. Let's find the average bank balance of suspects in each occupation group.",
    objective: "Retrieve the 'occupation' and the average 'bank_balance' (using AVG function) for each occupation. Group the results by 'occupation'. Alias the average bank balance column as 'avg_balance'.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "age", type: "INTEGER" },
          { name: "occupation", type: "TEXT" },
          { name: "city", type: "TEXT" },
          { name: "bank_balance", type: "INTEGER" },
          { name: "car_model", type: "TEXT" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "The aggregate function is AVG(bank_balance) AS avg_balance.",
      "You need to output two columns: occupation, AVG(bank_balance) AS avg_balance.",
      "Use 'GROUP BY occupation' to group rows that have the same values in the occupation column."
    ],
    initialQuery: "-- Calculate the average bank balance for each occupation sector\nSELECT occupation, AVG(bank_balance) AS avg_balance FROM suspects ",
    expectedQuery: "SELECT occupation, AVG(bank_balance) AS avg_balance FROM suspects GROUP BY occupation;"
  },
  {
    id: 7,
    title: "Case File 007 - Wealthy Cabals",
    concept: "HAVING",
    story: "Now we need to narrow down our investigation. We only care about occupation sectors where the average bank balance exceeds 800,000 credits, as these are wealthy enough to buy the cyber weapons stolen from our quantum grids.",
    objective: "Group suspects by 'occupation' and calculate the average bank balance (as 'avg_balance'). Filter the groups to show only those occupations whose average bank balance is greater than 800000.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "occupation", type: "TEXT" },
          { name: "bank_balance", type: "INTEGER" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "The HAVING clause is used to filter group results created by GROUP BY, whereas WHERE filters individual rows.",
      "Calculate average balance using: AVG(bank_balance) AS avg_balance.",
      "Apply the HAVING clause after GROUP BY, like: HAVING AVG(bank_balance) > 800000."
    ],
    initialQuery: "-- Find occupations with average bank balance > 800000\nSELECT occupation, AVG(bank_balance) AS avg_balance FROM suspects GROUP BY occupation ",
    expectedQuery: "SELECT occupation, AVG(bank_balance) AS avg_balance FROM suspects GROUP BY occupation HAVING AVG(bank_balance) > 800000;"
  },
  {
    id: 8,
    title: "Case File 008 - The Phone Records",
    concept: "INNER JOIN",
    story: "We intercepted an encrypted phone call placed from Sector 4 to a known black-market broker exactly when the energy grid went dark. The caller's ID matches one of our suspects. Let's join the 'suspects' table with our 'phone_calls' records to match phone calls with the actual names of our suspects.",
    objective: "Retrieve the suspect's 'name' (from suspects table) and 'duration_seconds' (from phone_calls table) of their calls using an INNER JOIN. Connect suspects and phone_calls where 'suspects.id = phone_calls.caller_id'.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER", description: "Suspect ID" },
          { name: "name", type: "TEXT", description: "Suspect name" }
        ],
        rowCount: 10
      },
      {
        name: "phone_calls",
        columns: [
          { name: "id", type: "INTEGER", description: "Call record ID" },
          { name: "caller_id", type: "INTEGER", description: "ID of the suspect who made the call" },
          { name: "receiver_id", type: "INTEGER", description: "ID of call receiver" },
          { name: "duration_seconds", type: "INTEGER", description: "Call duration in seconds" },
          { name: "timestamp", type: "TEXT", description: "Time of call" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use 'FROM suspects INNER JOIN phone_calls ON suspects.id = phone_calls.caller_id'.",
      "Specify columns as 'suspects.name' and 'phone_calls.duration_seconds' in the SELECT statement.",
      "Make sure you join on suspects.id and phone_calls.caller_id."
    ],
    initialQuery: "-- Retrieve caller name and call duration by joining suspects and phone_calls\nSELECT ",
    expectedQuery: "SELECT suspects.name, phone_calls.duration_seconds FROM suspects INNER JOIN phone_calls ON suspects.id = phone_calls.caller_id;"
  },
  {
    id: 9,
    title: "Case File 009 - Missing Alibis",
    concept: "LEFT JOIN",
    story: "We need a complete roster of all suspects, along with details of any registered crime records associated with them. Crucially, we must also include suspects who currently have NO registered crime records (their crime title will appear as NULL), as they might be first-time offenders hiding under our radar.",
    objective: "Perform a LEFT JOIN to retrieve the suspect's 'name' (from suspects table) and their crime's 'title' (from crimes table) on 'suspects.id = crimes.suspect_id'.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER", description: "Suspect ID" },
          { name: "name", type: "TEXT", description: "Suspect name" }
        ],
        rowCount: 10
      },
      {
        name: "crimes",
        columns: [
          { name: "id", type: "INTEGER", description: "Crime record ID" },
          { name: "title", type: "TEXT", description: "Description/Title of the crime" },
          { name: "date", type: "TEXT", description: "Crime occurrence date" },
          { name: "severity", type: "TEXT", description: "Severity level of crime" },
          { name: "suspect_id", type: "INTEGER", description: "ID of suspect tied to crime" }
        ],
        rowCount: 4
      }
    ],
    hints: [
      "A LEFT JOIN returns all rows from the left table (suspects), and matched rows from the right table (crimes). Unmatched rows on the right will show NULL.",
      "The join statement is: FROM suspects LEFT JOIN crimes ON suspects.id = crimes.suspect_id.",
      "Select 'suspects.name' and 'crimes.title'."
    ],
    initialQuery: "-- Find all suspects and their crimes (including suspects with no crimes)\nSELECT ",
    expectedQuery: "SELECT suspects.name, crimes.title FROM suspects LEFT JOIN crimes ON suspects.id = crimes.suspect_id;"
  },
  {
    id: 10,
    title: "Case File 010 - The Mastermind Boss",
    concept: "Subqueries",
    story: "We have reached the climax! Our informant has cracked the syndicate's mainframe. The syndicate leader is the individual who holds the maximum bank balance among all suspects over the age of 40. We must write a subquery to pinpoint this mastermind and close the file!",
    objective: "Select the 'name' and 'bank_balance' of the suspect whose 'bank_balance' is exactly equal to the maximum bank balance of all suspects whose 'age' is strictly greater than 40.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" },
          { name: "age", type: "INTEGER" },
          { name: "bank_balance", type: "INTEGER" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "Use a subquery inside your WHERE clause: WHERE bank_balance = (SELECT MAX(bank_balance) FROM ... WHERE age > 40).",
      "The subquery is: (SELECT MAX(bank_balance) FROM suspects WHERE age > 40).",
      "The main query is: SELECT name, bank_balance FROM suspects WHERE bank_balance = (your_subquery);"
    ],
    initialQuery: "-- Unmask the mastermind using a subquery\nSELECT name, bank_balance FROM suspects WHERE bank_balance = (SELECT ",
    expectedQuery: "SELECT name, bank_balance FROM suspects WHERE bank_balance = (SELECT MAX(bank_balance) FROM suspects WHERE age > 40);"
  },
  {
    id: 11,
    title: "Case File 011 - Operational Threat Matrix",
    concept: "CASE WHEN",
    story: "The cyber syndicate is planning a massive data ransom attack. To coordinate tactical response, our agency needs to classify all suspects into threat priority tiers. Suspects with a bank balance over 2,000,000 are 'Tier 1 - Extreme Threat', over 100,000 are 'Tier 2 - High Threat', and all others are 'Tier 3 - Low Threat'.",
    objective: "Select suspects' 'name', 'bank_balance', and classify them into a column aliased as 'threat_tier' using CASE WHEN based on the stated rules.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "name", type: "TEXT" },
          { name: "bank_balance", type: "INTEGER" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "Use a CASE WHEN clause inside the SELECT statement to map specific credit balances.",
      "The syntax is: CASE WHEN condition THEN value WHEN condition THEN value ELSE default END AS threat_tier.",
      "Check that your aliases and tier strings match exactly: 'Tier 1 - Extreme Threat', 'Tier 2 - High Threat', and 'Tier 3 - Low Threat'."
    ],
    initialQuery: "-- Categorize suspects by threat level\nSELECT name, bank_balance,\n  CASE \n    WHEN ",
    expectedQuery: "SELECT name, bank_balance, CASE WHEN bank_balance > 2000000 THEN 'Tier 1 - Extreme Threat' WHEN bank_balance > 100000 THEN 'Tier 2 - High Threat' ELSE 'Tier 3 - Low Threat' END AS threat_tier FROM suspects;"
  },
  {
    id: 12,
    title: "Case File 012 - Triangulated Intel",
    concept: "MULTI-TABLE JOIN",
    story: "We need to construct a complete timeline matching physical breaches with cyber activity. We suspect an insider leaked secure server credentials. Let's find any suspects who have crime records and who also made telephone calls recorded on our system.",
    objective: "Perform an INNER JOIN involving three tables: suspects, phone_calls, and crimes. Retrieve the suspect's 'name' (from suspects), call 'timestamp' (from phone_calls), and crime 'title' (from crimes). Join suspects with phone_calls on 'suspects.id = phone_calls.caller_id', and suspects with crimes on 'suspects.id = crimes.suspect_id'.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [{ name: "id", type: "INTEGER" }, { name: "name", type: "TEXT" }],
        rowCount: 10
      },
      {
        name: "phone_calls",
        columns: [{ name: "caller_id", type: "INTEGER" }, { name: "timestamp", type: "TEXT" }],
        rowCount: 5
      },
      {
        name: "crimes",
        columns: [{ name: "suspect_id", type: "INTEGER" }, { name: "title", type: "TEXT" }],
        rowCount: 4
      }
    ],
    hints: [
      "You need to write two INNER JOIN clauses in a row.",
      "First join: INNER JOIN phone_calls ON suspects.id = phone_calls.caller_id.",
      "Second join: INNER JOIN crimes ON suspects.id = crimes.suspect_id."
    ],
    initialQuery: "-- Join suspects with phone calls and crimes to find a dual match\nSELECT suspects.name, phone_calls.timestamp, crimes.title \nFROM suspects\n",
    expectedQuery: "SELECT suspects.name, phone_calls.timestamp, crimes.title FROM suspects INNER JOIN phone_calls ON suspects.id = phone_calls.caller_id INNER JOIN crimes ON suspects.id = crimes.suspect_id;"
  },
  {
    id: 13,
    title: "Case File 013 - Cross-Referenced Flags",
    concept: "UNION",
    story: "To prepare a security sweep list, we want to combine two distinct lists of interest: suspects residing in 'Sector 4' (flagged as 'Sector 4 Resident'), and suspects who own a vehicle of model 'Porsche Taycan' (flagged as 'High End Vehicle Owner').",
    objective: "Use UNION to merge two queries. The first query selects 'name' and the literal text 'Sector 4 Resident' AS 'flag' from 'suspects' where 'city = 'Sector 4''. The second query selects 'name' and the literal text 'High End Vehicle Owner' AS 'flag' where 'car_model = 'Porsche Taycan''. Sort the merged result by name.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [{ name: "name", type: "TEXT" }, { name: "city", type: "TEXT" }, { name: "car_model", type: "TEXT" }],
        rowCount: 10
      }
    ],
    hints: [
      "Use the UNION operator to combine the results of two SELECT queries.",
      "The second SELECT statement should filter where 'car_model = 'Porsche Taycan''.",
      "Apply the 'ORDER BY name' clause at the very end of the combined query."
    ],
    initialQuery: "-- Combine Sector 4 residents and Porsche Taycan owners\nSELECT name, 'Sector 4 Resident' AS flag FROM suspects WHERE city = 'Sector 4'\nUNION\n",
    expectedQuery: "SELECT name, 'Sector 4 Resident' AS flag FROM suspects WHERE city = 'Sector 4' UNION SELECT name, 'High End Vehicle Owner' AS flag FROM suspects WHERE car_model = 'Porsche Taycan' ORDER BY name;"
  },
  {
    id: 14,
    title: "Case File 014 - Correlated Chronology",
    concept: "DATE FILTERING",
    story: "Cyber forensics indicates a mainframe breach coincided exactly on the same day as physical unauthorized entries. We need to match suspects with their corresponding crimes and phone calls, but only where the phone call was made on the exact same date as the crime occurred. Note that phone_calls.timestamp contains date and time, so we must use SUBSTR() to extract the first 10 characters (the date).",
    objective: "INNER JOIN suspects, crimes, and phone_calls. Retrieve the suspect's 'name', crime 'title', and call 'timestamp'. Filter the records where suspects.id is matched to both crimes and phone_calls, and the date part of the call timestamp (first 10 characters extracted using 'SUBSTR(phone_calls.timestamp, 1, 10)') matches the crime 'date' exactly.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [{ name: "id", type: "INTEGER" }, { name: "name", type: "TEXT" }],
        rowCount: 10
      },
      {
        name: "crimes",
        columns: [{ name: "suspect_id", type: "INTEGER" }, { name: "title", type: "TEXT" }, { name: "date", type: "TEXT" }],
        rowCount: 4
      },
      {
        name: "phone_calls",
        columns: [{ name: "caller_id", type: "INTEGER" }, { name: "timestamp", type: "TEXT" }],
        rowCount: 5
      }
    ],
    hints: [
      "Join suspects, crimes on 'suspects.id = crimes.suspect_id' and phone_calls on 'suspects.id = phone_calls.caller_id'.",
      "Use SUBSTR(phone_calls.timestamp, 1, 10) to slice just the 'YYYY-MM-DD' date.",
      "Add a WHERE clause that equates this SUBSTR value with crimes.date."
    ],
    initialQuery: "-- Match suspect activities happening on the exact same date\nSELECT suspects.name, crimes.title, phone_calls.timestamp \nFROM suspects\n",
    expectedQuery: "SELECT suspects.name, crimes.title, phone_calls.timestamp FROM suspects INNER JOIN crimes ON suspects.id = crimes.suspect_id INNER JOIN phone_calls ON suspects.id = phone_calls.caller_id WHERE SUBSTR(phone_calls.timestamp, 1, 10) = crimes.date;"
  },
  {
    id: 15,
    title: "Case File 015 - Veteran Sector Logs",
    concept: "COMPLEX GROUP BY & JOIN",
    story: "For our final tactical brief, we want to analyze the coordination patterns of veteran operators. Let's calculate the average duration of phone calls made by suspects grouped by their occupation, but only including call logs of suspects who are older than 30 years.",
    objective: "INNER JOIN suspects and phone_calls on 'suspects.id = phone_calls.caller_id'. Select the suspect's 'occupation' and the average 'duration_seconds' (as 'avg_duration'). Filter rows where 'suspects.age > 30', group by 'suspects.occupation', and sort the results by 'avg_duration' in descending order.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [{ name: "id", type: "INTEGER" }, { name: "occupation", type: "TEXT" }, { name: "age", type: "INTEGER" }],
        rowCount: 10
      },
      {
        name: "phone_calls",
        columns: [{ name: "caller_id", type: "INTEGER" }, { name: "duration_seconds", type: "INTEGER" }],
        rowCount: 5
      }
    ],
    hints: [
      "Join 'suspects' with 'phone_calls' on 'suspects.id = phone_calls.caller_id'.",
      "Use 'WHERE suspects.age > 30' to filter out younger suspects before grouping.",
      "Group by 'suspects.occupation' and add 'ORDER BY avg_duration DESC' to sort the average durations from longest to shortest."
    ],
    initialQuery: "-- Analyze veterans' average call duration grouped by occupation\nSELECT suspects.occupation, AVG(phone_calls.duration_seconds) AS avg_duration \nFROM suspects\n",
    expectedQuery: "SELECT suspects.occupation, AVG(phone_calls.duration_seconds) AS avg_duration FROM suspects INNER JOIN phone_calls ON suspects.id = phone_calls.caller_id WHERE suspects.age > 30 GROUP BY suspects.occupation ORDER BY avg_duration DESC;"
  }
];
