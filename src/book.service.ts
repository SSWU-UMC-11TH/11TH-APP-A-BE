// src/book.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Category } from './category.entity';
import { BookResponseDto } from './book-response.dto';
import { CreateBookDto } from './create-book.dto';

@Injectable()
export class BookService {
  constructor(
    // TypeORM이 만들어 준 Book, Category 전용 Repository를 주입받습니다.
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

    async getAllBooks(): Promise<BookResponseDto[]> {
        // category 관계를 함께 불러오고, 최신 등록순(bookId 내림차순)으로 정렬
        const books = await this.bookRepository.find({
            relations: { category: true },
            order: { bookId: 'DESC' },
        });
        return books.map((book) => BookResponseDto.from(book));
    }
    async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
        // 1. 존재하는 카테고리인지 먼저 확인. 없으면 저장하지 않고 404 응답
        const category = await this.categoryRepository.findOneBy({
            categoryId: dto.categoryId,
        });
        if (!category) {
            throw new NotFoundException('존재하지 않는 카테고리입니다.');
        }

        // 2. 엔티티를 만들어 저장 (INSERT SQL은 TypeORM이 생성)
        const book = this.bookRepository.create({
            category,
            title: dto.title,
            description: dto.description ?? null,
        });
        const saved = await this.bookRepository.save(book);

        // 3. 저장된 엔티티를 응답 DTO로 변환
        return BookResponseDto.from(saved);
    }
    async getBooksByCategory(categoryId: number): Promise<BookResponseDto[]> {
        // 관계를 따라 category.categoryId로 필터링 → WHERE category_id = ? 가 생성됨
        const books = await this.bookRepository.find({
            where: { category: { categoryId } },
            relations: { category: true },
            order: { bookId: 'DESC' },
        });
        return books.map((book) => BookResponseDto.from(book));
    }
}
