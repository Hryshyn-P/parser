import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  async findAll(): Promise<Department[]> {
    return this.departmentModel.findAll({
      include: [Employee],
    });
  }

  async findById(id: number): Promise<Department> {
    return this.departmentModel.findByPk(id, {
      include: [Employee],
    });
  }

  async create(department: Department): Promise<Department> {
    return this.departmentModel.create(department);
  }

  async update(
    id: number,
    department: Department,
  ): Promise<[number, Department[]]> {
    return this.departmentModel.update(department, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<void> {
    await this.departmentModel.destroy({
      where: { id },
    });
  }
}
