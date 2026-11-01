// src/book.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('book') // DB의 book 테이블과 연결
export class Book {
  // DB 컬럼명(snake_case)과 코드 필드명(camelCase)을 name 옵션으로 명시적으로 매핑합니다.
  @PrimaryGeneratedColumn({ name: 'book_id', type: 'bigint' })
  bookId: number;

  // 도서 여러 권은 하나의 카테고리에 속합니다. FK 숫자 대신 Category 객체를 들고 다닙니다.
  @ManyToOne(() => Category, (category) => category.books, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;
}
