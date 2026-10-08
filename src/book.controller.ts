// src/book.controller.ts
import { Controller, Get } from '@nestjs/common';
import { BookService } from './book.service';
import { Body, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { BookResponseDto } from './book-response.dto';
import { CreateBookDto } from './create-book.dto';


@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }
  @Post()
  @HttpCode(HttpStatus.CREATED) // 201 Created (Nest의 POST 기본값이지만 명시)
  async createBook(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return await this.bookService.createBook(dto);
  }
  @Get('category/:categoryId')
  async getBooksByCategory(@Param('categoryId') categoryId: string): Promise<any> {
    return await this.bookService.getBooksByCategory(categoryId);
  }

  

}