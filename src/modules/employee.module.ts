import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';
import { Donation } from '../models/donation.model';
import { Salary } from '../models/salary.model';
import { Statement } from '../models/statement.model';
import { EmployeeService } from '../services/employee.service';
import { EmployeeController } from '../controllers/employee.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Department,
      Employee,
      Donation,
      Salary,
      Statement,
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
