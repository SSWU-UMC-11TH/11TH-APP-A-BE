// src/main/java/.../domain/Book.java
package com.umc.study.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long bookId;

    // ERD의 "category 1 : N book" 관계를 코드로 옮긴 부분입니다.
    // 3주차에는 category_id 숫자만 들고 다녔지만, 이제는 Category 객체 자체를 참조합니다.
    // LAZY: Book을 조회할 때 Category는 실제로 접근하는 순간에 쿼리합니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false) // FK 컬럼 이름
    private Category category;

    @Column(nullable = false, length = 100)
    private String title;

    // DB 컬럼이 TEXT 타입이므로 명시해야 ddl-auto: validate 검증을 통과합니다.
    @Column(columnDefinition = "TEXT")
    private String description;

    // DB 컬럼은 is_available(snake_case), 필드는 isAvailable(camelCase)로 명시적 매핑
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    // 새 도서를 등록할 때 쓰는 생성자. bookId는 DB가 만들고, isAvailable은 기본 true입니다.
    public Book(Category category, String title, String description) {
        this.category = category;
        this.title = title;
        this.description = description;
    }
}
