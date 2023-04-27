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
import { extname } from 'path';
import { FileParserService } from '../services/parser/txt-parser.service';

@Controller()
export class FileParserController {
  constructor(private readonly fileParserService: FileParserService) {}

  @Post('parse')
  async parseFile(@Res() res: Response): Promise<void> {
    const result = await this.fileParserService.parseFile(
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
          cb(null, `${timestamp}${extname(file.originalname)}`);
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
}
