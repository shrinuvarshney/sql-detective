import { RunQueryResult } from '../types';

let db: any = null;

// Initialize the database with sql.js loaded from index.html
export async function getDatabase(): Promise<any> {
  if (db) return db;

  const initSqlJs = (window as any).initSqlJs;
  if (!initSqlJs) {
    // Wait for sql.js CDN script to be fully loaded and parsed
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if ((window as any).initSqlJs) {
          clearInterval(check);
          resolve(true);
        }
      }, 50);
    });
  }

  try {
    const SQL = await (window as any).initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    });

    db = new SQL.Database();
    seedDatabase(db);
    return db;
  } catch (error) {
    console.error("Failed to initialize sql.js:", error);
    throw new Error("Could not load SQLite engine in the browser. Please check internet connection or script loading.");
  }
}

// Seed the SQLite database with rich game data
function seedDatabase(database: any) {
  // Create suspects table
  database.run(`
    CREATE TABLE suspects (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      occupation TEXT NOT NULL,
      city TEXT NOT NULL,
      bank_balance INTEGER NOT NULL,
      car_model TEXT NOT NULL
    );
  `);

  // Create phone_calls table
  database.run(`
    CREATE TABLE phone_calls (
      id INTEGER PRIMARY KEY,
      caller_id INTEGER NOT NULL,
      receiver_id INTEGER NOT NULL,
      duration_seconds INTEGER NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (caller_id) REFERENCES suspects(id)
    );
  `);

  // Create crimes table
  database.run(`
    CREATE TABLE crimes (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      severity TEXT NOT NULL,
      suspect_id INTEGER NOT NULL,
      FOREIGN KEY (suspect_id) REFERENCES suspects(id)
    );
  `);

  // Create servers table
  database.run(`
    CREATE TABLE servers (
      id INTEGER PRIMARY KEY,
      ip_address TEXT NOT NULL,
      location TEXT NOT NULL,
      critical_level TEXT NOT NULL,
      active_status TEXT NOT NULL,
      os_version TEXT NOT NULL
    );
  `);

  // Create network_logs table
  database.run(`
    CREATE TABLE network_logs (
      id INTEGER PRIMARY KEY,
      source_ip TEXT NOT NULL,
      destination_ip TEXT NOT NULL,
      bytes_transferred INTEGER NOT NULL,
      port INTEGER NOT NULL,
      protocol TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);

  // Create bank_transactions table
  database.run(`
    CREATE TABLE bank_transactions (
      id INTEGER PRIMARY KEY,
      sender_account TEXT NOT NULL,
      receiver_account TEXT NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);

  // Create access_cards table
  database.run(`
    CREATE TABLE access_cards (
      id INTEGER PRIMARY KEY,
      employee_name TEXT NOT NULL,
      access_level TEXT NOT NULL,
      clearance_code TEXT NOT NULL,
      last_scanned TEXT NOT NULL
    );
  `);

  // Insert seed data into suspects
  database.run(`
    INSERT INTO suspects (id, name, age, occupation, city, bank_balance, car_model) VALUES 
    (1, 'Alex Mercer', 28, 'Software Engineer', 'Neo-City', 120000, 'Tesla Model S'),
    (2, 'Victor Vance', 45, 'Corporate Executive', 'Neo-City', 2500000, 'Porsche Taycan'),
    (3, 'Elena Rostova', 22, 'Cyberspace Student', 'Tokyo Cyber', 4500, 'None'),
    (4, 'Marcus Vance', 19, 'Unemployed Hacker', 'Tokyo Cyber', 85000, 'Honda Civic'),
    (5, 'Sarah Connor', 34, 'Security Guard', 'Sector 4', 45000, 'Dodge Charger'),
    (6, 'Thomas Anderson', 32, 'Systems Analyst', 'Sector 4', 95000, 'Ducati Monster'),
    (7, 'Arthur Pendelton', 56, 'Antiquities Dealer', 'Neo-City', 1800000, 'Rolls-Royce Ghost'),
    (8, 'Clara Oswald', 26, 'Quantum Physicist', 'Sector 4', 350000, 'Audi e-tron'),
    (9, 'Jaxon Cole', 41, 'Tech Investor', 'Neo-City', 5200000, 'Aston Martin DB11'),
    (10, 'Maya Lin', 48, 'Chief Security Architect', 'Tokyo Cyber', 1100000, 'BMW i8');
  `);

  // Insert seed data into phone_calls
  database.run(`
    INSERT INTO phone_calls (id, caller_id, receiver_id, duration_seconds, timestamp) VALUES
    (1, 4, 2, 45, '2026-06-28 14:32:00'),
    (2, 2, 9, 310, '2026-06-28 15:10:00'),
    (3, 6, 3, 120, '2026-06-28 16:05:00'),
    (4, 10, 7, 180, '2026-06-28 17:40:00'),
    (5, 8, 1, 95, '2026-06-28 18:22:00');
  `);

  // Insert seed data into crimes
  database.run(`
    INSERT INTO crimes (id, title, date, location, severity, suspect_id) VALUES
    (1, 'Mainframe Breach', '2026-05-12', 'Sector 4 Server Hub', 'Critical', 4),
    (2, 'Reactor Blueprint Theft', '2026-06-25', 'Quantum Grid Labs', 'High', 10),
    (3, 'Insider Trading', '2026-04-03', 'Neo-City Exchange', 'Medium', 2),
    (4, 'Black Market Dealing', '2026-06-01', 'Sector 4 Docks', 'High', 7);
  `);

  // Insert seed data into servers
  database.run(`
    INSERT INTO servers (id, ip_address, location, critical_level, active_status, os_version) VALUES
    (1, '192.168.1.10', 'Main Office', 'High', 'Active', 'CentOS 8'),
    (2, '10.0.0.15', 'Datacenter Sector 4', 'Critical', 'Active', 'RedHat 8.4'),
    (3, '172.16.4.88', 'Tokyo Server Hub', 'Critical', 'Active', 'Ubuntu 20.04'),
    (4, '192.168.22.4', 'Underground Vault', 'Critical', 'Offline', 'Alpine Linux'),
    (5, '10.12.8.200', 'Quantum Labs', 'Medium', 'Active', 'Custom OS v3');
  `);

  // Insert seed data into network_logs
  database.run(`
    INSERT INTO network_logs (id, source_ip, destination_ip, bytes_transferred, port, protocol, status) VALUES
    (1, '192.168.1.100', '10.0.0.15', 5000000, 80, 'HTTP', 'Blocked'),
    (2, '172.16.4.88', '192.168.22.4', 250000000, 22, 'SSH', 'Success'),
    (3, '10.0.0.15', '8.8.8.8', 1250, 53, 'DNS', 'Success'),
    (4, '192.168.1.10', '172.16.4.88', 98000000, 443, 'HTTPS', 'Success'),
    (5, '10.12.8.200', '192.168.22.4', 45000, 3306, 'MySQL', 'Failed');
  `);

  // Insert seed data into bank_transactions
  database.run(`
    INSERT INTO bank_transactions (id, sender_account, receiver_account, amount, type, date) VALUES
    (1, 'ACC-4492', 'ACC-8831', 250000, 'Wire Transfer', '2026-06-20'),
    (2, 'ACC-0012', 'ACC-4492', 5000000, 'Crypto Exchange', '2026-06-25'),
    (3, 'ACC-8831', 'ACC-9102', 15000, 'ATM Withdrawal', '2026-06-27'),
    (4, 'ACC-7711', 'ACC-1299', 85000, 'Corporate Payment', '2026-06-24'),
    (5, 'ACC-9102', 'ACC-0012', 1200000, 'Wire Transfer', '2026-06-26');
  `);

  // Insert seed data into access_cards
  database.run(`
    INSERT INTO access_cards (id, employee_name, access_level, clearance_code, last_scanned) VALUES
    (1, 'Marcus Vance', 'Level 1', 'CLR-ALPHA', '2026-06-28 09:12:00'),
    (2, 'Victor Vance', 'Level 5', 'CLR-OMEGA', '2026-06-28 11:45:00'),
    (3, 'Sarah Connor', 'Level 3', 'CLR-GAMMA', '2026-06-27 22:30:00'),
    (4, 'Thomas Anderson', 'Level 2', 'CLR-BETA', '2026-06-28 08:00:00'),
    (5, 'Maya Lin', 'Level 5', 'CLR-OMEGA', '2026-06-28 14:15:00');
  `);
}

// Run a user-submitted SQL query safely and capture any results or errors
export async function runQuery(query: string): Promise<RunQueryResult> {
  try {
    const database = await getDatabase();
    const res = database.exec(query);
    if (res.length === 0) {
      return { columns: [], values: [] };
    }
    return {
      columns: res[0].columns,
      values: res[0].values
    };
  } catch (err: any) {
    return {
      columns: [],
      values: [],
      error: err.message || String(err)
    };
  }
}

// Compare user's execution results with expected canonical execution results
// Run arbitrary setup SQL (used for custom dynamic AI-generated levels)
export async function executeSetup(setupSql: string): Promise<void> {
  try {
    const database = await getDatabase();
    database.run(setupSql);
  } catch (error) {
    console.error("Failed to run setup SQL:", error);
    throw error;
  }
}

export function compareResults(
  resPlayer: RunQueryResult,
  resExpected: RunQueryResult
): { success: boolean; reason?: string } {
  if (resPlayer.error) {
    return { success: false, reason: `SQL Error: ${resPlayer.error}` };
  }

  // Check expected result row counts
  if (resExpected.values.length > 0 && resPlayer.values.length === 0) {
    return { success: false, reason: "Your query returned 0 rows, but results were expected. Check your filter criteria!" };
  }

  // Compare column counts
  if (resPlayer.columns.length !== resExpected.columns.length) {
    return {
      success: false,
      reason: `Expected ${resExpected.columns.length} columns (${resExpected.columns.join(', ')}), but your query returned ${resPlayer.columns.length} columns (${resPlayer.columns.join(', ')}).`
    };
  }

  // Compare row count
  if (resPlayer.values.length !== resExpected.values.length) {
    return {
      success: false,
      reason: `Expected ${resExpected.values.length} rows, but your query returned ${resPlayer.values.length} rows.`
    };
  }

  // Normalize column headers to lowercase to allow lenient capitalization of aliases or names
  const playerColsLower = resPlayer.columns.map(c => c.toLowerCase());
  const expectedColsLower = resExpected.columns.map(c => c.toLowerCase());

  for (let i = 0; i < playerColsLower.length; i++) {
    // If the expected query contains suspects.name, SQLite might return 'name' or 'suspects.name'. 
    // We should normalize both by taking the portion after the last dot if they differ.
    const pCol = playerColsLower[i].includes('.') ? playerColsLower[i].split('.').pop() : playerColsLower[i];
    const eCol = expectedColsLower[i].includes('.') ? expectedColsLower[i].split('.').pop() : expectedColsLower[i];

    if (pCol !== eCol) {
      return {
        success: false,
        reason: `Column header mismatch at column ${i + 1}. Expected column name to be '${resExpected.columns[i]}', but got '${resPlayer.columns[i]}'.`
      };
    }
  }

  // Compare exact cell values row by row, column by column
  for (let r = 0; r < resExpected.values.length; r++) {
    for (let c = 0; c < resExpected.values[r].length; c++) {
      const playerVal = resPlayer.values[r][c];
      const expectedVal = resExpected.values[r][c];

      if (typeof expectedVal === 'number' && typeof playerVal === 'number') {
        if (Math.abs(expectedVal - playerVal) > 0.01) {
          return {
            success: false,
            reason: `Data mismatch on row ${r + 1}, column '${resExpected.columns[c]}'. Expected value '${expectedVal}', but your query yielded '${playerVal}'.`
          };
        }
      } else {
        const pStr = playerVal === null || playerVal === undefined ? "NULL" : String(playerVal);
        const eStr = expectedVal === null || expectedVal === undefined ? "NULL" : String(expectedVal);

        if (pStr !== eStr) {
          return {
            success: false,
            reason: `Data mismatch on row ${r + 1}, column '${resExpected.columns[c]}'. Expected value '${eStr}', but your query yielded '${pStr}'.`
          };
        }
      }
    }
  }

  return { success: true };
}
