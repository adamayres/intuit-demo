import { Response, Router } from 'express';
import { RefundStatus } from '../models/RefundStatus';
import { Prediction } from '../models/Prediction';
import axios from 'axios';
import dayjs from 'dayjs';
import { TaxReturn } from '../models/TaxReturn';
import { AuthRequest } from '../middleware/fakeAuth';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.userId;

  try {
    const taxReturn = await TaxReturn.findOne({
      where: { user_id: userId }
    });

    if (!taxReturn) {
      res.status(404).json({
        error: 'No tax return found for this user.'
      });
      return;
    }

    const returnId = taxReturn.getDataValue('return_id');

    const currentDate = new Date();

    let refundStatus = await RefundStatus.findOne({
      where: { return_id: returnId }
    });

    const now = dayjs();
    let needsIRSRefresh = false;

    if (!refundStatus) {
      needsIRSRefresh = true;
    } else {
      const lastChecked = dayjs(refundStatus.last_checked_at);
      if (now.diff(lastChecked, 'minute') >= 30) {
        needsIRSRefresh = true;
      }
    }

    if (needsIRSRefresh) {
      console.log('Calling fake IRS service...');

      const possibleStatuses = [
        'ReturnReceived',
        'ReturnProcessing',
        'NeedMoreInformation',
        'RefundApproved',
        'RefundSent',
        'RefundAdjusted',
        'RefundDelayed',
        'RefundDenied'
      ] as const;

      const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];

      const fakeIRSResponse = {
        status: randomStatus,
        refund_delay_days: Math.floor(Math.random() * 20)
      };

      refundStatus = await RefundStatus.upsert({
        return_id: returnId,
        status: fakeIRSResponse.status,
        refund_delay_days: fakeIRSResponse.refund_delay_days,
        last_checked_at: currentDate
      }).then(([instance]) => instance);
    }

    let prediction = await Prediction.findOne({
      where: { return_id: returnId },
      order: [['prediction_timestamp', 'DESC']]
    });

    let needsPredictionRefresh = false;

    if (!prediction) {
      needsPredictionRefresh = true;
    } else {
      const predTime = dayjs(prediction.prediction_timestamp);
      if (now.diff(predTime, 'hour') >= 24) {
        needsPredictionRefresh = true;
      }
    }

    if (needsPredictionRefresh) {
      console.log('Calling prediction-service...');

      const response = await axios.post('http://localhost:8000/predict', {
        return_id: returnId,
        filing_method: 'efile_direct_deposit',
        filing_time_category: 'early',
        bank_deposit_type: 'traditional_bank',
        geo_region: 'west',
        prior_credits_claimed: 'few',
        has_return_errors: false,
        requires_id_verification: false,
        is_selected_for_manual_review: false,
        claimed_eitc: true,
        claimed_actc: false,
        is_amended_return: false,
        has_injured_spouse_claim: false,
        has_offset_debts: false,
        prior_refund_delayed: false,
        prior_id_verification_flagged: false,
        has_bank_info_on_file: true,
        num_days_since_filed: 12,
        return_completeness_score: 0.95,
        prior_refund_processing_time: 10
      });

      prediction = await Prediction.create({
        return_id: returnId,
        predicted_delay_days: response.data.predicted_delay_days,
        reasons: response.data.top_reasons,
        percentile: response.data.percentile,
        model_version: 'v1.3.0',
        prediction_timestamp: currentDate
      });
    }

    res.json({
      refundStatus: refundStatus
        ? {
            filedAt: taxReturn?.filed_at || null,
            status: refundStatus.status,
            refundDelayDays: refundStatus.refund_delay_days,
            lastCheckedAt: refundStatus.last_checked_at
          }
        : null,
      prediction: prediction
        ? {
            predictedDelayDays: prediction.predicted_delay_days,
            topReasons: prediction.reasons,
            percentile: prediction.percentile,
            modelVersion: prediction.model_version,
            predictionTimestamp: prediction.prediction_timestamp
          }
        : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;
