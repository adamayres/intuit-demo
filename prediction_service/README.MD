# Intuit Prediction Service

The prediction service is a FastAPI application that provides an endpoint for making predictions using a machine learning model.

## Running locally

From the project root directory, you can run the prediction service locally using the following commands:

```
source .venv/bin/activate
pip install -r requirements.txt
uvicorn prediction_service.app:app --reload
```

Or

```
make install
make prediction_service
```

## Calling the prediction service

You can call the prediction service using `curl` or any HTTP client. The endpoint expects a JSON payload with the input data for the model.

### Example request

```bash
curl --location 'http://localhost:8000/predict' \
  --header 'Content-Type: application/json' \
  --data '{
    "filing_method": "efile_direct_deposit",
    "filing_time_category": "early",
    "bank_deposit_type": "traditional_bank",
    "geo_region": "west",
    "prior_credits_claimed": "few",
    "has_return_errors": false,
    "requires_id_verification": false,
    "is_selected_for_manual_review": false,
    "claimed_eitc": true,
    "claimed_actc": false,
    "is_amended_return": false,
    "has_injured_spouse_claim": false,
    "has_offset_debts": false,
    "prior_refund_delayed": false,
    "prior_id_verification_flagged": false,
    "has_bank_info_on_file": true,
    "num_days_since_filed": 12,
    "return_completeness_score": 0.95,
    "prior_refund_processing_time": 10.0
  }
'
```

### Example response

```json
{
  "predicted_delay_days": 6.95,
  "top_reasons": [
    {
      "feature": "claimed_eitc",
      "impact": -0.75
    },
    {
      "feature": "filing_method_efile_direct_deposit",
      "impact": -0.65
    },
    {
      "feature": "prior_credits_claimed_many",
      "impact": 0.09
    }
  ],
  "percentile": 26.0
}
```

