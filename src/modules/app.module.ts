import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppBootstrapService } from '../services/bootstrap/bootstrap.service';
import { DatabaseModule } from './db.module';
import { DepartmentsModule } from './departments.module';
import { TxtParserModule } from './txt.parser.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    DepartmentsModule,
    TxtParserModule,
  ],
  controllers: [],
  providers: [AppBootstrapService],
})
export class AppModule {}
