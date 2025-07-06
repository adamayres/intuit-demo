/**
 * Refund status types.
 */
export type RefundStatusType =
  | 'ReturnReceived'
  | 'ReturnProcessing'
  | 'NeedMoreInformation'
  | 'RefundApproved'
  | 'RefundSent'
  | 'RefundAdjusted'
  | 'RefundDelayed'
  | 'RefundDenied';

/**
 * Refund status with last updated timestamp.
 */
export type RefundStatus = {
  status: RefundStatusType;
  lastUpdated: string;
};
