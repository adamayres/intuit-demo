import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RefundStatusPage } from '@/pages/RefundStatusPage';
import * as useRefundStatusModule from '@/hooks/useRefundStatus';

vi.mock('@/hooks/useRefundStatus.ts');

const fakePrediction = {
  predictedDelayDays: 6.95,
  topReasons: [
    { feature: 'claimed_eitc', impact: -0.75 },
    { feature: 'filing_method_efile_direct_deposit', impact: -0.65 }
  ],
  percentile: 26.0
};

vi.mock('@/hooks/usePrediction.ts', () => ({
  usePrediction: () => ({
    prediction: fakePrediction,
    loading: false,
    error: null,
    getPrediction: vi.fn()
  })
}));

describe('RefundStatusPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the skeleton while loading', () => {
    vi.spyOn(useRefundStatusModule, 'useRefundStatus').mockReturnValue({
      loading: true,
      status: null,
      refresh: vi.fn(),
      error: null
    });

    render(<RefundStatusPage />);

    expect(screen.getByTestId('refund-status-skeleton-label')).toBeInTheDocument();

    expect(screen.getByTestId('refund-status-skeleton-value')).toBeInTheDocument();
  });

  it('renders the refund status when loaded', async () => {
    vi.spyOn(useRefundStatusModule, 'useRefundStatus').mockReturnValue({
      loading: false,
      status: {
        refundStatus: { status: 'ReturnProcessing', lastCheckedAt: new Date().toISOString() },
        prediction: fakePrediction
      },
      refresh: vi.fn(),
      error: null
    });

    render(<RefundStatusPage />);

    await waitFor(() => {
      expect(screen.getByText(/Return Processing/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Last Updated/i)).toBeInTheDocument();
  });

  it('renders prediction info if status is predictable', async () => {
    vi.spyOn(useRefundStatusModule, 'useRefundStatus').mockReturnValue({
      loading: false,
      status: {
        refundStatus: { status: 'RefundApproved', lastCheckedAt: new Date().toISOString() },
        prediction: fakePrediction
      },
      refresh: vi.fn(),
      error: null
    });

    render(<RefundStatusPage />);

    await waitFor(() => {
      expect(screen.getByText(/Refund Approved/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Estimated Refund Timing/i)).toBeInTheDocument();
  });

  it('renders nothing if no refund status is present and not loading', () => {
    vi.spyOn(useRefundStatusModule, 'useRefundStatus').mockReturnValue({
      loading: false,
      status: null,
      refresh: vi.fn(),
      error: null
    });

    render(<RefundStatusPage />);

    expect(screen.queryByText(/Refund Status/i)).not.toBeInTheDocument();
  });
});
