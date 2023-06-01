import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from '../models/department.model';
import { Donation } from '../models/donation.model';
import { Employee } from '../models/employee.model';
import { Rate } from '../models/rate.model';
import { Salary } from '../models/salary.model';
import { Statement } from '../models/statement.model';
import { AppBootstrapService } from '../services/bootstrap/bootstrap.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Department, Donation, Employee, Rate, Salary, Statement],
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  providers: [AppBootstrapService],
})
export class DatabaseModule {}
