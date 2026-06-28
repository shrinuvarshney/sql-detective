import { Level } from '../types';

export const chapter2Levels: Level[] = [
  {
    id: 21,
    title: "Case File 021 - Financial Accumulations",
    concept: "SUM AGGREGATION",
    story: "We need to audit the capital transfer streams of our suspicious bank accounts. Find the total sum of credits transferred in wire transfers.",
    objective: "Calculate the total SUM of 'amount' (as 'total_wire_credits') in the 'bank_transactions' table where the 'type' is equal to 'Wire Transfer'.",
    databaseSchema: [
      {
        name: "bank_transactions",
        columns: [
          { name: "amount", type: "INTEGER" },
          { name: "type", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use SUM(amount) AS total_wire_credits.",
      "Add a WHERE filter to select rows with type = 'Wire Transfer'."
    ],
    initialQuery: "-- Calculate total wire transfer volume\nSELECT ",
    expectedQuery: "SELECT SUM(amount) AS total_wire_credits FROM bank_transactions WHERE type = 'Wire Transfer';"
  },
  {
    id: 22,
    title: "Case File 022 - High Bandwidth Intrusion",
    concept: "MAX & GROUP BY",
    story: "Which protocol transferred the highest quantity of data? Let's check the maximum bytes transferred for successful connections, grouped by protocol.",
    objective: "Retrieve 'protocol' and the maximum 'bytes_transferred' (aliased as 'max_bytes') from the 'network_logs' table where 'status = 'Success'', grouped by 'protocol'.",
    databaseSchema: [
      {
        name: "network_logs",
        columns: [
          { name: "protocol", type: "TEXT" },
          { name: "bytes_transferred", type: "INTEGER" },
          { name: "status", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use MAX(bytes_transferred) AS max_bytes.",
      "Filter with WHERE status = 'Success' and group by protocol."
    ],
    initialQuery: "-- Find maximum transfer sizes by protocol\nSELECT protocol, ",
    expectedQuery: "SELECT protocol, MAX(bytes_transferred) AS max_bytes FROM network_logs WHERE status = 'Success' GROUP BY protocol;"
  },
  {
    id: 23,
    title: "Case File 023 - Access Clearance Hierarchy",
    concept: "COUNT & GROUP BY",
    story: "To analyze server access policies, let's look at keycard scans across different security access clearances.",
    objective: "Retrieve 'access_level' and the COUNT of access cards (aliased as 'card_count') in the 'access_cards' table, grouped by 'access_level'.",
    databaseSchema: [
      {
        name: "access_cards",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "access_level", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "The query structure should select access_level and COUNT(id) AS card_count.",
      "Use GROUP BY access_level."
    ],
    initialQuery: "-- Tally registered cards per clearance level\nSELECT access_level, ",
    expectedQuery: "SELECT access_level, COUNT(id) AS card_count FROM access_cards GROUP BY access_level;"
  },
  {
    id: 24,
    title: "Case File 024 - Active Quantum Nodes",
    concept: "COUNT WITH WHERE",
    story: "The quantum reactor system can only support so many nodes. We need a tally of active online servers.",
    objective: "Retrieve the COUNT of servers (aliased as 'active_count') from the 'servers' table where 'active_status' is equal to 'Active'.",
    databaseSchema: [
      {
        name: "servers",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "active_status", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use COUNT(id) AS active_count.",
      "Filter with WHERE active_status = 'Active'."
    ],
    initialQuery: "-- Tally all online server platforms\nSELECT ",
    expectedQuery: "SELECT COUNT(id) AS active_count FROM servers WHERE active_status = 'Active';"
  },
  {
    id: 25,
    title: "Case File 025 - Insiders Under Cover",
    concept: "UPPER STRING CONVERSION",
    story: "Our intelligence indicates a mole registered under the name 'marcus vance' but capitalized differently. Let's do a case-insensitive search by converting names to uppercase.",
    objective: "Retrieve 'employee_name' and 'access_level' from the 'access_cards' table where the employee name, converted to uppercase, matches 'MARCUS VANCE'.",
    databaseSchema: [
      {
        name: "access_cards",
        columns: [
          { name: "employee_name", type: "TEXT" },
          { name: "access_level", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use the UPPER(employee_name) function to convert names.",
      "Compare with the exact string 'MARCUS VANCE'."
    ],
    initialQuery: "-- Trace suspects by matching uppercase employee names\nSELECT employee_name, access_level FROM access_cards WHERE ",
    expectedQuery: "SELECT employee_name, access_level FROM access_cards WHERE UPPER(employee_name) = 'MARCUS VANCE';"
  },
  {
    id: 26,
    title: "Case File 026 - System Administration Subnet",
    concept: "NOT LIKE FILTERING",
    story: "Some network packets bypassed our security proxy. We need to identify any successful network connections that did NOT originate from the local 192.168.1. subnet.",
    objective: "Retrieve the 'source_ip' and 'bytes_transferred' from the 'network_logs' table where 'status' is 'Success' and 'source_ip' does NOT look like '192.168.1.%'.",
    databaseSchema: [
      {
        name: "network_logs",
        columns: [
          { name: "source_ip", type: "TEXT" },
          { name: "bytes_transferred", type: "INTEGER" },
          { name: "status", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use NOT LIKE '192.168.1.%' in your conditional clause.",
      "Combine this with status = 'Success' using an AND."
    ],
    initialQuery: "-- Find external successful data packet transfers\nSELECT source_ip, bytes_transferred FROM network_logs WHERE status = 'Success' AND ",
    expectedQuery: "SELECT source_ip, bytes_transferred FROM network_logs WHERE status = 'Success' AND source_ip NOT LIKE '192.168.1.%';"
  },
  {
    id: 27,
    title: "Case File 027 - Suspect Co-conspirators",
    concept: "JOIN ON NAME MATCH",
    story: "The physical breach of Quantum Labs occurred when someone scanned an access card. Let's join the suspects and access cards tables where the suspect's name matches the employee name.",
    objective: "Retrieve 'suspects.name', 'suspects.city', and 'access_cards.clearance_code' by inner joining 'suspects' and 'access_cards' on 'suspects.name = access_cards.employee_name'.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "name", type: "TEXT" },
          { name: "city", type: "TEXT" }
        ],
        rowCount: 10
      },
      {
        name: "access_cards",
        columns: [
          { name: "employee_name", type: "TEXT" },
          { name: "clearance_code", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use suspects INNER JOIN access_cards ON suspects.name = access_cards.employee_name.",
      "Ensure proper prefixes are used for the columns."
    ],
    initialQuery: "-- Match sus profile coordinates with clearance logs\nSELECT suspects.name, suspects.city, access_cards.clearance_code FROM suspects\n",
    expectedQuery: "SELECT suspects.name, suspects.city, access_cards.clearance_code FROM suspects INNER JOIN access_cards ON suspects.name = access_cards.employee_name;"
  },
  {
    id: 28,
    title: "Case File 028 - Large Transactor Auditing",
    concept: "HAVING & SUM",
    story: "We need to find accounts that received multiple high-amount transfers. Let's group transactions by receiver account and find those receiving more than 100,000 total credits.",
    objective: "Retrieve 'receiver_account' and the sum of transfer amounts (as 'total_received') from the 'bank_transactions' table, grouped by 'receiver_account' having 'total_received' strictly greater than 100000.",
    databaseSchema: [
      {
        name: "bank_transactions",
        columns: [
          { name: "receiver_account", type: "TEXT" },
          { name: "amount", type: "INTEGER" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Select 'receiver_account' and 'SUM(amount) AS total_received'.",
      "Apply 'GROUP BY receiver_account' and then 'HAVING SUM(amount) > 100000'."
    ],
    initialQuery: "-- Filter for major bank receivers\nSELECT receiver_account, SUM(amount) AS total_received FROM bank_transactions ",
    expectedQuery: "SELECT receiver_account, SUM(amount) AS total_received FROM bank_transactions GROUP BY receiver_account HAVING SUM(amount) > 100000;"
  },
  {
    id: 29,
    title: "Case File 029 - Quantum Server Operating Systems",
    concept: "DISTINCT & CONDITIONAL",
    story: "We want to check the variety of secure Linux platforms deployed across our active infrastructure.",
    objective: "Retrieve a list of DISTINCT 'os_version' from the 'servers' table where 'active_status' is equal to 'Active'.",
    databaseSchema: [
      {
        name: "servers",
        columns: [
          { name: "os_version", type: "TEXT" },
          { name: "active_status", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Place DISTINCT before the column 'os_version'.",
      "Filter with WHERE active_status = 'Active'."
    ],
    initialQuery: "-- List distinct active server OS models\nSELECT ",
    expectedQuery: "SELECT DISTINCT os_version FROM servers WHERE active_status = 'Active';"
  },
  {
    id: 30,
    title: "Case File 030 - High Net-Worth Transactions",
    concept: "SUBQUERY COMPARISON",
    story: "We suspect the mastermind transferred credits to a shell account. Let's find transactions where the amount is strictly greater than the bank balance of Sarah Connor.",
    objective: "Retrieve 'sender_account', 'receiver_account', and 'amount' from 'bank_transactions' where 'amount' is strictly greater than the bank balance of Sarah Connor (found via subquery).",
    databaseSchema: [
      {
        name: "bank_transactions",
        columns: [
          { name: "sender_account", type: "TEXT" },
          { name: "receiver_account", type: "TEXT" },
          { name: "amount", type: "INTEGER" }
        ],
        rowCount: 5
      },
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
      "The subquery is: (SELECT bank_balance FROM suspects WHERE name = 'Sarah Connor').",
      "Compare 'amount > (subquery)' in the WHERE clause."
    ],
    initialQuery: "-- Trace payments exceeding Sarah Connor's registry net worth\nSELECT sender_account, receiver_account, amount FROM bank_transactions WHERE ",
    expectedQuery: "SELECT sender_account, receiver_account, amount FROM bank_transactions WHERE amount > (SELECT bank_balance FROM suspects WHERE name = 'Sarah Connor');"
  },
  {
    id: 31,
    title: "Case File 031 - Security Clearance Check",
    concept: "LEFT JOIN ON CARDS",
    story: "We need a complete roster of access cards, and details of any matching suspects. If an access card's employee name does not have a registered suspect, their city will appear as NULL.",
    objective: "Retrieve the 'employee_name' from 'access_cards' and their matched suspect's 'city' using a LEFT JOIN on 'access_cards.employee_name = suspects.name'.",
    databaseSchema: [
      {
        name: "access_cards",
        columns: [
          { name: "employee_name", type: "TEXT" }
        ],
        rowCount: 5
      },
      {
        name: "suspects",
        columns: [
          { name: "name", type: "TEXT" },
          { name: "city", type: "TEXT" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "Use FROM access_cards LEFT JOIN suspects ON access_cards.employee_name = suspects.name.",
      "Select only the two requested columns."
    ],
    initialQuery: "-- Track cities for scanned employee credentials\nSELECT ",
    expectedQuery: "SELECT access_cards.employee_name, suspects.city FROM access_cards LEFT JOIN suspects ON access_cards.employee_name = suspects.name;"
  },
  {
    id: 32,
    title: "Case File 032 - Chronological File Access",
    concept: "MULTI-KEY ORDERING",
    story: "To trace the exact security card usage sequence, we need all cards sorted by their access level in ascending order, and then by last_scanned in descending order.",
    objective: "Retrieve 'employee_name', 'access_level', and 'last_scanned' from 'access_cards' sorted by 'access_level' in ascending order, and then by 'last_scanned' in descending order.",
    databaseSchema: [
      {
        name: "access_cards",
        columns: [
          { name: "employee_name", type: "TEXT" },
          { name: "access_level", type: "TEXT" },
          { name: "last_scanned", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use 'ORDER BY access_level ASC, last_scanned DESC'.",
      "List columns separated by commas."
    ],
    initialQuery: "-- Multi-sorted card scanning activity report\nSELECT employee_name, access_level, last_scanned FROM access_cards ORDER BY ",
    expectedQuery: "SELECT employee_name, access_level, last_scanned FROM access_cards ORDER BY access_level ASC, last_scanned DESC;"
  },
  {
    id: 33,
    title: "Case File 033 - Network Failures",
    concept: "TALLY LOGS",
    story: "A massive cyber attack attempts to crash internal ports. We need to tally all failed connections.",
    objective: "Retrieve the COUNT of logs (aliased as 'failed_count') in 'network_logs' where 'status' is equal to 'Failed'.",
    databaseSchema: [
      {
        name: "network_logs",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "status", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use COUNT(id) AS failed_count.",
      "Filter where status is equal to 'Failed'."
    ],
    initialQuery: "-- Tally dropped network connections\nSELECT ",
    expectedQuery: "SELECT COUNT(id) AS failed_count FROM network_logs WHERE status = 'Failed';"
  },
  {
    id: 34,
    title: "Case File 034 - Mainframe Co-incidence",
    concept: "IN SUBQUERY DATE",
    story: "We need to identify suspect transactions which occurred on the same dates as registered crimes.",
    objective: "Retrieve 'sender_account', 'amount', and 'date' from the 'bank_transactions' table where the transaction 'date' is in the list of dates from 'crimes'.",
    databaseSchema: [
      {
        name: "bank_transactions",
        columns: [
          { name: "sender_account", type: "TEXT" },
          { name: "amount", type: "INTEGER" },
          { name: "date", type: "TEXT" }
        ],
        rowCount: 5
      },
      {
        name: "crimes",
        columns: [
          { name: "date", type: "TEXT" }
        ],
        rowCount: 4
      }
    ],
    hints: [
      "Write a subquery to select date from crimes.",
      "Filter with: WHERE date IN (SELECT date FROM crimes)."
    ],
    initialQuery: "-- Search payments on dates when physical crimes took place\nSELECT sender_account, amount, date FROM bank_transactions WHERE ",
    expectedQuery: "SELECT sender_account, amount, date FROM bank_transactions WHERE date IN (SELECT date FROM crimes);"
  },
  {
    id: 35,
    title: "Case File 035 - Crypto Cash Outs",
    concept: "BETWEEN FILTERING",
    story: "Our financial crime division flagged all moderate-to-high cryptocurrency cash-outs. Let's filter transactions.",
    objective: "Retrieve all columns from the 'bank_transactions' table where the 'amount' is BETWEEN 100000 AND 1500000 AND 'type' is equal to 'Wire Transfer'.",
    databaseSchema: [
      {
        name: "bank_transactions",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "amount", type: "INTEGER" },
          { name: "type", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "The BETWEEN operator checks if a value is in an inclusive range: BETWEEN x AND y.",
      "Filter where amount BETWEEN 100000 AND 1500000 AND type = 'Wire Transfer'."
    ],
    initialQuery: "-- Retrieve moderate-range wire cash-outs\nSELECT * FROM bank_transactions WHERE ",
    expectedQuery: "SELECT * FROM bank_transactions WHERE amount BETWEEN 100000 AND 1500000 AND type = 'Wire Transfer';"
  }
];
