import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Department } from '../models/department.model';
import { Rate } from '../models/rate.model';
import { DepartmentService } from '../services/department.service';
import { FileParserService } from '../services/parser/txt-parser.service';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async findAll(): Promise<Department[]> {
    return this.departmentService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Department> {
    return this.departmentService.findById(id);
  }

  @Post()
  async create(@Body() department: Department): Promise<Department> {
    return this.departmentService.create(department);
  }

  @Post('bulk-upsert')
  async bulkUpsert(): Promise<{
    departments: Department[];
    rates: Rate[];
  }> {
    const fileParserService = new FileParserService();
    const parsedData = await fileParserService.parseFile(
      './parsing-files/txt/export.txt',
    );
    return this.departmentService.bulkUpsert(parsedData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() department: Department,
  ): Promise<[number, Department[]]> {
    return this.departmentService.update(id, department);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.departmentService.delete(id);
  }
}
