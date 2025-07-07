import pg from "pg";

const { Client } = pg;

async function clearTables() {
  const client = new Client({
    user: "intuit_demo",
    host: "localhost",
    database: "intuit_demo_db",
    password: "intuit",
    port: 5432,
  });

  await client.connect();
  console.log("Connected to Postgres.");

  try {
    // Start transaction
    await client.query("BEGIN");

    // Clear in FK-safe order
    await client.query("DELETE FROM refund_status;");
    await client.query("DELETE FROM prediction;");
    await client.query("DELETE FROM tax_return;");
    await client.query("DELETE FROM users;");

    // Optionally reset serial IDs
    await client.query("ALTER SEQUENCE refund_status_refund_status_id_seq RESTART WITH 1;");
    await client.query("ALTER SEQUENCE prediction_prediction_id_seq RESTART WITH 1;");
    await client.query("ALTER SEQUENCE tax_return_return_id_seq RESTART WITH 1;");
    await client.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1;");

    await client.query("COMMIT");
    console.log("All tables cleared and sequences reset!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error clearing tables:", err);
  } finally {
    await client.end();
  }
}

clearTables().catch((err) => {
  console.error(err);
  process.exit(1);
});
