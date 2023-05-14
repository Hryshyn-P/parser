import {
  BadRequestException,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { TxtParserService } from '../services/parser/txt.parser.service';
import { Department } from 'src/models/department.model';
import { Rate } from 'src/models/rate.model';
import { MapperService } from '../services/parser/mapper.service';
import { promises as fs } from 'fs';
import * as path from 'path';

@Controller()
export class TxtParserController {
  constructor(
    private readonly txtParserService: TxtParserService,
    private readonly mapperService: MapperService,
  ) {}

  @Post('parse')
  async parseFile(@Res() res: Response): Promise<void> {
    const result = await this.txtParserService.parseFile(
      './parsing-files/txt/export.txt',
    );
    res.json(result);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 1024 * 1024 * 5, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['text/plain', 'text/csv', 'application/json'];
        allowedTypes.includes(file.mimetype)
          ? cb(null, true)
          : cb(
              new BadRequestException('Only .txt .csv .json files are allowed'),
              false,
            );
      },
      storage: diskStorage({
        destination: (req, file, cb) => {
          let folder = '';
          if (file.mimetype === 'text/plain') {
            folder = 'txt';
          } else if (file.mimetype === 'text/csv') {
            folder = 'csv';
          } else if (file.mimetype === 'application/json') {
            folder = 'json';
          }
          cb(null, `./parsing-files/${folder}`);
        },
        filename: (req, file, cb) => {
          const timestamp = new Date().getTime();
          cb(null, `${timestamp}${path.extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    res.json({ message: 'File uploaded successfully' });
  }

  @Post('bulk-upsert')
  async bulkUpsert(): Promise<{
    departments: Department[];
    rates: Rate[];
  }> {
    const txtParserService = new TxtParserService();
    const parsedData = await txtParserService.parseFile(
      './parsing-files/txt/export.txt',
    );
    return this.mapperService.bulkUpsert(parsedData);
  }

  @Post('bulk-upsert-latest')
  async bulkUpsertLatest(): Promise<{
    departments: Department[];
    rates: Rate[];
  }> {
    const txtParserService = new TxtParserService();
    const directory = './parsing-files/txt';
    const files = await fs.readdir(directory);
    const latestFile = await txtParserService.findLatestFile(files);
    console.log('latestFile', latestFile);
    const filePath = path.join(directory, latestFile);
    const parsedData = await txtParserService.parseFile(filePath);
    return this.mapperService.bulkUpsert(parsedData);
  }
}
