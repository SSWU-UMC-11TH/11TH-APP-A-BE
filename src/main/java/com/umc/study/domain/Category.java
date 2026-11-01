// src/main/java/.../domain/Category.java
package com.umc.study.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity // 이 클래스는 DB 테이블 한 개와 1:1로 대응되는 JPA 엔티티입니다.
@Table(name = "category") // 매핑할 실제 테이블 이름 (DB는 snake_case, 코드는 PascalCase)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA가 리플렉션으로 객체를 만들 때만 쓰는 기본 생성자
public class Category {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL AUTO_INCREMENT에 맡김
    @Column(name = "category_id")
    private Long categoryId;

    @Column(nullable = false, length = 50)
    private String name;
}
