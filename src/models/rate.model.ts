import { DataTypes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Rate extends Model<Rate> {
  @Column
  date: Date;

  @Column
  sign: string;

  @Column(DataTypes.FLOAT)
  value: number;
}
