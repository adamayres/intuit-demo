import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';

type StatusStyle = {
  /**
   * Background color class for the status
   */
  bg: string;
  /**
   * Text color class for the status
   */
  text: string;
};

export const defaultStatusStyle: StatusStyle = {
  bg: 'bg-gray-100 dark:bg-gray-800',
  text: 'text-gray-800 dark:text-gray-100'
};

export const refundStatusStyles: Record<RefundStatusType, StatusStyle> = {
  ReturnReceived: {
    bg: 'bg-yellow-100 dark:bg-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-100'
  },
  ReturnProcessing: {
    bg: 'bg-blue-100 dark:bg-blue-800',
    text: 'text-blue-800 dark:text-blue-100'
  },
  NeedMoreInformation: {
    bg: 'bg-orange-100 dark:bg-orange-800',
    text: 'text-orange-800 dark:text-orange-100'
  },
  RefundApproved: {
    bg: 'bg-green-100 dark:bg-green-800',
    text: 'text-green-800 dark:text-green-100'
  },
  RefundSent: {
    bg: 'bg-teal-100 dark:bg-teal-800',
    text: 'text-teal-800 dark:text-teal-100'
  },
  RefundAdjusted: {
    bg: 'bg-purple-100 dark:bg-purple-800',
    text: 'text-purple-800 dark:text-purple-100'
  },
  RefundDelayed: {
    bg: 'bg-red-100 dark:bg-red-800',
    text: 'text-red-800 dark:text-red-100'
  },
  RefundDenied: {
    bg: 'bg-rose-100 dark:bg-rose-800',
    text: 'text-rose-800 dark:text-rose-100'
  }
};
