// src/create-book.dto.ts
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

// 도서 등록 요청으로 받을 데이터의 약속. 조건에 맞지 않으면 Service에 닿기 전에 400으로 거절됩니다.
export class CreateBookDto {
  @IsInt()
  @Type(() => Number) // "1"처럼 문자열로 와도 숫자로 변환한 뒤 검사
  categoryId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsOptional() // 보내지 않아도 되는 선택 값
  @IsString()
  description?: string;
}
