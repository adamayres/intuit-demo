# Intuit Demo

This has been left intentionally vague as to not unintentionally leak any sensitive information.

## License

Copyright © 2025 Adam Ayres. All rights reserved.

This code is proprietary and confidential. Unauthorized copying, distribution,
or use of this material is strictly prohibited.

## Commands

Generate fake test data.
```
make generate-fake-data
```

Run tests
```
make test
```

Run test coverage report
```
make coverage
```

Clean generated directories
```
make clean
```

## Model Features

The AI model uses the following features as inputs:

| Feature ID | Type | Description | Possible Values |
|------------|------|-------------|-----------------|
| **filing_method** | Enum | How the return was filed and how refund is delivered | efile_direct_deposit, efile_paper_check, paper_direct_deposit, paper_paper_check |
| **filing_time_category** | Enum | Whether filing was early, on time, or late | early, normal, late |
| **bank_deposit_type** | Enum | Type of financial account for direct deposit | traditional_bank, credit_union, prepaid_card, third_party_processor, unknown |
| **geo_region** | Enum | User's geographic region | northeast, midwest, south, west, territories, unknown |
| **prior_credits_claimed** | Categorical | Level of credits claimed in prior years | none, few, many |
| **has_return_errors** | Boolean | Whether the return has known errors | 0 (No), 1 (Yes) |
| **requires_id_verification** | Boolean | Whether identity verification is required | 0 (No), 1 (Yes) |
| **is_selected_for_manual_review** | Boolean | Whether the return is flagged for manual review | 0 (No), 1 (Yes) |
| **claimed_eitc** | Boolean | Whether the taxpayer claimed the Earned Income Tax Credit | 0 (No), 1 (Yes) |
| **claimed_actc** | Boolean | Whether the taxpayer claimed the Additional Child Tax Credit | 0 (No), 1 (Yes) |
| **is_amended_return** | Boolean | Whether the return is an amended filing | 0 (No), 1 (Yes) |
| **has_injured_spouse_claim** | Boolean | Whether the return includes an injured spouse claim | 0 (No), 1 (Yes) |
| **has_offset_debts** | Boolean | Whether refund is subject to debt offset | 0 (No), 1 (Yes) |
| **prior_refund_delayed** | Boolean | Whether the taxpayer experienced refund delays previously | 0 (No), 1 (Yes) |
| **prior_id_verification_flagged** | Boolean | Whether the taxpayer previously required ID verification | 0 (No), 1 (Yes) |
| **has_bank_info_on_file** | Boolean | Whether the IRS has bank information on file for the taxpayer | 0 (No), 1 (Yes) |
| **num_days_since_filed** | Numeric | Days elapsed since filing the return | integer (e.g. 12) |
| **return_completeness_score** | Numeric | Score measuring completeness of the return data | float (0.0 to 1.0) |
| **prior_refund_processing_time** | Numeric | Number of days it took to process the taxpayer's previous refund | integer (e.g. 10) |
