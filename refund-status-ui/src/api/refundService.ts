import type { RefundStatus } from '@/types/RefundStatusTypes.ts';

export async function getRefundStatus(): Promise<RefundStatus> {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockResponse: RefundStatus = {
        status: 'ReturnReceived',
        lastUpdated: new Date().toISOString()
      };
      resolve(mockResponse);
    }, 1000);
  });

  // const res = await fetch('/api/refund-status');
  // if (!res.ok) throw new Error('Failed to fetch refund status');
  // return res.json();
}

export async function refreshRefundStatus(): Promise<RefundStatus> {
  return new Promise(resolve => {
    setTimeout(() => {
      const mockResponse: RefundStatus = {
        status: 'RefundApproved',
        lastUpdated: new Date().toISOString()
      };
      resolve(mockResponse);
    }, 1000);
  });

  // const res = await fetch('/api/refund-status/refresh', {
  //   method: 'POST'
  // });
  // if (!res.ok) throw new Error('Failed to refresh refund status');
  // return res.json();
}
