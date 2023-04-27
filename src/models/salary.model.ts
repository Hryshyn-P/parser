import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Employee } from './employee.model';
import { Statement } from './statement.model';

@Table
export class Salary extends Model<Salary> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @HasMany(() => Statement)
  statements: Statement[];

  @ForeignKey(() => Employee)
  @Column
  employee_id: number;

  @BelongsTo(() => Employee, { foreignKey: 'employee_id' })
  employee: Employee;
}
