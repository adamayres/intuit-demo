import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
import joblib
import os
import numpy as np
from dataclasses import dataclass

categorical_cols = [
  "filing_method",
  "filing_time_category",
  "bank_deposit_type",
  "geo_region",
  "prior_credits_claimed"
]

@dataclass
class TrainModelResult:
    model: xgb.Booster
    X_encoded: pd.DataFrame
    X_test: pd.DataFrame
    X_train: pd.DataFrame
    dtest: xgb.DMatrix
    y_test: pd.Series
    y_train: pd.Series
    y_values: np.ndarray

def train_model(filepath="training_data.csv"):
  """
  Train an XGBoost model on tax refund data.

  This function:
    - separates the target variable from the features
    - one-hot encodes categorical features
    - splits data into training and testing sets
    - trains an XGBoost regression model

  Args:
    filepath (str): Path to the CSV file containing training data.
         Defaults to "training_data.csv".

  Returns:
    model (xgb.Booster): Trained XGBoost model.
    X_encoded (pd.DataFrame): Fully one-hot encoded feature matrix.
    X_test (pd.DataFrame): One-hot encoded features of the test set.
    X_train (pd.DataFrame): One-hot encoded features of the training set.
    dtest (xgb.DMatrix): DMatrix for the test set, used for evaluation.
    y_test (pd.Series): True target values for the test set.
    y_train (pd.Series): True target values for the training set.

  Example:
    >>> trained_model, X_encoded, X_test, X_train = train_model(filepath="path/to/data.csv")
  """

  df = pd.read_csv(filepath)

  # Separate features and target
  X_raw = df.drop(columns=["refund_delay_days"])
  y = df["refund_delay_days"]

  # One-hot encode categorical columns
  X_encoded = pd.get_dummies(X_raw, columns=categorical_cols)

  # Split into train/test
  X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y, test_size=0.2, random_state=42
  )

  # Convert to DMatrix
  dtrain = xgb.DMatrix(X_train, label=y_train)
  dtest = xgb.DMatrix(X_test, label=y_test)

  # Define parameters
  params = {
    "objective": "reg:squarederror",
    "max_depth": 4,
    "eta": 0.1
  }

  # Train model
  trained_model = xgb.train(
    params,
    dtrain,
    num_boost_round=100,
    evals=[(dtest, "test")],
    early_stopping_rounds=10,
    verbose_eval=False
  )

  return TrainModelResult(
    model=trained_model,
    X_encoded=X_encoded,
    X_test=X_test,
    X_train=X_train,
    dtest=dtest,
    y_test=y_test,
    y_train=y_train,
    y_values=y.values
  )


if __name__ == "__main__":
  import argparse
  from rich import print

  parser = argparse.ArgumentParser()
  parser.add_argument("--input-csv", required=True)
  parser.add_argument("--output-model-path", default="../generated/model.ubj")
  parser.add_argument("--output-model-features-path", default="../generated/model-features.joblib")
  parser.add_argument("--output-delays-path", default="../generated/training-delays.npy")

  args = parser.parse_args()

  res = train_model(args.input_csv)

  model_features = list(res.X_encoded.columns)

  os.makedirs(
    os.path.dirname(args.output_model_features_path),
    exist_ok=True
  )

  joblib.dump(
    model_features,
    args.output_model_features_path
  )
  print(f"Model features saved to: [bold magenta]{args.output_model_features_path}[/bold magenta]")

  os.makedirs(
    os.path.dirname(args.output_model_path),
    exist_ok=True
  )

  res.model.save_model(args.output_model_path)
  print(f"Model saved to: [bold magenta]{args.output_model_path}[/bold magenta]")

  os.makedirs(
    os.path.dirname(args.output_delays_path),
    exist_ok=True
  )

  np.save(args.output_delays_path, res.y_values)
  print(f"Training delays saved to: [bold magenta]{args.output_delays_path}[/bold magenta]")
