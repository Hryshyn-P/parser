import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Employee } from './employee.model';

@Table
export class Donation extends Model<Donation> {
  @Column({ primaryKey: true })
  id: number;

  @Column
  date: Date;

  @Column(DataTypes.FLOAT)
  amount: number;

  @ForeignKey(() => Employee)
  @Column
  employee_id: number;

  @BelongsTo(() => Employee, { foreignKey: 'employee_id' })
  employee: Employee;
}
