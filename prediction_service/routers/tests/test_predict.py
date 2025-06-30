import pytest
from fastapi.testclient import TestClient
from prediction_service.app import app
import prediction_service.routers.predict as predict

client = TestClient(app)


def test_predict_endpoint():
  payload = {
    "filing_method": "efile_direct_deposit",
    "filing_time_category": "early",
    "bank_deposit_type": "traditional_bank",
    "geo_region": "west",
    "prior_credits_claimed": "few",

    "has_return_errors": False,
    "requires_id_verification": False,
    "is_selected_for_manual_review": False,
    "claimed_eitc": True,
    "claimed_actc": False,
    "is_amended_return": False,
    "has_injured_spouse_claim": False,
    "has_offset_debts": False,
    "prior_refund_delayed": False,
    "prior_id_verification_flagged": False,
    "has_bank_info_on_file": True,

    "num_days_since_filed": 12,
    "return_completeness_score": 0.95,
    "prior_refund_processing_time": 10.0
  }

  response = client.post("/predict", json=payload)

  assert response.status_code == 200

  data = response.json()

  assert "predicted_delay_days" in data
  assert isinstance(data["predicted_delay_days"], float)

  assert "top_reasons" in data
  assert isinstance(data["top_reasons"], list)
  assert len(data["top_reasons"]) <= 3

  for reason in data["top_reasons"]:
    assert "feature" in reason
    assert "impact" in reason
    assert isinstance(reason["feature"], str)
    assert isinstance(reason["impact"], float)

  assert "percentile" in data
  assert 0.0 <= data["percentile"] <= 100.0

def test_predict_raises_500(monkeypatch):
  # Simulate error from the model
  def fake_predict(*args, **kwargs):
      raise RuntimeError("Simulated model error")

  monkeypatch.setattr(
      predict.model,
      "predict",
      fake_predict
  )

  payload = {
      "filing_method": "efile_direct_deposit",
      "filing_time_category": "early",
      "bank_deposit_type": "traditional_bank",
      "geo_region": "west",
      "prior_credits_claimed": "few",
      "has_return_errors": False,
      "requires_id_verification": False,
      "is_selected_for_manual_review": False,
      "claimed_eitc": True,
      "claimed_actc": False,
      "is_amended_return": False,
      "has_injured_spouse_claim": False,
      "has_offset_debts": False,
      "prior_refund_delayed": False,
      "prior_id_verification_flagged": False,
      "has_bank_info_on_file": True,
      "num_days_since_filed": 12,
      "return_completeness_score": 0.95,
      "prior_refund_processing_time": 10.0
  }

  response = client.post("/predict", json=payload)

  # Assert we hit the except block
  assert response.status_code == 500
  assert "Simulated model error" in response.json()["detail"]
