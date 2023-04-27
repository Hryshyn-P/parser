import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Employee } from './employee.model';

@Table
export class Department extends Model<Department> {
  @Column({ primaryKey: true })
  id: number;

  @Column
  name: string;

  @HasMany(() => Employee)
  employees: Employee[];
}
