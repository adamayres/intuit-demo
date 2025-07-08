'use client';

import { Progress } from '@/components/ui/progress';
import {
  Upload,
  Loader,
  AlertTriangle,
  CheckCircle,
  Send,
  Repeat,
  Clock,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import type { RefundStatusType } from '@/types/RefundStatusTypes.ts';

export type RefundProgressStage =
  | 'Submitted'
  | 'Processing'
  | 'Accepted'
  | 'PreparingRefund'
  | 'RefundSent';

const refundStatusProgressMap: Record<RefundStatusType, RefundProgressStage> = {
  ReturnReceived: 'Submitted',
  ReturnProcessing: 'PreparingRefund',
  NeedMoreInformation: 'Processing',
  RefundAdjusted: 'PreparingRefund',
  RefundApproved: 'Accepted',
  RefundSent: 'RefundSent',
  RefundDelayed: 'Processing',
  RefundDenied: 'Processing'
};

const progressStepMap: Record<RefundProgressStage, number> = {
  Submitted: 1,
  Processing: 2,
  Accepted: 3,
  PreparingRefund: 4,
  RefundSent: 5
};

const progressPercentMap: Record<RefundProgressStage, number> = {
  Submitted: 0,
  Processing: 25,
  Accepted: 50,
  PreparingRefund: 75,
  RefundSent: 100
};

export type RefundStatusColor = 'green' | 'yellow' | 'red' | 'blue';

const refundStatusColors: Record<RefundStatusType, RefundStatusColor> = {
  ReturnReceived: 'blue',
  ReturnProcessing: 'blue',
  NeedMoreInformation: 'yellow',
  RefundApproved: 'blue',
  RefundSent: 'green',
  RefundAdjusted: 'yellow',
  RefundDelayed: 'red',
  RefundDenied: 'red'
};

const refundStatusIcons: Record<RefundStatusType, React.ElementType> = {
  ReturnReceived: Upload,
  ReturnProcessing: Loader,
  NeedMoreInformation: AlertTriangle,
  RefundApproved: CheckCircle,
  RefundSent: Send,
  RefundAdjusted: Repeat,
  RefundDelayed: Clock,
  RefundDenied: XCircle
};

const stageToText: Partial<Record<RefundProgressStage, string>> = {
  Submitted: 'Submitted',
  Accepted: 'Accepted',
  RefundSent: 'IRS Refund'
};

interface RefundProgressProps {
  className?: string;
  refundStatus: RefundStatusType;
}

export function RefundProgress({ className, refundStatus }: RefundProgressProps) {
  const currentStage = refundStatusProgressMap[refundStatus];
  const currentStep = progressStepMap[currentStage];
  const percent = progressPercentMap[currentStage];

  const progressStages: RefundProgressStage[] = [
    'Submitted',
    'Processing',
    'Accepted',
    'PreparingRefund',
    'RefundSent'
  ];

  const IconComponent = refundStatusIcons[refundStatus];
  const currentColor = refundStatusColors[refundStatus];

  return (
    <div className={cn('grid', className)}>
      <div className="col-start-1 row-start-1 flex justify-between z-10 text-gray-800 dark:text-gray-200 text-xs">
        {progressStages.map(stage => {
          const stageStep = progressStepMap[stage];

          const isCurrent = stageStep === currentStep;
          const isCompleted = stageStep < currentStep;

          const isMajorStep = [1, 3, 5].includes(stageStep);
          const shouldRender = isMajorStep || isCurrent;

          if (!shouldRender) {
            return <span key={stage} className="w-12"></span>;
          }

          let stepBg;
          let stepText;

          if (isCurrent) {
            if (
              (stageStep === 2 || stageStep === 4) &&
              (currentColor === 'red' || currentColor === 'yellow')
            ) {
              // active problem step
              stepBg = currentColor === 'red' ? 'bg-red-500' : 'bg-yellow-500';
              stepText = 'text-white';
            } else {
              // normal active step
              stepBg = 'bg-primary';
              stepText = 'text-white';
            }
          } else if (isCompleted) {
            stepBg = 'bg-primary';
            stepText = 'text-white';
          } else {
            stepBg = 'bg-gray-200 dark:bg-gray-600';
            stepText = 'text-gray-500';
          }

          return (
            <span key={stage} className="flex flex-col items-center w-20 gap-1 text-center">
              <span
                className={cn(
                  'h-5 w-5 rounded-full border border-white dark:border-black flex items-center justify-center',
                  stepBg,
                  stepText
                )}
              >
                {isCurrent ? (
                  <IconComponent className="h-3 w-3" />
                ) : isCompleted ? (
                  <CheckCircle className="h-3 w-3 text-white" />
                ) : null}
              </span>
              {isMajorStep && <span>{stageToText[stage]}</span>}
            </span>
          );
        })}
      </div>

      <Progress
        value={percent}
        className="col-start-1 row-start-1 mt-2 h-1 mx-10 w-[calc(100%-theme(space.20))]"
      />
    </div>
  );
}
