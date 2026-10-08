// src/book.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookRepository } from './book.repository';
import { Book } from './book.entity';
import { BookResponseDto } from './book-response.dto';

@Injectable()
export class BookService {
  constructor(
    // 창고지기(BookRepository)를 주입받습니다. (3주차 Raw SQL 버전)
    private readonly bookRepository: BookRepository,
    // TypeORM이 만들어 준 Book 전용 Repository (4주차 ORM 버전)
    @InjectRepository(Book)
    private readonly bookOrmRepository: Repository<Book>,
  ) {}

    async getAllBooks(): Promise<BookResponseDto[]> {
        // category 관계를 함께 불러오고, 최신 등록순(bookId 내림차순)으로 정렬
        const books = await this.bookOrmRepository.find({
            relations: { category: true },
            order: { bookId: 'DESC' },
        });
        return books.map((book) => BookResponseDto.from(book));
    }
    async createBook(body: Record<string, any>): Promise<string> {
        await this.bookRepository.create(body);
        return '도서 등록이 완료되었습니다!';
    }
    async getBooksByCategory(categoryId: string): Promise<any> {
        return await this.bookRepository.findByCategory(categoryId);
    }
}