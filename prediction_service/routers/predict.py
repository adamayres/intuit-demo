from fastapi import APIRouter
from fastapi import HTTPException
from prediction_service.schemas import RefundRequest
import pandas as pd
import xgboost as xgb
import shap
import joblib
import numpy as np
from scipy.stats import percentileofscore
import os

model_path = os.path.abspath(
  os.path.join(os.path.dirname(__file__), "../../generated/model.ubj")
)

model_features_path = os.path.abspath(
  os.path.join(os.path.dirname(__file__), "../../generated/model-features.joblib")
)

training_delays_path = os.path.abspath(
  os.path.join(os.path.dirname(__file__), "../../generated/training-delays.npy")
)

router = APIRouter()

model = xgb.Booster()
model.load_model(model_path)

explainer = shap.TreeExplainer(model)

model_features = joblib.load(model_features_path)

training_delays = np.load(training_delays_path)


@router.post("/predict")
def predict(data: RefundRequest):
  try:
    # Convert Pydantic model to dict
    payload = data.model_dump()

    # Convert to DataFrame
    sample_df = pd.DataFrame([payload])

    # One-hot encode categorical columns
    categorical_cols = [
      "filing_method",
      "filing_time_category",
      "bank_deposit_type",
      "geo_region",
      "prior_credits_claimed"
    ]

    sample_encoded = pd.get_dummies(
      sample_df,
      columns=categorical_cols
    )

    # Ensure all model columns exist
    missing_cols = set(model_features) - set(sample_encoded.columns)
    for col in missing_cols:
      sample_encoded[col] = 0

    # Ensure column order matches training
    sample_encoded = sample_encoded[model_features]

    # Predict
    d_sample = xgb.DMatrix(sample_encoded)
    pred_delay = model.predict(d_sample)

    # Round prediction
    predicted_delay_days = round(float(pred_delay[0]), 2)

    # SHAP or explanations (optional)
    shap_values = explainer.shap_values(sample_encoded)

    # # Create a dict mapping feature → shap value
    # reasons = {
    #   key: float(value)
    #   for key, value in zip(sample_df.columns, shap_values[0])
    # }

    # Pair features and impacts
    shap_pairs = list(zip(
      sample_encoded.columns,
      shap_values[0]
    ))

    # Sort by absolute impact
    top_3 = sorted(
      shap_pairs,
      key=lambda x: abs(x[1]),
      reverse=True
    )[:3]

    # Format response
    top_reasons = [
      {
        "feature": feature,
        "impact": round(float(impact), 2)
      }
      for feature, impact in top_3
    ]

    # Compute percentile
    percentile = percentileofscore(training_delays, predicted_delay_days)
    percentile = round(percentile, 2)

    return {
      "predicted_delay_days": predicted_delay_days,
      "top_reasons": top_reasons,
      "percentile": percentile
    }

  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
