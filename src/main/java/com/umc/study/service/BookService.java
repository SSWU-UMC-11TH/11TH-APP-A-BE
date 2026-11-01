// src/main/java/.../service/BookService.java
package com.umc.study.service;

import com.umc.study.domain.Book;
import com.umc.study.domain.Category;
import com.umc.study.dto.BookResponse;
import com.umc.study.dto.CreateBookRequest;
import com.umc.study.exception.CategoryNotFoundException;
import com.umc.study.repository.BookRepository;
import com.umc.study.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    // readOnly = true: 조회 전용 트랜잭션. 변경 감지(dirty checking)를 생략해 성능에 이점이 있고,
    // LAZY 로딩된 category.name을 DTO로 변환하는 동안 영속성 컨텍스트가 열려 있도록 보장합니다.
    @Transactional(readOnly = true)
    public List<BookResponse> getBooks() {
        return bookRepository.findAllByOrderByBookIdDesc().stream()
                .map(BookResponse::from) // Entity → Response DTO
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookResponse> getBooksByCategory(Long categoryId) {
        return bookRepository.findAllByCategoryCategoryIdOrderByBookIdDesc(categoryId).stream()
                .map(BookResponse::from)
                .toList();
    }

    @Transactional
    public BookResponse createBook(CreateBookRequest request) {
        // 1) FK로 넣을 카테고리가 실제로 존재하는지 먼저 확인합니다.
        //    없으면 DB 제약 조건 오류(500)가 나기 전에 의미 있는 예외(404)로 바꿔 던집니다.
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new CategoryNotFoundException(request.categoryId()));

        // 2) 엔티티를 만들고 저장합니다. INSERT SQL은 JPA가 생성합니다.
        Book book = new Book(category, request.title(), request.description());
        Book saved = bookRepository.save(book);

        // 3) 저장된 엔티티(book_id가 채워진 상태)를 응답 DTO로 변환합니다.
        return BookResponse.from(saved);
    }
}
