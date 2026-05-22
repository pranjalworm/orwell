import * as path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: diskStorage({
          destination: path.resolve(config.getOrThrow<string>('BOOKS_PATH')),
          filename: (_req, file, cb) => cb(null, file.originalname),
        }),
      }),
    }),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
