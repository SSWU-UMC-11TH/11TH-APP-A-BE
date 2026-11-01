// src/category.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity('category') // DB의 category 테이블과 연결
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @Column({ length: 50 })
  name: string;

  // 카테고리 하나에 여러 권의 도서가 속합니다. (category 1 : N book)
  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
