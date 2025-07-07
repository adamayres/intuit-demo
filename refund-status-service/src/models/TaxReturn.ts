import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './db';

export interface TaxReturnAttributes {
  return_id: number;
  user_id: number;
  filed_at: Date;
}

export interface TaxReturnCreationAttributes extends Optional<TaxReturnAttributes, 'return_id'> {}

export class TaxReturn
  extends Model<TaxReturnAttributes, TaxReturnCreationAttributes>
  implements TaxReturnAttributes
{
  public return_id!: number;
  public user_id!: number;
  public filed_at!: Date;
}

TaxReturn.init(
  {
    return_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    filed_at: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'tax_return',
    timestamps: false
  }
);
