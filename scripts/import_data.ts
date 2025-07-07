import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import pg from "pg";
import { faker } from "@faker-js/faker";

const { Client } = pg;

interface RefundRow {
  refund_delay_days: string;
}

async function run() {
  const client = new Client({
    user: "intuit_demo",
    host: "localhost",
    database: "intuit_demo_db",
    password: "supersecret",
    port: 5432,
  });

  await client.connect();
  console.log("Connected to Postgres.");

  // Create fake users
  const userIds: number[] = [];
  for (let i = 0; i < 20; i++) {
    const res = await client.query(
      `INSERT INTO users (username, email) VALUES ($1, $2) RETURNING user_id`,
      [faker.internet.username(), faker.internet.email()]
    );
    userIds.push(res.rows[0].user_id);
  }
  console.log("Inserted fake users.");

  // Create fake tax returns tied to users
  const returnIds: number[] = [];
  const returnsNeedingRefundStatus: number[] = [];
  const returnsNeedingPrediction: number[] = [];

  for (let i = 0; i < 100; i++) {
    const userId = faker.helpers.arrayElement(userIds);
    const res = await client.query(
      `INSERT INTO tax_return (
        user_id,
        filing_method,
        filing_time_category,
        bank_deposit_type,
        geo_region,
        prior_credits_claimed,
        has_return_errors,
        requires_id_verification,
        is_selected_for_manual_review,
        claimed_eitc,
        claimed_actc,
        is_amended_return,
        has_injured_spouse_claim,
        has_offset_debts,
        prior_refund_delayed,
        prior_id_verification_flagged,
        has_bank_info_on_file,
        num_days_since_filed,
        return_completeness_score,
        prior_refund_processing_time
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20
      ) RETURNING return_id`,
      [
        userId,
        faker.helpers.arrayElement([
          "efile_direct_deposit",
          "efile_paper_check",
          "paper_direct_deposit",
          "paper_paper_check",
        ]),
        faker.helpers.arrayElement(["early", "normal", "late"]),
        faker.helpers.arrayElement([
          "traditional_bank",
          "credit_union",
          "prepaid_card",
          "third_party_processor",
          "unknown",
        ]),
        faker.helpers.arrayElement([
          "northeast",
          "midwest",
          "south",
          "west",
          "territories",
          "unknown",
        ]),
        faker.helpers.arrayElement(["none", "few", "many"]),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.datatype.boolean(),
        faker.number.int({ min: 1, max: 30 }),
        parseFloat(
          faker.finance.amount({ min: 0.5, max: 1, dec: 2 })
        ),
        parseFloat(
          faker.finance.amount({ min: 5, max: 30, dec: 1 })
        ),
      ]
    );
    const returnId = res.rows[0].return_id;

    returnIds.push(returnId);

    if (Math.random() < 0.5) {
      returnsNeedingRefundStatus.push(returnId);
    } else {
      returnsNeedingPrediction.push(returnId);
    }
  }
  console.log("Inserted fake tax returns.");

  // Load CSV refund delays
  const csvFilePath = path.resolve(
    process.cwd(),
    "../generated/training_data.csv"
  );

  const rows: RefundRow[] = [];

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (data: RefundRow) => {
        rows.push(data);
      })
      .on("end", resolve)
      .on("error", reject);
  });

  // // Insert refund_status rows
  // for (const returnId of returnsNeedingRefundStatus) {
  //   const row = faker.helpers.arrayElement(rows);
  //   const refundDelay = parseFloat(row.refund_delay_days);
  //
  //   await client.query(
  //     `INSERT INTO refund_status (
  //       return_id, status, refund_delay_days, last_checked_at
  //     ) VALUES ($1, $2, $3, $4)`,
  //     [
  //       returnId,
  //       faker.helpers.arrayElement([
  //         'ReturnReceived',
  //         'ReturnProcessing',
  //         'NeedMoreInformation',
  //         'RefundApproved',
  //         'RefundSent',
  //         'RefundAdjusted',
  //         'RefundDelayed',
  //         'RefundDenied',
  //       ]),
  //       refundDelay,
  //       new Date(),
  //     ]
  //   );
  // }
  // console.log(`Inserted ${returnsNeedingRefundStatus.length} refund_status records.`);

  // // Insert prediction rows
  // for (const returnId of returnsNeedingPrediction) {
  //   const row = faker.helpers.arrayElement(rows);
  //   const refundDelay = parseFloat(row.refund_delay_days);
  //   const reasonsObj = {
  //     days_since_filing: faker.datatype.float({ min: -3, max: +3, precision: 0.01 }),
  //     has_prior_delays: faker.datatype.float({ min: -3, max: +3, precision: 0.01 }),
  //     filing_method: faker.datatype.float({ min: -3, max: +3, precision: 0.01 }),
  //   };
  //
  //   await client.query(
  //     `INSERT INTO prediction (
  //       return_id, predicted_delay_days, reasons,
  //       percentile, model_version, prediction_timestamp
  //     ) VALUES ($1, $2, $3::jsonb, $4, $5, $6)`,
  //     [
  //       returnId,
  //       refundDelay,
  //       JSON.stringify(reasonsObj),
  //       faker.datatype.number({ min: 0, max: 100 }),
  //       "v1.3.0",
  //       new Date(),
  //     ]
  //   );
  // }
  // console.log(`Inserted ${returnsNeedingPrediction.length} prediction records.`);

  await client.end();
  console.log("Done!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
