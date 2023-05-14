import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Employee } from '../models/employee.model';
import { Donation } from '../models/donation.model';
import { Department } from '../models/department.model';
import { Salary } from '../models/salary.model';
import { Statement } from '../models/statement.model';
import { Op } from 'sequelize';

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

  async findEmployeesWithDonations(): Promise<Employee[]> {
    const today = new Date();
    const sixMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 6,
      today.getDate(),
    );
    const employees = await this.employeeModel.findAll({
      include: [
        {
          model: Donation,
          as: 'donations',
          where: {
            date: { [Op.gte]: sixMonthsAgo },
          },
        },
        {
          model: Salary,
          as: 'salary',
          include: [
            {
              model: Statement,
              as: 'statements',
              where: {
                date: { [Op.gte]: sixMonthsAgo },
              },
            },
          ],
        },
      ],
    });

    const filteredEmployees = employees.filter((employee) => {
      const totalDonationAmount = employee.donations.reduce(
        (sum, donation) => sum + donation.amount,
        0,
      );

      if (!employee.salary || !employee.salary.statements) {
        return false;
      }

      const averageSalary =
        employee.salary.statements.reduce(
          (sum, statement) => sum + statement.amount,
          0,
        ) / employee.salary.statements.length;

      const tenPercentOfSalary = 0.1 * averageSalary;
      return totalDonationAmount > tenPercentOfSalary;
    });

    filteredEmployees.sort((a, b) => {
      if (!a.salary || !a.salary.statements) {
        return 1;
      }

      if (!b.salary || !b.salary.statements) {
        return -1;
      }

      const averageSalaryA =
        a.salary.statements.reduce(
          (sum, statement) => sum + statement.amount,
          0,
        ) / a.salary.statements.length;

      const averageSalaryB =
        b.salary.statements.reduce(
          (sum, statement) => sum + statement.amount,
          0,
        ) / b.salary.statements.length;

      return averageSalaryA - averageSalaryB;
    });

    return filteredEmployees;
  }
}
