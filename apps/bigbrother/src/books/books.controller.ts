import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller()
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('books')
  listBooks() {
    return this.booksService.listBooks();
  }

  @Post('book')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadBook(
    @Body() dto: CreateBookDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string }> {
    await this.booksService.ingestBook(dto, file);
    return { message: 'Book uploaded successfully!' };
  }
}
