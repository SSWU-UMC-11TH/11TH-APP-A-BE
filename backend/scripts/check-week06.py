import json
import uuid
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

BASE = "http://127.0.0.1:3001"
results = []

def check(label, method, path, expected, data=None):
    payload = None if data is None else json.dumps(data).encode()
    request = Request(
        BASE + path, data=payload, method=method,
        headers={"Content-Type": "application/json"},
    )
    try:
        response = urlopen(request, timeout=15)
    except HTTPError as error:
        response = error
    status = response.code
    raw = response.read()
    body = json.loads(raw) if raw else None
    assert status == expected, f"{label}: 예상 {expected}, 실제 {status}, {body}"
    if expected == 204:
        assert raw == b"", "204 응답에 본문이 있습니다."
    else:
        assert isinstance(body, dict), f"공통 응답 누락: {body}"
        assert {"isSuccess", "code", "message", "result"} <= body.keys()
        assert body["isSuccess"] == (expected < 400)
        if expected >= 400:
            assert body["result"] is None
    results.append(f"- PASS: {label} ({status})")
    print(results[-1])
    return None if body is None else body["result"]

tag = uuid.uuid4().hex[:8]
account = {
    "email": f"week6-{tag}@example.com",
    "nickname": f"u{tag}",
    "password": "StudyTest!123",
}
owner = check("회원가입", "POST", "/members", 201, account)
assert "password" not in owner, "응답에 비밀번호가 있습니다."
owner_id = owner["memberId"]

other = check("다른 회원 생성", "POST", "/members", 201, {
    **account,
    "email": f"other-{tag}@example.com",
    "nickname": f"v{tag}",
})
other_id = other["memberId"]

check("이메일 중복", "POST", "/members", 409, {
    **account, "nickname": f"w{tag}",
})
check("닉네임 중복", "POST", "/members", 409, {
    **account, "email": f"new-{tag}@example.com",
})
check("이메일 형식", "POST", "/members", 400, {
    **account, "email": "invalid",
})
check("비밀번호 규칙", "POST", "/members", 400, {
    **account, "password": "123",
})
check("닉네임 길이", "POST", "/members", 400, {
    **account, "nickname": "a",
})

path = f"/members/{owner_id}/ratings"
check("빈 평점 목록", "GET", path, 200)
rating = {"movieId": 550, "score": 5, "comment": "자동 검증"}
for score in [0, 6, 1.5]:
    check(f"잘못된 별점 {score}", "POST", path, 400, {
        **rating, "score": score,
    })
check("후기 500자 초과", "POST", path, 400, {
    **rating, "comment": "가" * 501,
})
check("영화 번호 양수 검사", "POST", path, 400, {
    **rating, "movieId": 0,
})
check("없는 회원", "POST", "/members/9007199254740990/ratings", 404, rating)

rating_id = check("평점 등록", "POST", path, 201, rating)
check("평점 중복", "POST", path, 409, rating)
check("다른 회원 수정 차단", "PATCH",
      f"/members/{other_id}/ratings/{rating_id}", 403, {"score": 3})
check("다른 회원 삭제 차단", "DELETE",
      f"/members/{other_id}/ratings/{rating_id}", 403)
check("없는 평점 수정", "PATCH",
      path + "/9007199254740990", 404, {"score": 3})
check("없는 평점 삭제", "DELETE",
      path + "/9007199254740990", 404)

check("본인 평점 수정", "PATCH", path + f"/{rating_id}", 200, {
    "score": 4, "comment": "수정 확인",
})
rows = check("수정 결과 조회", "GET", path, 200)
matched = [r for r in rows if str(r["ratingId"]) == str(rating_id)]
assert len(matched) == 1
assert matched[0]["score"] == 4
assert matched[0]["comment"] == "수정 확인"

check("평점 삭제 및 본문 없음", "DELETE", path + f"/{rating_id}", 204)
rows = check("삭제 결과 조회", "GET", path, 200)
assert all(str(r["ratingId"]) != str(rating_id) for r in rows)

Path("docs/week06-verification.md").write_text(
    "# 6주차 API 검증\n\n" + "\n".join(results)
    + "\n\n테스트 회원 2개 생성. 테스트 평점 삭제 확인.\n",
    encoding="utf-8",
)
Path(".week06-test.json").write_text(
    json.dumps({"memberId": owner_id}), encoding="utf-8"
)
print("\n전체 API 검증 통과")
