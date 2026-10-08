// src/main/java/.../repository/CategoryRepository.java
package com.umc.study.repository;

import com.umc.study.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

// findById 같은 기본 CRUD는 JpaRepository가 이미 제공하므로 비어 있어도 충분합니다.
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
