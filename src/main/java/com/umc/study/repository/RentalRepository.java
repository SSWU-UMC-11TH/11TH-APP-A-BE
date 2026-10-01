// src/main/java/.../repository/RentalRepository.java
package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.Map;

@Repository // 대여 기록(rental 테이블)을 담당하는 창고지기
@RequiredArgsConstructor
public class RentalRepository {

    private final JdbcTemplate jdbcTemplate;

    public Long save(Object userId, Object bookId) {
        // rented_at은 DB의 현재 시간 NOW(), due_at은 7일 뒤 DATE_ADD(NOW(), INTERVAL 7 DAY)로 설정합니다.
        // rental_id는 AUTO_INCREMENT, returned_at은 아직 반납 전이므로 NULL(기본값)로 둡니다.
        String sql = "INSERT INTO rental (user_id, book_id, rented_at, due_at) "
                + "VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))";

        // INSERT 후 DB가 자동 생성한 rental_id를 돌려받기 위해 KeyHolder를 사용합니다.
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setObject(1, userId);
            ps.setObject(2, bookId);
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    public Map<String, Object> findById(Long rentalId) {
        // 방금 생성된 대여 기록을 그대로 조회해서 응답으로 돌려주기 위한 메서드입니다.
        String sql = "SELECT * FROM rental WHERE rental_id = ?";

        return jdbcTemplate.queryForMap(sql, rentalId);
    }
}
