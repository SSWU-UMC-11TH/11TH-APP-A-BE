// src/main/java/.../dto/BookResponse.java
package com.umc.study.dto;

import com.umc.study.domain.Book;

// 클라이언트에게 돌려줄 응답 모양입니다.
// Entity를 그대로 반환하면 DB 컬럼명(is_available 등)이 API 계약이 되어버리므로 DTO로 분리합니다.
public record BookResponse(
        Long bookId,
        String title,
        String description,
        String categoryName,
        Boolean isAvailable
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getBookId(),
                book.getTitle(),
                book.getDescription(),
                book.getCategory().getName(), // LAZY 관계이므로 트랜잭션 안에서 호출해야 합니다.
                book.getIsAvailable()
        );
    }
}
