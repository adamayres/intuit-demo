export type RefundStatusType =
  | 'ReturnReceived'
  | 'ReturnProcessing'
  | 'NeedMoreInformation'
  | 'RefundApproved'
  | 'RefundSent'
  | 'RefundAdjusted'
  | 'RefundDelayed'
  | 'RefundDenied';

export type RefundStatus = {
  status: RefundStatusType;
  lastUpdated: string;
};
