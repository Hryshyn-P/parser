import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
  HasOne,
} from 'sequelize-typescript';
import { Department } from './department.model';
import { Donation } from './donation.model';
import { Salary } from './salary.model';

@Table
export class Employee extends Model<Employee> {
  @Column({ primaryKey: true })
  id: number;

  @Column
  name: string;

  @Column
  surname: string;

  @HasMany(() => Donation)
  donations: Donation[];

  @HasOne(() => Salary)
  salary: Salary;

  @ForeignKey(() => Department)
  @Column
  department_id: number;

  @BelongsTo(() => Department, { foreignKey: 'department_id' })
  department: Department;
}
