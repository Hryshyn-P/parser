import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '../models/department.model';
import { Employee } from '../models/employee.model';
import { Salary } from '../models/salary.model';
import { Statement } from '../models/statement.model';

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

  async findDepartmentsWithSalaryDetails(): Promise<Department[]> {
    const departments = await this.departmentModel.findAll({
      include: [
        {
          model: Employee,
          as: 'employees',
          include: [
            {
              model: Salary,
              as: 'salary',
              include: [
                {
                  model: Statement,
                  as: 'statements',
                  order: [['date', 'DESC']],
                  limit: 1,
                },
              ],
            },
          ],
        },
      ],
    });

    departments.forEach((department) => {
      department.employees.sort((a, b) => {
        const percentIncreaseA =
          (a.salary.statements[0]?.amount - a.salary.statements[0]?.amount) /
          a.salary.statements[0]?.amount;
        const percentIncreaseB =
          (b.salary.statements[0]?.amount - b.salary.statements[0]?.amount) /
          b.salary.statements[0]?.amount;
        return percentIncreaseB - percentIncreaseA;
      });

      department.employees = department.employees.slice(0, 3);
    });

    departments.sort((a, b) => {
      const maxSalaryA = Math.max(
        ...a.employees.map((employee) => employee.salary.statements[0]?.amount),
      );
      const minSalaryA = Math.min(
        ...a.employees.map((employee) => employee.salary.statements[0]?.amount),
      );
      const maxSalaryB = Math.max(
        ...b.employees.map((employee) => employee.salary.statements[0]?.amount),
      );
      const minSalaryB = Math.min(
        ...b.employees.map((employee) => employee.salary.statements[0]?.amount),
      );

      const diffA = maxSalaryA - minSalaryA;
      const diffB = maxSalaryB - minSalaryB;

      return diffB - diffA;
    });

    return departments;
  }
}
