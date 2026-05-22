import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async listBooks(): Promise<{ books: string[] }> {
    const booksDirPath = path.resolve(
      this.config.getOrThrow<string>('BOOKS_PATH'),
    );
    const files = await fs.readdir(booksDirPath);
    return { books: files };
  }

  async ingestBook(
    dto: CreateBookDto,
    file: Express.Multer.File,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const book = await tx.book.create({
          data: {
            title: dto.title.toLowerCase(),
            author: dto.author?.toLowerCase() ?? null,
            yearPublished: dto.yearPublished ?? null,
            coverImageUrl: dto.coverImageUrl ?? null,
          },
        });

        const createdFile = await tx.file.create({
          data: {
            name: file.filename,
            fileType: file.filename.split('.').at(-1) ?? '',
            filePath: file.path,
          },
        });

        await tx.bookFile.create({
          data: { bookId: book.id, fileId: createdFile.id },
        });
      });
    } catch (err) {
      this.logger.error('Book ingestion failed', (err as Error).stack);
      throw new InternalServerErrorException('Book upload failed');
    }
  }
}
