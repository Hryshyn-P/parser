import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DepartmentController } from '../controllers/departments.controller';
import { Department } from '../models/department.model';
import { Rate } from '../models/rate.model';
import { DepartmentService } from '../services/department.service';
import { Employee } from '../models/employee.model';
import { Donation } from '../models/donation.model';
import { Salary } from '../models/salary.model';
import { Statement } from '../models/statement.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Department,
      Rate,
      Employee,
      Donation,
      Salary,
      Statement,
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentsModule {}
