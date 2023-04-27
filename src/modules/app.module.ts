import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileParserController } from '../controllers/parser.controller';
import { AppBootstrapService } from '../services/bootstrap/bootstrap.service';
import { FileParserService } from '../services/parser/txt-parser.service';
import { DatabaseModule } from './db.module';
import { DepartmentsModule } from './departments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    DepartmentsModule,
  ],
  controllers: [FileParserController],
  providers: [FileParserService, AppBootstrapService],
})
export class AppModule {}
