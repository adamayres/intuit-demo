import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './db';

export interface RefundStatusAttributes {
  refund_status_id: number;
  return_id: number;
  status: string;
  refund_delay_days: number;
  last_checked_at: Date;
}

export interface RefundStatusCreationAttributes
  extends Optional<RefundStatusAttributes, 'refund_status_id'> {}

export class RefundStatus
  extends Model<RefundStatusAttributes, RefundStatusCreationAttributes>
  implements RefundStatusAttributes
{
  public refund_status_id!: number;
  public return_id!: number;
  public status!: string;
  public refund_delay_days!: number;
  public last_checked_at!: Date;
}

RefundStatus.init(
  {
    refund_status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    return_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    refund_delay_days: DataTypes.FLOAT,
    last_checked_at: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'refund_status',
    timestamps: false
  }
);
