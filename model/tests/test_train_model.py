import pandas as pd
import xgboost as xgb
import subprocess
import sys
from model.train_model import train_model


def test_train_model(tmp_path):
  """
  Test the train_model function end-to-end.
  """

  # ----- Prepare a tiny CSV for testing -----
  # Create a tiny fake DataFrame for quick testing
  df = pd.DataFrame({
    "filing_method": ["efile_direct_deposit", "paper_paper_check"],
    "filing_time_category": ["early", "normal"],
    "bank_deposit_type": ["traditional_bank", "credit_union"],
    "geo_region": ["west", "south"],
    "prior_credits_claimed": ["few", "many"],
    "has_return_errors": [0, 1],
    "requires_id_verification": [0, 1],
    "is_selected_for_manual_review": [0, 1],
    "claimed_eitc": [1, 0],
    "claimed_actc": [0, 1],
    "is_amended_return": [0, 1],
    "has_injured_spouse_claim": [0, 1],
    "has_offset_debts": [0, 1],
    "prior_refund_delayed": [0, 1],
    "prior_id_verification_flagged": [0, 1],
    "has_bank_info_on_file": [1, 0],
    "num_days_since_filed": [12, 30],
    "return_completeness_score": [0.95, 0.80],
    "prior_refund_processing_time": [10, 15],
    "refund_delay_days": [13.0, 18.0]
  })

  # Save it to a temp CSV
  input_csv = tmp_path / "test_data.csv"
  df.to_csv(input_csv, index=False)

  # ----- Run your function -----
  trained_model, X_encoded, X_test, X_train, dtest, y_test, y_train = train_model(str(input_csv))

  # ----- Basic assertions -----

  # Check types
  assert isinstance(trained_model, xgb.Booster)
  assert isinstance(X_encoded, pd.DataFrame)
  assert isinstance(X_test, pd.DataFrame)
  assert isinstance(X_train, pd.DataFrame)
  assert isinstance(dtest, xgb.DMatrix)
  assert isinstance(y_test, pd.Series)
  assert isinstance(y_train, pd.Series)

  # Check that data shapes match
  assert X_test.shape[0] == y_test.shape[0]

  # Check expected columns exist
  expected_columns = [
    "filing_method_efile_direct_deposit",
    "filing_time_category_early",
    "bank_deposit_type_traditional_bank",
    "geo_region_west",
    "prior_credits_claimed_few",
    # ...and so on for the rest of your one-hot columns
  ]

  for col in expected_columns:
    assert col in X_encoded.columns

  # Check the model can predict
  predictions = trained_model.predict(dtest)
  assert predictions.shape[0] == y_test.shape[0]


def test_train_model_cli(tmp_path):
  """
  Test running train_model.py as a CLI script.
  """

  # ----- Create minimal fake CSV -----
  df = pd.DataFrame({
    "filing_method": ["efile_direct_deposit", "paper_paper_check"],
    "filing_time_category": ["early", "normal"],
    "bank_deposit_type": ["traditional_bank", "credit_union"],
    "geo_region": ["west", "south"],
    "prior_credits_claimed": ["few", "many"],
    "has_return_errors": [0, 1],
    "requires_id_verification": [0, 1],
    "is_selected_for_manual_review": [0, 1],
    "claimed_eitc": [1, 0],
    "claimed_actc": [0, 1],
    "is_amended_return": [0, 1],
    "has_injured_spouse_claim": [0, 1],
    "has_offset_debts": [0, 1],
    "prior_refund_delayed": [0, 1],
    "prior_id_verification_flagged": [0, 1],
    "has_bank_info_on_file": [1, 0],
    "num_days_since_filed": [12, 30],
    "return_completeness_score": [0.95, 0.80],
    "prior_refund_processing_time": [10, 15],
    "refund_delay_days": [13.0, 18.0]
  })

  input_csv = tmp_path / "data.csv"
  df.to_csv(input_csv, index=False)

  # ----- Define output model path -----
  output_model_path = tmp_path / "model.ubj"

  # ----- Run script via subprocess -----
  result = subprocess.run(
    [
      sys.executable,
      "model/train_model.py",
      "--input-csv", str(input_csv),
      "--output-model-path", str(output_model_path),
    ],
    capture_output=True,
    text=True,
    check=True,
  )

  print(result.stdout)
  print(result.stderr)

  # Check that the model file was created
  assert output_model_path.exists(), "Model file was not created."

  # Optionally check output text
  assert "Model saved to" in result.stdout
