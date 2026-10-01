// src/main/java/.../service/RentalService.java
package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service // 대여 비즈니스 로직을 담당하는 셰프 계층
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public Map<String, Object> createRental(Map<String, Object> body) {
        // 요청 바디에서 userId, bookId를 꺼내 대여 기록을 삽입하고,
        // 생성된 rental_id로 방금 저장된 레코드를 다시 조회해 반환합니다.
        Long rentalId = rentalRepository.save(body.get("userId"), body.get("bookId"));

        return rentalRepository.findById(rentalId);
    }
}
