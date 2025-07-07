import type { RefundPrediction } from '@/types/RefundPredictionTypes.ts';

/**
 * Mock API service to fetch refund prediction data.
 *
 */
export async function getPrediction(): Promise<RefundPrediction> {
  const response = await fetch('http://localhost:8000/predict', { credentials: 'include' });
  // TODO: Handle errors appropriately in production code
  return (await response.json()) as RefundPrediction;
}
