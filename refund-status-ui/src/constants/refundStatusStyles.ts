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
  /**
   * Description text color class for the status
   */
  description: string;
};

export const defaultStatusStyle: StatusStyle = {
  bg: 'bg-gray-100 dark:bg-gray-800',
  text: 'text-gray-800 dark:text-gray-100',
  description: 'text-gray-700 dark:text-gray-300'
};

export const refundStatusStyles: Record<RefundStatusType, StatusStyle> = {
  ReturnReceived: {
    bg: 'bg-blue-100 dark:bg-blue-800',
    text: 'text-blue-800 dark:text-blue-100',
    description: 'text-blue-700 dark:text-blue-300'
  },
  ReturnProcessing: {
    bg: 'bg-blue-100 dark:bg-blue-800',
    text: 'text-blue-800 dark:text-blue-100',
    description: 'text-blue-700 dark:text-blue-300'
  },
  NeedMoreInformation: {
    bg: 'bg-yellow-100 dark:bg-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-100',
    description: 'text-yellow-700 dark:text-yellow-300'
  },
  RefundApproved: {
    bg: 'bg-blue-100 dark:bg-blue-800',
    text: 'text-blue-800 dark:text-blue-100',
    description: 'text-blue-700 dark:text-blue-300'
  },
  RefundSent: {
    bg: 'bg-green-100 dark:bg-green-800',
    text: 'text-green-800 dark:text-green-100',
    description: 'text-green-700 dark:text-green-300'
  },
  RefundAdjusted: {
    bg: 'bg-yellow-100 dark:bg-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-100',
    description: 'text-yellow-700 dark:text-yellow-300'
  },
  RefundDelayed: {
    bg: 'bg-red-100 dark:bg-red-800',
    text: 'text-red-800 dark:text-red-100',
    description: 'text-red-700 dark:text-red-300'
  },
  RefundDenied: {
    bg: 'bg-red-100 dark:bg-red-800',
    text: 'text-red-800 dark:text-red-100',
    description: 'text-red-700 dark:text-red-300'
  }
};
