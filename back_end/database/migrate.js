const mysql = require("mysql2/promise.js");
const path = require("path");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Define your local and dev MySQL connections without specifying a database for database creation
const localConnection = mysql.createConnection({
  host: "localhost",
  user: process.env.DEV_DB_USER,
  password: process.env.DEV_DB_PASS,
});

const devConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Function to migrate data from local to dev environment
async function migrateLocalToDev() {
  try {
    // Get the table names from the local database
    const [tablesNames] = await (
      await await localConnection
    ).query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = '${process.env.DEV_DB_NAME}'
        `);

    for (const table of tablesNames) {
      const tableName = table.table_name;

      // Step 1: Get the table structure from the local database
      const [structure] = await (await localConnection).query(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableQuery = structure[0]["Create Table"];

      // Step 2: Create the table in the dev database
      await (await devConnection).query(createTableQuery);

      // Step 3: Copy data from local database to dev database
      const [data] = await (await localConnection).query(`SELECT * FROM \`${tableName}\``);
      if (data.length > 0) {
        const keys = Object.keys(data[0]);
        const columns = keys.map((key) => `\`${key}\``).join(", ");
        const values = data.map((row) => `(${keys.map((key) => `'${row[key]}'`).join(", ")})`).join(", ");

        const insertQuery = `INSERT INTO \`${tableName}\` (${columns}) VALUES ${values}`;
        await (await devConnection).query(insertQuery);
      }

      console.log(`Migrated table: ${tableName}`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await (await localConnection).end();
    await (await devConnection).end();
  }
}

// Function to migrate data from dev environment to local
async function migrateDevToLocal() {
  try {
    // Get the table names from the dev database
    const [tablesNames] = await (
      await devConnection
    ).query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = '${process.env.DB_NAME}'
        `);

    for (const table of tablesNames) {
      const tableName = table.table_name;

      // Step 1: Get the table structure from the dev database
      const [structure] = await (await devConnection).query(`SHOW CREATE TABLE \`${tableName}\``);
      const createTableQuery = structure[0]["Create Table"];

      // Step 2: Create the table in the local database
      await (await localConnection).query(createTableQuery);

      // Step 3: Copy data from dev database to local database
      const [data] = await (await devConnection).query(`SELECT * FROM \`${tableName}\``);
      if (data.length > 0) {
        const keys = Object.keys(data[0]);
        const columns = keys.map((key) => `\`${key}\``).join(", ");
        const values = data.map((row) => `(${keys.map((key) => `'${row[key]}'`).join(", ")})`).join(", ");

        const insertQuery = `INSERT INTO \`${tableName}\` (${columns}) VALUES ${values}`;
        await (await localConnection).query(insertQuery);
      }

      console.log(`Migrated table: ${tableName}`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await (await devConnection).end();
    await (await localConnection).end();
  }
}

// Function to prompt user for input (theme or migration direction)
const prompt = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

// Function to handle the migration direction
const runMigration = async () => {
  // Prompt the user for migration direction
  const direction = await prompt(`migrating from \n 1 : local to online \n 2 : online to local\nSelect: `);

  // Perform the migration based on user's input
  if (direction == 1) {
    await migrateLocalToDev(); // Pass theme into the migration function
  } else if (direction == 2) {
    await migrateDevToLocal(); // Pass theme into the migration function
  } else {
    console.log("Invalid input, please select 1 or 2.");
    rl.close();
  }
  process.exit(0);
  // Close the readline interface once done
};

// Start the migration process
runMigration();
