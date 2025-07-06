// /hooks/usePrediction.ts

import { useState } from 'react';
import type { RefundStatus } from '../types/RefundStatusTypes';
import type { RefundPrediction } from '../types/RefundPredictionTypes';
import { getPrediction as fetchPrediction } from '../api/predictionService';
import { isPredictable } from '@/lib/isPredictable.ts';

export function usePrediction(): {
  prediction: RefundPrediction | null;
  loading: boolean;
  error: string | null;
  getPrediction: (status: RefundStatus) => void;
} {
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
