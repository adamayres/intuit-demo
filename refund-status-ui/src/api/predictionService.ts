import type { RefundPrediction } from '@/types/RefundPredictionTypes.ts';

/**
 * Mock API service to fetch refund prediction data.
 *
 * //TODO: Replace with actual API calls when available.
 */
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
}
