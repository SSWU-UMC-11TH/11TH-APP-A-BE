## ✨ Description

NestJS로 회원가입과 평점 등록·수정·삭제를 구현했습니다.
5주차의 DB 연결·조회 API를 실행 기반으로 포함했습니다.

### 🔗 관련 Issue

- Closes #13

### 📝 작업 내용

- 회원가입 DTO 검증 및 이메일·닉네임 중복 방지
- bcrypt 해시 저장, 응답에서 비밀번호 제외
- 평점 CRUD, 별점 1~5 및 후기 최대 500자 검증
- 수정·삭제 전 작성자 검사
- 공통 성공·오류 응답과 DB UNIQUE 위반 409 처리

### API 명세

| Method | URL | 성공 | 주요 실패 |
|---|---|---|---|
| POST | /members | 201 | 400, 409 |
| POST | /members/{memberId}/ratings | 201 | 400, 404, 409 |
| PATCH | /members/{memberId}/ratings/{ratingId} | 200 | 400, 403, 404 |
| DELETE | /members/{memberId}/ratings/{ratingId} | 204, 본문 없음 | 400, 403, 404 |

회원가입 입력: email, password, nickname
평점 등록 입력: movieId, score, 선택 comment
평점 수정 입력: 필수 score, 선택 comment
공통 응답: isSuccess, code, message, result

### 검증 및 실행

- backend에서 npm ci 후 .env.example을 .env로 복사하고 DB 정보를 설정합니다.
- 기존 umc_movie의 member/rating/favorite 테이블을 사용합니다.
- npm run build 및 npm run start:dev
- 기본 주소: http://127.0.0.1:3001
- python3 scripts/check-week06.py: API 24개 검증 통과
- DB bcrypt 해시 및 비밀번호 일치 검증
- 결과 기록: backend/docs/week06-verification.md
- Postman에서 회원가입·검증 실패·평점 등록 응답 확인

### 트러블슈팅

zsh에서 큰따옴표 명령에 포함된 느낌표가 히스토리 확장되어
bcrypt 확인 명령에 과거 명령이 삽입되는 오류가 발생했습니다.
따옴표로 보호한 heredoc으로 Node 코드를 실행해 검증했습니다.

### 🔍 리뷰 요청 사항

- BIGINT 회원 번호의 타입 차이를 고려한 작성자 비교
- 공통 예외 처리 및 DB 중복 오류 변환

### ✅ 체크리스트

- [x] 본인의 브랜치에서 작업했습니다.
- [ ] 주차별 미션을 모두 수행했습니다. (워크북 캡처·기록 첨부 최종 확인 필요)
- [x] 커밋 컨벤션을 지켰습니다.
- [x] 통커밋하지 않고 작업 단위로 커밋했습니다.
- [x] PR의 Base 브랜치가 본인의 닉네임 브랜치인지 확인했습니다.

### 📎 참고 사항

로그인 전 단계로 memberId를 경로에서 받습니다.
수정 시 comment를 생략하면 기존 후기는 null로 변경됩니다.
