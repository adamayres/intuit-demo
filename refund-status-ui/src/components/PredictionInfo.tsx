import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { RefundPrediction } from '../types/RefundPredictionTypes';
import { featureDescriptions } from '../constants/featureDescriptions';
import { featureIcons } from '../constants/featureIcons';
import { featureHelpTexts } from '../constants/featureHelpTexts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type PredictionInfoProps = {
  prediction: RefundPrediction;
};

export const PredictionInfo: React.FC<PredictionInfoProps> = ({ prediction }) => {
  const { predictedDelayDays, topReasons } = prediction;

  const delayDays = Math.round(predictedDelayDays);
  const fasterReasons = topReasons.filter(reason => reason.impact < 0);
  const slowerReasons = topReasons.filter(reason => reason.impact > 0);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-4 w-4 stroke-green-600" />
        <h3>Estimated Refund Timing</h3>
      </div>

      <p className="pb-2">
        Based on your filing details, your refund might take around{' '}
        <strong>{delayDays} days</strong>.
      </p>

      <hr />

      {fasterReasons.length > 0 && (
        <div>
          <p className="mt-2 font-semibold text-lg pt-2">
            These factors may help speed up your refund:
          </p>

          <ul className="mt-1 ml-6 space-y-1">
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
          <p className="mt-2 font-semibold text-lg">A few factors may slightly slow things down:</p>
          <ul className="mt-1 ml-6 space-y-1">
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
                    <TooltipContent className="max-w-xs">
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
