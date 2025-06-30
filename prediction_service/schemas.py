from pydantic import BaseModel
from typing import Literal


class RefundRequest(BaseModel):
  filing_method: Literal[
    "efile_direct_deposit",
    "efile_paper_check",
    "paper_direct_deposit",
    "paper_paper_check"
  ]

  filing_time_category: Literal[
    "early",
    "normal",
    "late"
  ]

  bank_deposit_type: Literal[
    "traditional_bank",
    "credit_union",
    "prepaid_card",
    "third_party_processor",
    "unknown"
  ]

  geo_region: Literal[
    "northeast",
    "midwest",
    "south",
    "west",
    "territories",
    "unknown"
  ]

  prior_credits_claimed: Literal[
    "few",
    "many",
    "none"
  ]

  has_return_errors: bool
  requires_id_verification: bool
  is_selected_for_manual_review: bool
  claimed_eitc: bool
  claimed_actc: bool
  is_amended_return: bool
  has_injured_spouse_claim: bool
  has_offset_debts: bool
  prior_refund_delayed: bool
  prior_id_verification_flagged: bool
  has_bank_info_on_file: bool

  num_days_since_filed: float
  return_completeness_score: float
  prior_refund_processing_time: float
