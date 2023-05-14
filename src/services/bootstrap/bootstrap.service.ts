import { Injectable, OnModuleInit } from '@nestjs/common';
import { TxtParserController } from '../../controllers/txt.parser.controller';
import { TxtParserService } from '../parser/txt.parser.service';
import { MapperService } from '../parser/mapper.service';
import { Department } from '../../models/department.model';
import { Donation } from '../../models/donation.model';
import { Employee } from '../../models/employee.model';
import { Rate } from '../../models/rate.model';
import { Salary } from '../../models/salary.model';
import { Statement } from '../../models/statement.model';

@Injectable()
export class AppBootstrapService implements OnModuleInit {
  txtParserService = new TxtParserService();
  mapperService = new MapperService(
    Department,
    Rate,
    Employee,
    Donation,
    Salary,
    Statement,
  );
  txtParserController = new TxtParserController(
    this.txtParserService,
    this.mapperService,
  );

  async onModuleInit() {
    await this.txtParserController.bulkUpsert();
    console.log(
      'Data upserted successfully from ./parsing-files/txt/export.txt',
    );
  }
}
