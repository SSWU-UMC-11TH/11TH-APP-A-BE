// 백엔드(Spring) 주소. CORS에서 http://localhost:5173 출처만 허용해 두었으므로 반드시 5173 포트로 띄워야 합니다.
const API_BASE_URL = "http://localhost:8080";

document.getElementById("base-url").textContent = API_BASE_URL;

/* ---------- 공통: API 호출 + 호출 기록 ---------- */

async function api(path) {
  const url = API_BASE_URL + path;
  try {
    const res = await fetch(url);
    const body = await res.json().catch(() => null);
    logApi(url, res.status, body);
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    // CORS 차단이나 서버 꺼짐은 응답 자체를 받을 수 없어 여기로 들어옵니다.
    logApi(url, 0, e.message);
    return { ok: false, status: 0, body: null };
  }
}

function logApi(url, status, body) {
  const li = document.createElement("li");
  li.className = "s" + String(status)[0];
  const time = new Date().toLocaleTimeString("ko-KR");
  li.textContent = `[${time}] GET ${url} → ${status || "NETWORK ERROR"} ${JSON.stringify(body)}`;
  document.getElementById("api-log").append(li); // 호출한 순서대로 아래로 쌓입니다.
}

function setMsg(el, text, type) {
  el.textContent = text;
  el.className = "msg " + (type || "");
}

/* ---------- 탭 전환 ---------- */

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".view").forEach((v) =>
      v.classList.toggle("active", v.id === "view-" + tab.dataset.view)
    );
  });
});

/* ---------- 회원가입: 닉네임 / 이메일 중복 체크 ---------- */

const checked = { email: false, nickname: false };

function updateSubmit() {
  // 가입 API는 6주차에 연결하므로 버튼은 계속 비활성화하되, 두 항목이 모두 확인되면 문구로 알려줍니다.
  const btn = document.getElementById("signup-submit");
  btn.textContent = checked.email && checked.nickname
    ? "중복 확인 완료! (가입 API는 6주차 연결 예정)"
    : "가입하기 (6주차 예정)";
}

async function checkDuplicate(field, label) {
  const input = document.getElementById(field);
  const msg = document.getElementById(field + "-msg");
  const value = input.value.trim();

  checked[field] = false;
  updateSubmit();

  if (!value) {
    setMsg(msg, `${label}을(를) 입력해주세요.`, "bad");
    return;
  }

  setMsg(msg, "확인 중...");
  const { ok, status, body } = await api(`/members/${field}/${encodeURIComponent(value)}`);

  if (!ok) {
    setMsg(msg, status === 0 ? "서버에 연결할 수 없어요. (서버 실행 / CORS 설정 확인)" : `오류가 발생했어요. (${status})`, "bad");
    return;
  }

  if (body.available) {
    checked[field] = true;
    setMsg(msg, `사용할 수 있는 ${label}이에요.`, "ok");
  } else {
    setMsg(msg, `이미 사용 중인 ${label}이에요.`, "bad");
  }
  updateSubmit();
}

document.getElementById("email-check").addEventListener("click", () => checkDuplicate("email", "이메일"));
document.getElementById("nickname-check").addEventListener("click", () => checkDuplicate("nickname", "닉네임"));

// 값을 바꾸면 다시 확인해야 합니다.
["email", "nickname"].forEach((field) => {
  document.getElementById(field).addEventListener("input", () => {
    checked[field] = false;
    setMsg(document.getElementById(field + "-msg"), "");
    updateSubmit();
  });
});

document.getElementById("signup-form").addEventListener("submit", (e) => e.preventDefault());

/* ---------- 내 평점: 유저별 평점 조회 ---------- */

// 영화 상세 정보는 TMDB에서 프론트가 직접 가져올 예정이라, 지금은 시드 데이터의 영화만 이름을 붙여 보여줍니다.
const MOVIE_TITLES = { 550: "파이트 클럽", 155: "다크 나이트" };

function stars(score) {
  return "★".repeat(score) + `<span class="off">${"★".repeat(5 - score)}</span>`;
}

function formatDate(iso) {
  return iso ? iso.replace("T", " ").slice(0, 16) : "-";
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

document.getElementById("ratings-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const memberId = document.getElementById("member-id").value.trim();
  const summary = document.getElementById("ratings-summary");
  const list = document.getElementById("ratings-list");
  list.innerHTML = "";

  if (!memberId) {
    setMsg(summary, "회원 번호를 입력해주세요.", "bad");
    return;
  }

  setMsg(summary, "불러오는 중...");
  const { ok, status, body } = await api(`/members/${encodeURIComponent(memberId)}/ratings`);

  if (status === 404) {
    setMsg(summary, "존재하지 않는 회원이에요.", "bad");
    return;
  }
  if (!ok) {
    setMsg(summary, status === 0 ? "서버에 연결할 수 없어요. (서버 실행 / CORS 설정 확인)" : `오류가 발생했어요. (${status})`, "bad");
    return;
  }
  if (body.length === 0) {
    setMsg(summary, "아직 남긴 평점이 없어요.");
    return;
  }

  setMsg(summary, `총 ${body.length}개의 평점 (최신순)`, "ok");
  list.innerHTML = body.map((r) => `
    <li class="rating">
      <div class="rating-head">
        <span class="movie">${escapeHtml(MOVIE_TITLES[r.movieId] ?? "TMDB 영화")}<small>#${r.movieId}</small></span>
        <span class="stars">${stars(r.score)}</span>
      </div>
      <p class="comment">${escapeHtml(r.comment) || '<span class="meta">코멘트 없음</span>'}</p>
      <div class="meta">ratingId ${r.ratingId} · 작성 ${formatDate(r.createdAt)} · 수정 ${formatDate(r.updatedAt)}</div>
    </li>`).join("");
});
