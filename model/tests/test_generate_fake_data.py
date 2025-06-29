import pandas as pd
from model.generate_fake_data import generate_fake_data
from pathlib import Path

def test_generate_fake_data(tmp_path):
  # Arrange
  output_path = generate_fake_data(
    output_dir=str(tmp_path),
    filename="fake_data.csv",
    n_rows=100
  )

  print(f"Generated file at: {output_path}")

  # Check file exists
  assert Path(output_path).exists(), f"File not found: {output_path}"

  # Load data
  df = pd.read_csv(output_path)
  assert not df.empty

  # Assert
  df = pd.read_csv(output_path)

  # Check shape
  assert df.shape[0] == 100

  # Check required columns
  expected_cols = [
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
    "prior_refund_processing_time",
    "refund_delay_days"
  ]

  missing_cols = set(expected_cols) - set(df.columns)
  assert not missing_cols, f"Missing columns: {missing_cols}"

  # Check no nulls
  assert df.isnull().sum().sum() == 0, "Data has nulls"

  # Check categorical values
  assert set(df["filing_method"].unique()).issubset({
    "efile_direct_deposit",
    "efile_paper_check",
    "paper_direct_deposit",
    "paper_paper_check"
  })

  assert set(df["filing_time_category"].unique()).issubset({
    "early", "normal", "late"
  })

  assert set(df["bank_deposit_type"].unique()).issubset({
    "traditional_bank", "credit_union", "prepaid_card",
    "third_party_processor", "unknown"
  })

  assert set(df["geo_region"].unique()).issubset({
    "northeast", "midwest", "south",
    "west", "territories", "unknown"
  })

  assert set(df["prior_credits_claimed"].unique()).issubset({
    "none", "few", "many"
  })

  # Check booleans are 0 or 1
  boolean_cols = [
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
    "has_bank_info_on_file"
  ]

  for col in boolean_cols:
    unique_vals = set(df[col].unique())
    assert unique_vals.issubset({0, 1}), f"{col} has unexpected values: {unique_vals}"

  # Check numeric columns ranges
  assert (df["num_days_since_filed"] >= 1).all()
  assert (df["num_days_since_filed"] <= 60).all()

  assert (df["return_completeness_score"] >= 0).all()
  assert (df["return_completeness_score"] <= 1).all()

  assert (df["prior_refund_processing_time"] >= 1).all()

  assert (df["refund_delay_days"] >= 1).all()

  print("All fake data tests passed.")
