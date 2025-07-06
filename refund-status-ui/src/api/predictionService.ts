import type { RefundPrediction } from '@/types/RefundPredictionTypes.ts';

export async function getPrediction(): Promise<RefundPrediction> {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockResponse: RefundPrediction = {
        predictedDelayDays: 5,
        topReasons: [
          {
            feature: 'claimed_eitc',
            impact: -0.75
          },
          {
            feature: 'filing_method_efile_direct_deposit',
            impact: -0.65
          },
          {
            feature: 'prior_credits_claimed_many',
            impact: 0.09
          }
        ],
        percentile: 26.0
      };
      resolve(mockResponse);
    }, 1000);
  });

  // const res = await fetch(`/api/prediction`);
  // if (!res.ok) throw new Error('Failed to fetch prediction');
  // const json = await res.json();
  //
  // return {
  //   predictedDelayDays: json.predicted_delay_days,
  //   topReasons: json.top_reasons.map((reason: any) => ({
  //     feature: reason.feature,
  //     impact: reason.impact,
  //   })),
  //   percentile: json.percentile,
  // };
}
