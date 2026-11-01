// src/main/java/.../dto/CreateBookRequest.java
package com.umc.study.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// POST /books 요청 바디의 "약속(계약)"입니다.
// 3주차에는 Map<String, Object>로 받아 어떤 키가 들어오는지 코드만 보고는 알 수 없었습니다.
public record CreateBookRequest(
        @NotNull(message = "categoryId는 필수입니다.")
        Long categoryId,

        @NotBlank(message = "title은 비어 있을 수 없습니다.")
        @Size(max = 100, message = "title은 100자 이하여야 합니다.")
        String title,

        String description // 선택 값
) {}
