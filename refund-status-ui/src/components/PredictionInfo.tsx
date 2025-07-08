import React from 'react';
import { AlertTriangle, CalendarCheck, CheckCircle, Info } from 'lucide-react';
import type { RefundPrediction } from '../types/RefundPredictionTypes';
import { featureDescriptions } from '../constants/featureDescriptions';
import { featureIcons } from '../constants/featureIcons';
import { featureHelpTexts } from '../constants/featureHelpTexts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { RefundStatus } from '@/types/RefundStatusTypes.ts';

type PredictionInfoProps = {
  refundStatus: RefundStatus;
  prediction: RefundPrediction;
};

export const PredictionInfo: React.FC<PredictionInfoProps> = ({ refundStatus, prediction }) => {
  const { predictedDelayDays, topReasons } = prediction;

  const filedAt = new Date(refundStatus.filedAt);
  const today = new Date();

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysSinceFiled = Math.floor((today.getTime() - filedAt.getTime()) / millisecondsPerDay);
  const daysRemaining = Math.max(0, Math.round(predictedDelayDays - daysSinceFiled));

  const fasterReasons = topReasons.filter(reason => reason.impact < 0);
  const slowerReasons = topReasons.filter(reason => reason.impact > 0);

  let delayText = '';
  if (daysRemaining > 1) {
    delayText = `${daysRemaining} days`;
  } else if (daysRemaining === 1) {
    delayText = '1 day';
  } else {
    delayText = 'less than a day';
  }

  return (
    <TooltipProvider>
      <p className="my-4 px-4 py-3 rounded-sm bg-gray-100 dark:bg-gray-800 text-sm flex items-center gap-2">
        <CalendarCheck className="h-5 w-5" />
        <span>
          Estimated refund time: <strong>{delayText}</strong>.
        </span>
      </p>

      {fasterReasons.length > 0 && (
        <div>
          <p className="mb-2 font-semibold">These factors may help speed up your refund:</p>

          <ul className="ml-2 md:ml-6 space-y-1">
            {fasterReasons.map((reason, index) => (
              <li key={index} className="flex items-center gap-2">
                {featureIcons[reason.feature] ?? (
                  <CheckCircle className="h-4 w-4 stroke-green-600" />
                )}
                <span>{featureDescriptions[reason.feature] ?? reason.feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {slowerReasons.length > 0 && (
        <div>
          <p className="my-2 font-semibold">A few factors may slightly slow things down:</p>
          <ul className="ml-2 md:ml-6 space-y-1">
            {slowerReasons.map((reason, index) => (
              <li key={index} className="flex items-center gap-2">
                {featureIcons[reason.feature] ?? (
                  <AlertTriangle className="h-4 w-4 stroke-yellow-600" />
                )}
                <span>{featureDescriptions[reason.feature] ?? reason.feature}</span>
                {featureHelpTexts[reason.feature] && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs whitespace-normal text-wrap break-words text-sm leading-relaxed">
                      {featureHelpTexts[reason.feature]}
                    </TooltipContent>
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </TooltipProvider>
  );
};
