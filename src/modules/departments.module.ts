import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DepartmentController } from '../controllers/departments.controller';
import { Department } from '../models/department.model';
import { DepartmentService } from '../services/department.service';

@Module({
  imports: [SequelizeModule.forFeature([Department])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentsModule {}
