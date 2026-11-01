// src/book-response.dto.ts
import { Book } from './book.entity';

// 클라이언트에게 돌려줄 응답의 모양. Entity를 그대로 내보내지 않고 필요한 값만 골라 담습니다.
export class BookResponseDto {
  bookId: number;
  title: string;
  description: string | null;
  categoryName: string;
  isAvailable: boolean;

  static from(book: Book): BookResponseDto {
    return {
      bookId: book.bookId,
      title: book.title,
      description: book.description,
      categoryName: book.category.name,
      isAvailable: book.isAvailable,
    };
  }
}
