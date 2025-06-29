import pandas as pd
import numpy as np
import os
from rich import print
from pathlib import Path


def generate_fake_data(output_dir="../generated", filename="training_data.csv", n_rows=500, random_seed=42):
  """
  Generate synthetic training data for the refund delay prediction model.

  This function creates a synthetic dataset simulating user tax return data
  for training machine learning models. It includes categorical, boolean,
  and numeric features relevant to predicting refund delays. The output
  is saved as a CSV file in the specified output directory.

  Args:
    output_dir (str, optional): Directory where the CSV file will be saved. Defaults to "../generated".
    filename (str, optional): Name of the CSV file. Defaults to "training_data.csv".
    n_rows (int, optional): Number of rows to generate. Defaults to 500.
    random_seed (int, optional): Random seed for reproducibility. Defaults to 42.

  Returns:
    str: Absolute path to the generated CSV file.

  Example:
    >>> generate_fake_data(output_dir="../generated", filename="training_data.csv", n_rows=1000)
    '/absolute/path/to/training_data.csv'
  """

  rng = np.random.default_rng(seed=random_seed)

  os.makedirs(output_dir, exist_ok=True)

  output_path = Path(output_dir) / filename
  output_path = output_path.resolve()

  # Enums
  filing_method_choices = [
    "efile_direct_deposit",
    "efile_paper_check",
    "paper_direct_deposit",
    "paper_paper_check"
  ]

  filing_time_category_choices = ["early", "normal", "late"]

  bank_deposit_type_choices = [
    "traditional_bank",
    "credit_union",
    "prepaid_card",
    "third_party_processor",
    "unknown"
  ]

  geo_region_choices = [
    "northeast",
    "midwest",
    "south",
    "west",
    "territories",
    "unknown"
  ]

  prior_credits_claimed_choices = ["none", "few", "many"]

  data = {
    "filing_method": rng.choice(filing_method_choices, size=n_rows),
    "filing_time_category": rng.choice(filing_time_category_choices, size=n_rows),
    "bank_deposit_type": rng.choice(bank_deposit_type_choices, size=n_rows),
    "geo_region": rng.choice(geo_region_choices, size=n_rows),
    "prior_credits_claimed": rng.choice(prior_credits_claimed_choices, size=n_rows)
  }

  # Boolean features
  boolean_features = [
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
  ]

  # Booleans
  for feature in boolean_features:
    values = rng.integers(0, 2, size=n_rows)
    # add ~5% random flips to simulate data noise
    flip_mask = rng.random(size=n_rows) < 0.05
    values[flip_mask] = 1 - values[flip_mask]
    data[feature] = values

  # Numerics with noise
  data["num_days_since_filed"] = np.clip(
    rng.integers(1, 60, size=n_rows) + rng.normal(0, 2, size=n_rows),
    1, 60
  )

  data["return_completeness_score"] = np.clip(
    rng.uniform(0.5, 1.0, size=n_rows) + rng.normal(0, 0.05, size=n_rows),
    0, 1
  )

  data["prior_refund_processing_time"] = np.clip(
    rng.integers(5, 30, size=n_rows) + rng.normal(0, 2, size=n_rows),
    1, None
  )

  # Create target variable with noise
  refund_delay_days = (
    10
    - 2 * (data["claimed_eitc"])
    - 1.5 * (data["filing_method"] == "efile_direct_deposit")
    + rng.normal(0, 2, size=n_rows)
  )

  refund_delay_days = np.clip(refund_delay_days, 1, None)

  data["refund_delay_days"] = refund_delay_days

  # Create DataFrame
  df = pd.DataFrame(data)

  # Save
  df.to_csv(output_path, index=False)

  print(f"Training data generated at [bold magenta]{output_path}[/bold magenta]")

  return output_path
