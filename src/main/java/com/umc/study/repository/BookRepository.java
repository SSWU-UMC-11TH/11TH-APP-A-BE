// src/main/java/.../repository/BookRepository.java
package com.umc.study.repository;

import com.umc.study.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 3주차: JdbcTemplate + SQL 문자열을 직접 작성한 클래스
// 4주차: JpaRepository를 상속한 인터페이스. 구현체는 Spring Data JPA가 런타임에 만들어 줍니다.
public interface BookRepository extends JpaRepository<Book, Long> {

    // 메서드 이름 규칙(Query Method)만으로 "SELECT ... FROM book ORDER BY book_id DESC"가 생성됩니다.
    List<Book> findAllByOrderByBookIdDesc();

    // 3주차의 GET /books/category/{categoryId}를 유지하기 위한 메서드.
    // Book.category.categoryId 경로를 따라가 "WHERE category_id = ?" 조건이 생성됩니다.
    List<Book> findAllByCategoryCategoryIdOrderByBookIdDesc(Long categoryId);
}
