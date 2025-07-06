import type { RefundStatus } from '@/types/RefundStatusTypes.ts';

/**
 * Mock API service to fetch refund status data.
 *
 * //TODO: Replace with actual API calls when available.
 */
export async function getRefundStatus(mockedResponse?: RefundStatus): Promise<RefundStatus> {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockResponse: RefundStatus = mockedResponse ?? {
        status: 'ReturnReceived',
        lastUpdated: new Date().toISOString()
      };
      resolve(mockResponse);
    }, 1000);
  });
}
