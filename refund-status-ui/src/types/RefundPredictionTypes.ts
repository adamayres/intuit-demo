/**
 * Refund prediction.
 */
export type RefundPrediction = {
  /**
   * Number of days predicted for refund processing.
   */
  predictedDelayDays: number;
  /**
   * Top reasons for the prediction.
   */
  topReasons: PredictionReason[];
  /**
   * Percentile of the prediction.
   */
  percentile: number;
};

/**
 * Reason for the prediction impact.
 */
export type PredictionReason = {
  /**
   * Feature that contributed to the prediction.
   */
  feature: string;
  /**
   * Impact of the feature on the prediction.
   */
  impact: number;
};
