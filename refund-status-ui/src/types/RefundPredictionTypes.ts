export type RefundPrediction = {
  predictedDelayDays: number;
  topReasons: PredictionReason[];
  percentile: number;
};

export type PredictionReason = {
  feature: string;
  impact: number;
};
