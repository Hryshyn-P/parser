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
    @InjectModel(Department)
    private departmentModel: typeof Department,
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

  async calculateRewardsAndFunds(): Promise<any[]> {
    const rewards = [];

    const employees = await this.employeeModel.findAll({
      include: [
        {
          model: Donation,
          as: 'donations',
        },
        {
          model: Salary,
          as: 'salary',
          include: [
            {
              model: Statement,
              as: 'statements',
            },
          ],
        },
        {
          model: Department,
          as: 'department',
        },
      ],
    });

    const totalDonations = employees
      .flatMap((employee) => employee.donations)
      .reduce((sum, donation) => sum + donation.amount, 0);

    const eligibleEmployees = employees.filter(
      (employee) => totalDonations >= 100 && employee.donations.length > 0,
    );

    const totalRewardsPool = 10000;

    for (const employee of eligibleEmployees) {
      const employeeDonations = employee.donations.reduce(
        (sum, donation) => sum + donation.amount,
        0,
      );
      const employeeRewardPercentage = employeeDonations / totalDonations;
      let employeeReward = totalRewardsPool * employeeRewardPercentage;

      if (employeeDonations >= 1000) {
        const percentageIncrease = 0.2;
        const additionalReward = totalRewardsPool * percentageIncrease;
        employeeReward += additionalReward;
      }

      rewards.push({
        employeeId: employee.id,
        employeeReward: `${Math.floor(employeeReward)} $`,
      });
    }

    const departments = await this.departmentModel.findAll({
      include: [
        {
          model: Employee,
          as: 'employees',
          include: [
            {
              model: Donation,
              as: 'donations',
            },
          ],
        },
      ],
    });

    const departmentWithHighestDonations = departments.reduce(
      (maxDepartment, department) => {
        const departmentDonations = department.employees
          .flatMap((employee) => employee.donations)
          .reduce((sum, donation) => sum + donation.amount, 0);
        const maxDepartmentDonations = maxDepartment.employees
          .flatMap((employee) => employee.donations)
          .reduce((sum, donation) => sum + donation.amount, 0);
        if (departmentDonations > maxDepartmentDonations) {
          return department;
        }
        return maxDepartment;
      },
      departments[0],
    );

    for (const employee of departmentWithHighestDonations.employees) {
      rewards.concat(
        rewards
          .filter((reward) => reward.employeeId === employee.id)
          .map((reward) => {
            reward.employeeReward = `${
              parseInt(reward.employeeReward) + 100
            } $`;
            return reward;
          }),
      );
    }

    return rewards;
  }
}
