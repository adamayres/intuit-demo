import pg from "pg";

const { Client } = pg;

async function createTables() {
  const client = new Client({
    user: "intuit_demo",
    host: "localhost",
    database: "intuit_demo_db",
    password: "supersecret",
    port: 5432,
  });

  await client.connect();
  console.log("Connected to Postgres.");

  try {
    await client.query("BEGIN");

    // Create ENUM type if not exists
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'refund_status_type'
        ) THEN
          CREATE TYPE refund_status_type AS ENUM (
            'ReturnReceived',
            'ReturnProcessing',
            'NeedMoreInformation',
            'RefundApproved',
            'RefundSent',
            'RefundAdjusted',
            'RefundDelayed',
            'RefundDenied'
          );
        END IF;
      END
      $$;
    `);

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL
      );
    `);

    // Create tax_return table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tax_return (
        return_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        filing_method TEXT,
        filing_time_category TEXT,
        bank_deposit_type TEXT,
        geo_region TEXT,
        prior_credits_claimed TEXT,
        has_return_errors BOOLEAN,
        requires_id_verification BOOLEAN,
        is_selected_for_manual_review BOOLEAN,
        claimed_eitc BOOLEAN,
        claimed_actc BOOLEAN,
        is_amended_return BOOLEAN,
        has_injured_spouse_claim BOOLEAN,
        has_offset_debts BOOLEAN,
        prior_refund_delayed BOOLEAN,
        prior_id_verification_flagged BOOLEAN,
        has_bank_info_on_file BOOLEAN,
        num_days_since_filed INT,
        return_completeness_score FLOAT,
        prior_refund_processing_time FLOAT
      );
    `);

    // Create refund_status table
    await client.query(`
      CREATE TABLE IF NOT EXISTS refund_status (
        refund_status_id SERIAL PRIMARY KEY,
        return_id INT REFERENCES tax_return(return_id),
        status refund_status_type,
        refund_delay_days FLOAT,
        last_checked_at TIMESTAMP
      );
    `);

    // Create prediction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS prediction (
        prediction_id SERIAL PRIMARY KEY,
        return_id INT REFERENCES tax_return(return_id),
        predicted_delay_days FLOAT,
        reasons JSONB,
        percentile FLOAT,
        model_version TEXT,
        prediction_timestamp TIMESTAMP
      );
    `);

    await client.query("COMMIT");
    console.log("Tables created successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating tables:", err);
  } finally {
    await client.end();
  }
}

createTables().catch((err) => {
  console.error(err);
  process.exit(1);
});
