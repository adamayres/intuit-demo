import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './db';

export interface PredictionAttributes {
  prediction_id: number;
  return_id: number;
  predicted_delay_days: number;
  reasons: object;
  percentile: number;
  model_version: string;
  prediction_timestamp: Date;
}

export interface PredictionCreationAttributes
  extends Optional<PredictionAttributes, 'prediction_id'> {}

export class Prediction
  extends Model<PredictionAttributes, PredictionCreationAttributes>
  implements PredictionAttributes
{
  public prediction_id!: number;
  public return_id!: number;
  public predicted_delay_days!: number;
  public reasons!: object;
  public percentile!: number;
  public model_version!: string;
  public prediction_timestamp!: Date;
}

Prediction.init(
  {
    prediction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    return_id: DataTypes.INTEGER,
    predicted_delay_days: DataTypes.FLOAT,
    reasons: DataTypes.JSONB,
    percentile: DataTypes.FLOAT,
    model_version: DataTypes.STRING,
    prediction_timestamp: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'prediction',
    timestamps: false
  }
);
