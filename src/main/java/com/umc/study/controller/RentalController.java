// src/main/java/.../controller/RentalController.java
package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/rentals") // 이 컨트롤러로 들어오는 요청의 기본 주소는 /rentals
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    // POST /rentals : Request Body로 { "userId": 1, "bookId": 3 } 형태를 받습니다.
    // 새 리소스가 생성되었으므로 200이 아닌 201 Created와 함께 생성된 대여 기록을 응답합니다.
    @PostMapping
    public ResponseEntity<Map<String, Object>> createRental(@RequestBody Map<String, Object> body) {
        Map<String, Object> rental = rentalService.createRental(body);

        return ResponseEntity.status(HttpStatus.CREATED).body(rental);
    }
}
