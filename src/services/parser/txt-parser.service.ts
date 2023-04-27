import { Injectable } from '@nestjs/common';
import { createReadStream, promises as fs } from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as readline from 'readline';
import { Department as DepartmentModel } from 'src/models/department.model';
import { Rate as RateModel } from 'src/models/rate.model';
import {
  Department,
  Donation,
  Employee,
  Rate,
  Salary,
  Statement,
} from '../../dto/parser.dto';

@Injectable()
export class FileParserService {
  private departments: Department[] = [];
  private employees: Employee[] = [];
  private rates: Rate[] = [];
  private currentEmployee: Employee;
  private currentDepartment: Department;
  private currentSalary: Salary;
  private currentStatement: Statement;
  private currentDonation: Donation;
  private currentRate: Rate;

  private collectEmployees(
    lineTrimmed: string,
    keyAndValue: any[],
    currentSection: string,
  ) {
    const PROP_REG_EXP = /^(\w+):\s*(.+)$/;

    if (keyAndValue) {
      const type = keyAndValue[1];

      switch (type) {
        case 'Employee':
          this.currentEmployee = new Employee();
          this.employees.push(this.currentEmployee);
          break;
        case 'Department':
          this.currentDepartment = new Department();
          this.currentEmployee.department = this.currentDepartment;
          break;
        case 'Salary':
          this.currentSalary = new Salary();
          this.currentEmployee.salary = this.currentSalary;
          break;
        case 'Statement':
          this.currentStatement = new Statement();
          this.currentSalary.statements.push(this.currentStatement);
          break;
        case 'Donation':
          this.currentDonation = new Donation();
          if (!this.currentEmployee.donations) {
            this.currentEmployee.donations = [];
          }
          this.currentEmployee.donations.push(this.currentDonation);
          break;
        case 'Rate':
          this.currentRate = new Rate();
          this.rates.push(this.currentRate);
          break;
        default:
          break;
      }
    } else {
      const propertyMatch = lineTrimmed.match(PROP_REG_EXP);
      if (propertyMatch && this.currentEmployee) {
        const property = propertyMatch[1];
        const value = propertyMatch[2];
        switch (property) {
          case 'id':
            switch (currentSection) {
              case 'Employee':
                this.currentEmployee.id = parseInt(value);
                break;
              case 'Department':
                this.currentDepartment.id = parseInt(value);
                break;
              case 'Donation':
                this.currentDonation.id = parseInt(value);
                break;
              case 'Statement':
                this.currentStatement.id = parseInt(value);
                break;
              default:
                break;
            }
            break;
          case 'name':
            switch (currentSection) {
              case 'Department':
                this.currentDepartment.name = value;
                break;
              case 'Employee':
                this.currentEmployee.name = value;
                break;
              default:
                break;
            }
            break;
          case 'surname':
            this.currentEmployee.surname = value;
            break;
          case 'sign':
            this.currentRate.sign = value;
            break;
          case 'value':
            this.currentRate.value = parseFloat(value);
            break;
          case 'amount':
            switch (currentSection) {
              case 'Donation':
                this.currentDonation.amount = parseFloat(value);
                break;
              case 'Statement':
                this.currentStatement.amount = parseFloat(value);
                break;
              default:
                break;
            }
            break;
          case 'date':
            switch (currentSection) {
              case 'Statement':
                this.currentStatement.date = new Date(value);
                break;
              case 'Donation':
                this.currentDonation.date = new Date(value);
                break;
              case 'Rate':
                this.currentRate.date = new Date(value);
                break;
              default:
                break;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  private groupByDepartment() {
    const employeesByDepartment = _.groupBy(this.employees, (employee) => {
      if (employee.department && employee.department.id) {
        this.departments.push(employee.department);
        return employee.department.id;
      }
      return null;
    });
    this.departments = _.uniqBy(this.departments, 'id');
    this.departments = this.departments.map((department) => {
      department.employees = employeesByDepartment[department.id].map(
        (employee) => {
          delete employee.department;
          return employee;
        },
      );
      return department;
    });
  }

  async parseFile(
    filePath: string,
  ): Promise<{ departments: DepartmentModel[]; rates: RateModel[] }> {
    try {
      if (!fs.access(filePath)) {
        throw new Error(`File ${filePath} does not exist`);
      }
      const LINE_REG_EXP = /^(\w+)\s*$/;
      const SECTION_REG_EXP = /^\s*[A-Z][a-z]*(\s+[A-Z][a-z]*)*$/;
      const absoluteFilePath = path.resolve(filePath);
      let currentSection: string;

      const stream = createReadStream(absoluteFilePath);
      const rl = readline.createInterface({
        input: stream,
        output: process.stdout,
        terminal: false,
        crlfDelay: Infinity,
      });

      rl.on('line', (line: string) => {
        const lineTrimmed = line.trim();
        const keyAndValue = lineTrimmed.match(LINE_REG_EXP);

        this.collectEmployees(lineTrimmed, keyAndValue, currentSection);

        if (line.match(SECTION_REG_EXP)) {
          currentSection = line.match(SECTION_REG_EXP)[0].trim();
        }
      });

      await new Promise((resolve) => {
        rl.on('close', resolve);
      });
      stream.close();
      this.groupByDepartment();

      return {
        departments: this.departments as unknown as DepartmentModel[],
        rates: this.rates as unknown as RateModel[],
      };
    } catch (error) {
      console.error(`Error while parsing file: ${error.message}`);
      throw error;
    }
  }
}
