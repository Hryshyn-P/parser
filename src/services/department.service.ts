import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';
import { QueryTypes } from 'sequelize';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  /**
    Display departments in descending order of the difference
    between the maximum and minimum average annual salary.
    For each department, show up to 3 employees with the highest percentage
    increase in salary for the year and the size of their last salary.
  */
  async findDepartmentsWithSalaryDetails(): Promise<Department[]> {
    const departments: Department[] =
      await this.departmentModel.sequelize.query(
        `SELECT * FROM find_departments_with_salary_details()
  `,
        {
          type: QueryTypes.SELECT,
        },
      );
    return departments[0]['find_departments_with_salary_details'];
  }

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
