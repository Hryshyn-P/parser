import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Department } from '../../models/department.model';
import { Donation } from '../../models/donation.model';
import { Employee } from '../../models/employee.model';
import { Rate } from '../../models/rate.model';
import { Salary } from '../../models/salary.model';
import { Statement } from '../../models/statement.model';

@Injectable()
export class MapperService {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
    @InjectModel(Rate)
    private readonly rateModel: typeof Rate,
    @InjectModel(Employee)
    private readonly employeeModel: typeof Employee,
    @InjectModel(Donation)
    private readonly donationModel: typeof Donation,
    @InjectModel(Salary)
    private readonly salaryModel: typeof Salary,
    @InjectModel(Statement)
    private readonly statementModel: typeof Statement,
  ) {}

  async bulkUpsert(parsedData: {
    departments: Department[];
    rates: Rate[];
  }): Promise<{
    departments: Department[];
    rates: Rate[];
  }> {
    await this.departmentModel.bulkCreate(parsedData.departments, {
      updateOnDuplicate: ['name'],
    });

    for (const department of parsedData.departments) {
      if (department.employees) {
        const departmentInstance = await this.departmentModel.findOne({
          where: { id: department.id },
        });

        const employeeInstances = await this.employeeModel.bulkCreate(
          department.employees.map((employee) => ({
            ...employee,
            department_id: departmentInstance.id,
          })),
          {
            updateOnDuplicate: ['name', 'surname', 'department_id'],
            returning: true,
          },
        );

        // Map the created instances to the original data
        const createdEmployees = employeeInstances.map((instance) => {
          const originalEmployee = department.employees.find(
            (employee) =>
              employee.id === instance.id &&
              employee.name === instance.name &&
              employee.surname === instance.surname,
          );

          return {
            ...instance.toJSON(),
            donations: originalEmployee?.donations,
            salary: originalEmployee?.salary,
          };
        });

        for (const employee of createdEmployees) {
          if (employee.donations) {
            await this.donationModel.bulkCreate(
              employee.donations.map((donation) => ({
                ...donation,
                employee_id: employee.id,
              })),
              {
                updateOnDuplicate: ['date', 'amount', 'employee_id'],
              },
            );
          }

          if (employee?.salary) {
            const [salaryInstance] = await this.salaryModel.findOrCreate({
              where: { employee_id: employee.id },
              defaults: { employee_id: employee.id },
              returning: true,
            });

            if (employee?.salary?.statements) {
              await this.statementModel.bulkCreate(
                employee.salary.statements.map((statement) => ({
                  ...statement,
                  salary_id: salaryInstance.id,
                })),
                {
                  updateOnDuplicate: ['amount', 'date', 'salary_id'],
                  returning: true,
                },
              );
            }
          }
        }
      }
    }

    const rates = await this.rateModel.bulkCreate(parsedData.rates, {
      updateOnDuplicate: ['date', 'sign', 'value'],
    });

    const departments = await this.departmentModel.findAll({
      include: [
        {
          model: Employee,
          as: 'employees',
          include: [
            { model: Donation, as: 'donations' },
            {
              model: Salary,
              as: 'salary',
              include: [{ model: Statement, as: 'statements' }],
            },
          ],
        },
      ],
    });

    return { departments, rates };
  }
}
