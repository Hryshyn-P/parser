import { Controller, Get } from '@nestjs/common';
import { Employee } from '../models/employee.model';
import { EmployeeService } from '../services/employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get('donations')
  async findEmployeesWithDonations(): Promise<Employee[]> {
    return this.employeeService.findEmployeesWithDonations();
  }
}
