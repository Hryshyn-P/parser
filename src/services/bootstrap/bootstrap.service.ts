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
import { Sequelize } from 'sequelize-typescript';
import { Umzug, SequelizeStorage } from 'umzug';

@Injectable()
export class AppBootstrapService implements OnModuleInit {
  constructor(private readonly sequelize: Sequelize) {}
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
    await this.runMigrations();
    await this.txtParserController.bulkUpsert();

    console.log(
      ' - Migrations executed successfully \n',
      '- Data upserted successfully from ./parsing-files/txt/export.txt',
    );
  }

  async runMigrations() {
    const queryInterface = this.sequelize.getQueryInterface();
    const umzug = new Umzug({
      migrations: {
        glob: './migrations/*.js',
      },
      context: queryInterface,
      storage: new SequelizeStorage({ sequelize: this.sequelize }),
      logger: console,
    });

    await umzug.up();
  }
}
