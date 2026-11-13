# 한끼맛집 — 개발 규칙

정적 웹페이지(HTML/CSS/JS, 빌드 도구 없음). `index.html`을 브라우저로 열면 실행된다.

## 디자인 규칙 (필수)

**모든 신규 기능과 화면은 [`design.md`](design.md)의 디자인 형식을 따른다.** 화면을 만들거나 고치기 전에 design.md를 먼저 읽는다.

- 색·글꼴·간격·모서리 값은 `css/style.css`의 `:root` 변수(design.md 토큰과 1:1 대응)만 쓴다. hex 값을 직접 쓰지 않는다.
  - `{colors.primary}` → `var(--color-primary)`, `{rounded.pill}` → `var(--rounded-pill)`, `{spacing.section}` → `var(--spacing-section)` 처럼 이름을 그대로 옮긴다.
- 클릭할 수 있는 요소의 색은 Action Blue(`--color-primary`) 하나뿐이다. 별점, 배지 등에 두 번째 강조색(주황, 초록 등)을 쓰지 않는다.
- 섹션은 모서리 없는 전체 폭 타일로 만들고, 밝은 타일(white/parchment)과 어두운 타일(tile-1/2/3)을 번갈아 배치한다. 색이 바뀌는 것 자체가 구분선이다.
- 그림자는 상품 이미지(이 프로젝트에선 음식 이모지/사진)에만 `--shadow-product`로 쓴다. 카드·버튼·글자에는 쓰지 않는다.
- 버튼: 주요 행동은 `.btn-primary`(파란 알약), 두 번째 행동은 `.btn-secondary-pill`. 누를 때는 `transform: scale(0.95)`. hover 효과는 만들지 않는다.
- 본문은 17px / 400 / 1.47. 굵기는 300·400·600·700만 쓰고 500은 쓰지 않는다.
- 반응형 기준점: 1440 / 1068 / 833 / 734 / 640 / 419px (design.md "Responsive Behavior").

## 이 프로젝트에서의 적용 방법

- **글꼴:** SF Pro는 시스템 글꼴로만 쓴다. 한글은 Apple SD Gothic Neo → Pretendard → Malgun Gothic 순서로 대체한다 (`--font-display`, `--font-text`).
- **상품 이미지:** 실제 사진이 생기기 전까지는 음식 이모지가 "상품 렌더" 역할을 하며 `filter: drop-shadow(...)`로 시스템 그림자를 받는다.
- **다크 모드:** design.md는 밝은 화면 기준이므로 OS 다크 모드를 따로 지원하지 않는다. 어두운 느낌은 dark tile로 낸다.

## 파일 구조

```
index.html      페이지 마크업
css/style.css   디자인 토큰(:root)과 컴포넌트 스타일
js/data.js      식당 데이터 (샘플)
js/app.js       검색/필터/정렬/찜 로직
design.md       디자인 시스템 (모든 화면의 기준)
```
