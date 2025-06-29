import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split

categorical_cols = [
  "filing_method",
  "filing_time_category",
  "bank_deposit_type",
  "geo_region",
  "prior_credits_claimed"
]


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

  # Evaluate
  # y_pred = model.predict(dtest)
  # rmse = root_mean_squared_error(y_test, y_pred)

  # print(f"RMSE: {rmse:.2f} days")

  return trained_model, X_encoded, X_test, X_train, dtest, y_test, y_train


if __name__ == "__main__":
  import argparse
  from rich import print

  parser = argparse.ArgumentParser()
  parser.add_argument("--input-csv", required=True)
  parser.add_argument("--output-model-path", default="../backend/model.ubj")

  args = parser.parse_args()

  trained_model, X_encoded, X_test, X_train, dtest, y_test, y_train = train_model(args.input_csv)

  trained_model.save_model(args.output_model_path)
  print(f"Model saved to: [bold magenta]{args.output_model_path}[/bold magenta]")
