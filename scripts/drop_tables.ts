import pg from "pg";

const { Client } = pg;

async function run() {
  const client = new Client({
    user: "intuit_demo",
    host: "localhost",
    database: "intuit_demo_db",
    password: "intuit",
    port: 5432,
  });

  try {
    await client.connect();
    console.log("Connected to Postgres.");

    // Drop tables in the right order
    await client.query(`DROP TABLE IF EXISTS prediction CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS refund_status CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS tax_return CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
    console.log("Tables dropped.");

    // Drop your custom enums if they exist
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'refund_status_type') THEN
          DROP TYPE refund_status_type;
        END IF;
      END$$;
    `);

    console.log("Custom types dropped if they existed.");

  } catch (err) {
    console.error("Error dropping tables:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
