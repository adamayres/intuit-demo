import { useState } from 'react';
import type { RefundStatus } from '../types/RefundStatusTypes';
import type { RefundPrediction } from '../types/RefundPredictionTypes';
import { getPrediction as fetchPrediction } from '../api/predictionService';
import { isPredictable } from '@/lib/isPredictable.ts';

type PredictionResult = {
  /**
   * Current refund prediction.
   */
  prediction: RefundPrediction | null;
  /**
   * Loading state indicating if the prediction is being fetched.
   */
  loading: boolean;
  /**
   * Error message if fetching the prediction fails.
   */
  error: string | null;
  /**
   * Function to fetch the prediction based on the refund status.
   *
   * @param status - The current refund status.
   */
  getPrediction: (status: RefundStatus) => void;
};

/**
 * Hook to fetch refund prediction.
 */
export function usePrediction(): PredictionResult {
  const [prediction, setPrediction] = useState<RefundPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPrediction = (status: RefundStatus) => {
    if (!isPredictable(status.status)) {
      setPrediction(null);
      return;
    }

    setLoading(true);
    fetchPrediction()
      .then(data => {
        setPrediction(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Prediction fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  return {
    prediction,
    loading,
    error,
    getPrediction
  };
}
