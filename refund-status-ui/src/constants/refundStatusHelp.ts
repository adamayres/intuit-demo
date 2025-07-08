import { AlertTriangle, Repeat, Clock, XCircle } from 'lucide-react';
import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';

interface RefundHelpConfig {
  icon: React.ElementType;
  color: string;
  blurb: string;
}

export const refundStatusHelp: Partial<Record<RefundStatusType, RefundHelpConfig>> = {
  NeedMoreInformation: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    blurb:
      'The IRS needs additional details about your return. Providing this information quickly can help avoid delays.'
  },
  RefundAdjusted: {
    icon: Repeat,
    color: 'text-yellow-600',
    blurb:
      'Your refund amount was adjusted based on IRS calculations. Review the details to understand the changes.'
  },
  RefundDelayed: {
    icon: Clock,
    color: 'text-red-600',
    blurb:
      'Your refund is taking longer than usual to process. This could be due to additional review or processing time.'
  },
  RefundDenied: {
    icon: XCircle,
    color: 'text-red-600',
    blurb:
      'Your refund has been denied by the IRS. Check your filing information or contact support for help.'
  }
};
