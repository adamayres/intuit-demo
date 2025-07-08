import { refundStatusHelp } from '@/constants/refundStatusHelp';
import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';
import { cn } from '@/lib/utils.ts';

interface RefundStatusHelpProps {
  refundStatus: RefundStatusType;
  className?: string;
}

export function RefundStatusHelp({ refundStatus, className }: RefundStatusHelpProps) {
  const helpData = refundStatusHelp[refundStatus];

  if (!helpData) {
    return null;
  }

  const Icon = helpData.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 border rounded bg-gray-50 dark:bg-gray-800',
        className
      )}
    >
      <div className={cn('flex-shrink-0', helpData.color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-200">
        <p className="mb-1">{helpData.blurb}</p>
        <a href="#" className={cn('text-sm font-medium underline')}>
          Learn More
        </a>
      </div>
    </div>
  );
}
