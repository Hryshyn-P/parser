import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '../models/department.model';
import { Donation } from '../models/donation.model';
import { Employee } from '../models/employee.model';
import { Salary } from '../models/salary.model';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee)
    private employeeModel: typeof Employee,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.findAll({
      include: [Department, Donation, Salary],
    });
  }

  async findById(id: number): Promise<Employee> {
    return this.employeeModel.findByPk(id, {
      include: [Department, Donation, Salary],
    });
  }

  async create(employee: Employee): Promise<Employee> {
    return this.employeeModel.create(employee, {
      include: [Department, Donation, Salary],
    });
  }

  async update(id: number, employee: Employee): Promise<[number, Employee[]]> {
    return this.employeeModel.update(employee, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<number> {
    const result = await this.employeeModel.destroy({ where: { id } });
    return result;
  }
}
