import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import pg from "pg";
import { faker } from "@faker-js/faker";

const { Client } = pg;

interface RefundRow {
  refund_delay_days: string;
}

const createFakeRefundStatuses = true;
const createFakePredictions = true;

async function run() {
  const client = new Client({
    user: "intuit_demo",
    host: "localhost",
    database: "intuit_demo_db",
    password: "intuit",
    port: 5432,
  });

  await client.connect();
  console.log("Connected to Postgres.");

  // Prepare CSV data
  const csvFilePath = path.resolve(process.cwd(), "../generated/training_data.csv");

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

  const returnsNeedingRefundStatus: number[] = [];
  const returnsNeedingPrediction: number[] = [];

  for (let i = 0; i < 100; i++) {
    // CREATE A UNIQUE USER for this tax return
    const userRes = await client.query(
      `INSERT INTO users (username, email)
       VALUES ($1, $2)
       RETURNING user_id`,
      [faker.internet.username(), faker.internet.email()]
    );

    const userId = userRes.rows[0].user_id;

    const filedAt = faker.date.between({
      from: "2025-07-03",
      to: "2025-07-07",
    });

    // INSERT tax_return
    const taxReturnRes = await client.query(
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
        prior_refund_processing_time,
        filed_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20, $21
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
        filedAt
      ]
    );

    const returnId = taxReturnRes.rows[0].return_id;

    if (userId < 50) {
      returnsNeedingRefundStatus.push(returnId);
      returnsNeedingPrediction.push(returnId);
    }
  }

  console.log("Inserted users and tax returns.");

  if (createFakeRefundStatuses) {
    // INSERT refund_status rows
    for (const returnId of returnsNeedingRefundStatus) {
      const row = faker.helpers.arrayElement(rows);
      const refundDelay = parseFloat(row.refund_delay_days);

      const possibleStatuses = [
        'ReturnReceived',
        'NeedMoreInformation',
        'RefundDelayed',
        'RefundDenied',
        'RefundApproved',
        'ReturnProcessing',
        'RefundAdjusted',
        'RefundSent'
      ];

      let status;
      let lastCheckedAt;

      if (returnId < 9) {
        status = possibleStatuses[returnId - 1];
        lastCheckedAt = new Date();
      } else {
        status = faker.helpers.arrayElement(possibleStatuses);
        lastCheckedAt = faker.date.between({
          from: new Date(Date.now() - 2 * 60 * 60 * 1000),
          to: new Date(),
        });
      }

      await client.query(
        `INSERT INTO refund_status (return_id,
                                    status,
                                    refund_delay_days,
                                    last_checked_at)
         VALUES ($1, $2, $3, $4)`,
        [
          returnId,
          status,
          refundDelay,
          lastCheckedAt,
        ]
      );
    }
    console.log(`Inserted ${returnsNeedingRefundStatus.length} refund_status rows.`);
  }

  if (createFakePredictions) {
    // INSERT prediction rows
    for (const returnId of returnsNeedingPrediction) {
      const row = faker.helpers.arrayElement(rows);
      const refundDelay = parseFloat(row.refund_delay_days);

      const possibleReasons = [
        "filing_method",
        "filing_time_category",
        "bank_deposit_type",
        "geo_region",
        "prior_credits_claimed",
        "has_return_errors",
        "requires_id_verification",
        "is_selected_for_manual_review",
        "claimed_eitc",
        "claimed_actc",
        "is_amended_return",
        "has_injured_spouse_claim",
        "has_offset_debts",
        "prior_refund_delayed",
        "prior_id_verification_flagged",
        "has_bank_info_on_file",
        "num_days_since_filed",
        "return_completeness_score",
        "prior_refund_processing_time"
      ];

      const fasterReasons = new Set([
        "filing_method",
        "filing_time_category",
        "has_bank_info_on_file",
        "return_completeness_score"
      ]);

      const slowerReasons = new Set([
        "requires_id_verification",
        "has_return_errors",
        "is_selected_for_manual_review",
        "claimed_eitc",
        "claimed_actc",
        "is_amended_return",
        "has_injured_spouse_claim",
        "has_offset_debts",
        "prior_refund_delayed",
        "prior_id_verification_flagged",
        "prior_refund_processing_time",
        "num_days_since_filed"
      ]);

      // Shuffle and pick 3 reasons
      const reasonsShuffled = faker.helpers.shuffle(possibleReasons);
      const selectedReasons = reasonsShuffled.slice(0, 3);

      const reasonsObj = selectedReasons.map((reason) => {
        let impactValue: number;

        if (fasterReasons.has(reason)) {
          // Faster reasons → negative impact
          impactValue = faker.number.float({
            min: -3,
            max: -0.1,
            fractionDigits: 2
          });
        } else if (slowerReasons.has(reason)) {
          // Slower reasons → positive impact
          impactValue = faker.number.float({
            min: 0.1,
            max: 3,
            fractionDigits: 2
          });
        } else {
          // Neutral → random sign
          impactValue = faker.helpers.arrayElement([
            faker.number.float({ min: -3, max: -0.1, fractionDigits: 2 }),
            faker.number.float({ min: 0.1, max: 3, fractionDigits: 2 })
          ]);
        }

        return {
          feature: reason,
          impact: impactValue
        };
      });

      await client.query(
        `INSERT INTO prediction (return_id,
                                 predicted_delay_days,
                                 reasons,
                                 percentile,
                                 model_version,
                                 prediction_timestamp)
         VALUES ($1, $2, $3::jsonb, $4, $5, $6)`,
        [
          returnId,
          refundDelay,
          JSON.stringify(reasonsObj),
          faker.number.int({min: 0, max: 100}),
          "v1.3.0",
          new Date(),
        ]
      );
    }

    console.log(`Inserted ${returnsNeedingPrediction.length} prediction rows.`);
  }

  await client.end();
  console.log("Done!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
