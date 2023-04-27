import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Salary } from './salary.model';

@Table
export class Statement extends Model<Statement> {
  @Column({ primaryKey: true })
  id: number;

  @Column(DataTypes.FLOAT)
  amount: number;

  @Column
  date: Date;

  @ForeignKey(() => Salary)
  @Column
  salary_id: number;

  @BelongsTo(() => Salary, { foreignKey: 'salary_id' })
  salary: Salary;
}
