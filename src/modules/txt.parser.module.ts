import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from '../models/department.model';
import { Rate } from '../models/rate.model';
import { Employee } from '../models/employee.model';
import { Donation } from '../models/donation.model';
import { Salary } from '../models/salary.model';
import { Statement } from '../models/statement.model';
import { TxtParserController } from '../controllers/txt.parser.controller';
import { TxtParserService } from '../services/parser/txt.parser.service';
import { MapperService } from '../services/parser/mapper.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Department,
      Rate,
      Employee,
      Donation,
      Salary,
      Statement,
    ]),
  ],
  controllers: [TxtParserController],
  providers: [TxtParserService, MapperService],
})
export class TxtParserModule {}
