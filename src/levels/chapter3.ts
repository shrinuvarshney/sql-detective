import { Level } from '../types';

export const chapter3Levels: Level[] = [
  {
    id: 36,
    title: "Case File 036 - Secure Port Tally",
    concept: "COUNT DISTINCT & GROUP BY",
    story: "The hacker used various system ports to establish shell tunnels. We need to audit the count of unique destinations for each active connection port.",
    objective: "Retrieve the 'port' and the COUNT of distinct 'destination_ip' addresses (aliased as 'unique_destinations') from 'network_logs', grouped by 'port'.",
    databaseSchema: [
      {
        name: "network_logs",
        columns: [
          { name: "port", type: "INTEGER" },
          { name: "destination_ip", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use COUNT(DISTINCT destination_ip) AS unique_destinations.",
      "Group the output by port."
    ],
    initialQuery: "-- Count unique destination IPs per terminal port\nSELECT port, ",
    expectedQuery: "SELECT port, COUNT(DISTINCT destination_ip) AS unique_destinations FROM network_logs GROUP BY port;"
  },
  {
    id: 37,
    title: "Case File 037 - High Capacity Network Routing",
    concept: "INNER JOIN WITH SELECT",
    story: "We suspect the syndicate routing protocols are overloaded. Let's combine servers and network logs where the server IP is the source of the log.",
    objective: "Retrieve 'servers.location', 'network_logs.bytes_transferred', and 'servers.os_version' by inner joining 'servers' and 'network_logs' on 'servers.ip_address = network_logs.source_ip'.",
    databaseSchema: [
      {
        name: "servers",
        columns: [
          { name: "ip_address", type: "TEXT" },
          { name: "location", type: "TEXT" },
          { name: "os_version", type: "TEXT" }
        ],
        rowCount: 5
      },
      {
        name: "network_logs",
        columns: [
          { name: "source_ip", type: "TEXT" },
          { name: "bytes_transferred", type: "INTEGER" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Connect servers and network_logs on servers.ip_address = network_logs.source_ip.",
      "Select only the three requested columns in order."
    ],
    initialQuery: "-- Match node locations with transfer log volumes\nSELECT servers.location, network_logs.bytes_transferred, servers.os_version FROM servers\n",
    expectedQuery: "SELECT servers.location, network_logs.bytes_transferred, servers.os_version FROM servers INNER JOIN network_logs ON servers.ip_address = network_logs.source_ip;"
  },
  {
    id: 38,
    title: "Case File 038 - Circular Financial Flows",
    concept: "SELF COLUMN COMPLEMENTS",
    story: "A security loophole allows direct self-transfers or circular flows. Let's find any transactions where sender_account and receiver_account are matching.",
    objective: "Retrieve all columns from the 'bank_transactions' table where the 'sender_account' is exactly equal to 'receiver_account'.",
    databaseSchema: [
      {
        name: "bank_transactions",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "sender_account", type: "TEXT" },
          { name: "receiver_account", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Use SELECT * FROM bank_transactions.",
      "Use WHERE sender_account = receiver_account."
    ],
    initialQuery: "-- Search for internal transfer loops\nSELECT * FROM bank_transactions WHERE ",
    expectedQuery: "SELECT * FROM bank_transactions WHERE sender_account = receiver_account;"
  },
  {
    id: 39,
    title: "Case File 039 - Suspect Age Classification",
    concept: "CASE WHEN MULTI-TIERS",
    story: "We need to audit age classifications of suspects. Categorize suspects into 'Senior' (age > 45), 'Mid' (age between 25 and 45 inclusive), and 'Junior' (age < 25).",
    objective: "Select suspect 'name', 'age', and classify them into a column aliased as 'age_tier' using a CASE WHEN clause with standard age boundaries.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "name", type: "TEXT" },
          { name: "age", type: "INTEGER" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "Use CASE WHEN age > 45 THEN 'Senior' WHEN age >= 25 THEN 'Mid' ELSE 'Junior' END AS age_tier.",
      "Check the names of your tiers carefully."
    ],
    initialQuery: "-- Partition suspects into demographic age bands\nSELECT name, age,\n  CASE\n    WHEN ",
    expectedQuery: "SELECT name, age, CASE WHEN age > 45 THEN 'Senior' WHEN age >= 25 THEN 'Mid' ELSE 'Junior' END AS age_tier FROM suspects;"
  },
  {
    id: 40,
    title: "Case File 040 - Quantum Core Intrusion",
    concept: "NESTED SUBQUERIES",
    story: "We need to unmask which suspects live in the same cities where high severity crimes were committed.",
    objective: "Retrieve the 'name' and 'city' from 'suspects' where 'city' is in the list of cities where suspects associated with High or Critical severity crimes live.",
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
        name: "crimes",
        columns: [
          { name: "severity", type: "TEXT" },
          { name: "suspect_id", type: "INTEGER" }
        ],
        rowCount: 4
      }
    ],
    hints: [
      "The innermost query is: SELECT suspect_id FROM crimes WHERE severity = 'High' OR severity = 'Critical'.",
      "The middle query extracts cities of those suspects: SELECT city FROM suspects WHERE id IN (innermost_query).",
      "The outermost query selects name and city where city IN (middle_query)."
    ],
    initialQuery: "-- Match suspect cities with high risk crimes\nSELECT name, city FROM suspects WHERE city IN (SELECT city FROM suspects WHERE id IN (SELECT ",
    expectedQuery: "SELECT name, city FROM suspects WHERE city IN (SELECT city FROM suspects WHERE id IN (SELECT suspect_id FROM crimes WHERE severity = 'High' OR severity = 'Critical'));"
  },
  {
    id: 41,
    title: "Case File 041 - Network Infiltrator Tracking",
    concept: "JOIN WITH FILTERING",
    story: "A hacker hijacked a secure server to transfer high-volume packages. Let's link servers and network logs where the server IP is the source of the log.",
    objective: "INNER JOIN 'servers' and 'network_logs' on 'servers.ip_address = network_logs.source_ip'. Retrieve the server's 'location', log's 'destination_ip', and 'bytes_transferred' where 'servers.critical_level = 'Critical' AND network_logs.status = 'Success'.",
    databaseSchema: [
      {
        name: "servers",
        columns: [
          { name: "ip_address", type: "TEXT" },
          { name: "location", type: "TEXT" },
          { name: "critical_level", type: "TEXT" }
        ],
        rowCount: 5
      },
      {
        name: "network_logs",
        columns: [
          { name: "source_ip", type: "TEXT" },
          { name: "destination_ip", type: "TEXT" },
          { name: "bytes_transferred", type: "INTEGER" },
          { name: "status", type: "TEXT" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Join on servers.ip_address = network_logs.source_ip.",
      "Add filters: WHERE servers.critical_level = 'Critical' AND network_logs.status = 'Success'."
    ],
    initialQuery: "-- Match server locations with successful critical transfers\nSELECT servers.location, network_logs.destination_ip, network_logs.bytes_transferred FROM servers\n",
    expectedQuery: "SELECT servers.location, network_logs.destination_ip, network_logs.bytes_transferred FROM servers INNER JOIN network_logs ON servers.ip_address = network_logs.source_ip WHERE servers.critical_level = 'Critical' AND network_logs.status = 'Success';"
  },
  {
    id: 42,
    title: "Case File 042 - Average Financial Transfer",
    concept: "AVG WITH FILTER",
    story: "Let's review the average transfer amount executed through crypto platforms to evaluate liquidity sizes.",
    objective: "Retrieve the average 'amount' (aliased as 'avg_amount') from 'bank_transactions' where 'type' is equal to 'Crypto Exchange'.",
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
      "Use AVG(amount) AS avg_amount.",
      "Filter with WHERE type = 'Crypto Exchange'."
    ],
    initialQuery: "-- Average financial crypto transfer volume\nSELECT ",
    expectedQuery: "SELECT AVG(amount) AS avg_amount FROM bank_transactions WHERE type = 'Crypto Exchange';"
  },
  {
    id: 43,
    title: "Case File 043 - Clearance Code Search",
    concept: "LIKE WILDCARDS",
    story: "The secure server room was breached using cloned credentials. Find all employees whose clearance_code contains the word 'ALPHA'.",
    objective: "Retrieve 'employee_name' and 'clearance_code' from the 'access_cards' table where 'clearance_code' contains 'ALPHA' as a substring.",
    databaseSchema: [
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
      "Use clearance_code LIKE '%ALPHA%'.",
      "Both prefix and suffix wildcard '%' characters are required."
    ],
    initialQuery: "-- Match ALPHA security clearance credentials\nSELECT employee_name, clearance_code FROM access_cards WHERE ",
    expectedQuery: "SELECT employee_name, clearance_code FROM access_cards WHERE clearance_code LIKE '%ALPHA%';"
  },
  {
    id: 44,
    title: "Case File 044 - Host Operating Systems",
    concept: "ORDER & LIMIT WITH WHERE",
    story: "We need to check details of our offline server nodes to identify potential points of physical intrusion.",
    objective: "Retrieve all columns from the 'servers' table where 'active_status' is equal to 'Offline' sorted by 'id' in ascending order, limited to 1 row.",
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
      "WHERE active_status = 'Offline'.",
      "Add ORDER BY id ASC LIMIT 1 to the end."
    ],
    initialQuery: "-- Find first inactive server node\nSELECT * FROM servers WHERE active_status = 'Offline' ORDER BY ",
    expectedQuery: "SELECT * FROM servers WHERE active_status = 'Offline' ORDER BY id ASC LIMIT 1;"
  },
  {
    id: 45,
    title: "Case File 045 - Crime Severity Count",
    concept: "COUNT & GROUP BY & ORDER",
    story: "Let's perform a risk-assessment audit of the overall frequency of crimes grouped by their severity levels.",
    objective: "Retrieve the 'severity' and the COUNT of crimes (aliased as 'crime_count') from the 'crimes' table, grouped by 'severity' and sorted by 'crime_count' in descending order.",
    databaseSchema: [
      {
        name: "crimes",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "severity", type: "TEXT" }
        ],
        rowCount: 4
      }
    ],
    hints: [
      "Select 'severity' and 'COUNT(id) AS crime_count'.",
      "GROUP BY severity ORDER BY crime_count DESC."
    ],
    initialQuery: "-- Tally crimes by risk severity\nSELECT severity, COUNT(id) AS crime_count FROM crimes GROUP BY ",
    expectedQuery: "SELECT severity, COUNT(id) AS crime_count FROM crimes GROUP BY severity ORDER BY crime_count DESC;"
  },
  {
    id: 46,
    title: "Case File 046 - Long Conversations",
    concept: "INNER JOIN WITH FILTER",
    story: "The syndicate coordinators communicate frequently over physical channels. Let's check calls lasting longer than 150 seconds.",
    objective: "Retrieve the suspect's 'name' and call 'duration_seconds' by joining 'suspects' and 'phone_calls' on 'suspects.id = phone_calls.caller_id' where 'duration_seconds' is strictly greater than 150.",
    databaseSchema: [
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" }
        ],
        rowCount: 10
      },
      {
        name: "phone_calls",
        columns: [
          { name: "caller_id", type: "INTEGER" },
          { name: "duration_seconds", type: "INTEGER" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Inner join suspects and phone_calls on suspects.id = phone_calls.caller_id.",
      "Filter where phone_calls.duration_seconds > 150."
    ],
    initialQuery: "-- Find long recorded calls made by key suspects\nSELECT suspects.name, phone_calls.duration_seconds FROM suspects\n",
    expectedQuery: "SELECT suspects.name, phone_calls.duration_seconds FROM suspects INNER JOIN phone_calls ON suspects.id = phone_calls.caller_id WHERE phone_calls.duration_seconds > 150;"
  },
  {
    id: 47,
    title: "Case File 047 - Inactive Keycards",
    concept: "NOT IN COMPLEMENTS",
    story: "Some registered security card holders are inactive in our network log activities. Let's find access cards whose employee_name has not initiated any phone calls.",
    objective: "Retrieve 'employee_name' and 'access_level' from 'access_cards' where 'employee_name' is NOT IN the list of suspect names who have initiated phone calls.",
    databaseSchema: [
      {
        name: "access_cards",
        columns: [
          { name: "employee_name", type: "TEXT" },
          { name: "access_level", type: "TEXT" }
        ],
        rowCount: 5
      },
      {
        name: "suspects",
        columns: [
          { name: "id", type: "INTEGER" },
          { name: "name", type: "TEXT" }
        ],
        rowCount: 10
      }
    ],
    hints: [
      "The subquery is: SELECT name FROM suspects WHERE id IN (SELECT caller_id FROM phone_calls).",
      "Check where employee_name NOT IN (subquery)."
    ],
    initialQuery: "-- Audit unused card entries without communications\nSELECT employee_name, access_level FROM access_cards WHERE employee_name NOT IN (SELECT name FROM suspects WHERE id IN (SELECT ",
    expectedQuery: "SELECT employee_name, access_level FROM access_cards WHERE employee_name NOT IN (SELECT name FROM suspects WHERE id IN (SELECT caller_id FROM phone_calls));"
  },
  {
    id: 48,
    title: "Case File 048 - High-Volume Ports",
    concept: "HAVING SUM ACCUMULATION",
    story: "Ports routing massive byte dumps represent active espionage portals. Let's aggregate successfully transferred bytes by port.",
    objective: "Retrieve 'port' and the SUM of 'bytes_transferred' (aliased as 'total_bytes') from 'network_logs' grouped by 'port' having 'total_bytes' strictly greater than 5000000.",
    databaseSchema: [
      {
        name: "network_logs",
        columns: [
          { name: "port", type: "INTEGER" },
          { name: "bytes_transferred", type: "INTEGER" }
        ],
        rowCount: 5
      }
    ],
    hints: [
      "Select 'port' and 'SUM(bytes_transferred) AS total_bytes'.",
      "Apply GROUP BY port HAVING SUM(bytes_transferred) > 5000000."
    ],
    initialQuery: "-- List highly active tunnel ports\nSELECT port, SUM(bytes_transferred) AS total_bytes FROM network_logs GROUP BY ",
    expectedQuery: "SELECT port, SUM(bytes_transferred) AS total_bytes FROM network_logs GROUP BY port HAVING SUM(bytes_transferred) > 5000000;"
  },
  {
    id: 49,
    title: "Case File 049 - Chronological Crimes",
    concept: "DATETIME ORDER",
    story: "To align our historical profile tracking, let's order all crime files from the most recent to the oldest.",
    objective: "Retrieve 'title', 'date', and 'location' from the 'crimes' table sorted by 'date' in descending order.",
    databaseSchema: [
      {
        name: "crimes",
        columns: [
          { name: "title", type: "TEXT" },
          { name: "date", type: "TEXT" },
          { name: "location", type: "TEXT" }
        ],
        rowCount: 4
      }
    ],
    hints: [
      "Use ORDER BY date DESC."
    ],
    initialQuery: "-- Retrieve crime history starting with the latest\nSELECT title, date, location FROM crimes ORDER BY ",
    expectedQuery: "SELECT title, date, location FROM crimes ORDER BY date DESC;"
  },
  {
    id: 50,
    title: "Case File 050 - The Final Mainframe Overhaul",
    concept: "MULTI-JOIN GROUP AGGREGATE",
    story: "We have tracked the final signal to the ultimate reactor server room. For our final mainframe override, let's identify secure critical server nodes which initiated successful data transfers.",
    objective: "INNER JOIN 'servers' and 'network_logs' on 'servers.ip_address = network_logs.source_ip'. Select the server's 'location', 'ip_address', and the SUM of 'bytes_transferred' (aliased as 'sum_bytes'). Filter records where 'servers.critical_level = 'Critical' AND network_logs.status = 'Success'', group by 'servers.location' and 'servers.ip_address', and sort by 'sum_bytes' in descending order.",
    databaseSchema: [
      {
        name: "servers",
        columns: [
          { name: "ip_address", type: "TEXT" },
          { name: "location", type: "TEXT" },
          { name: "critical_level", type: "TEXT" }
        ],
        rowCount: 5
      },
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
      "Join on servers.ip_address = network_logs.source_ip.",
      "Add WHERE filters for critical_level and status.",
      "GROUP BY servers.location, servers.ip_address.",
      "Add ORDER BY sum_bytes DESC to conclude the query."
    ],
    initialQuery: "-- Final mainframe server data overrides\nSELECT servers.location, servers.ip_address, SUM(network_logs.bytes_transferred) AS sum_bytes \nFROM servers\n",
    expectedQuery: "SELECT servers.location, servers.ip_address, SUM(network_logs.bytes_transferred) AS sum_bytes FROM servers INNER JOIN network_logs ON servers.ip_address = network_logs.source_ip WHERE servers.critical_level = 'Critical' AND network_logs.status = 'Success' GROUP BY servers.location, servers.ip_address ORDER BY sum_bytes DESC;"
  }
];
