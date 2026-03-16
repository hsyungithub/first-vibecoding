# useTheme 훅 안정성 개선

**날짜:** 2026-03-16
**대상 파일:** `src/hooks/useTheme.ts`

## 배경

외부 평가에서 `useTheme` 훅의 안정성 개선 여지가 지적됨.
FOUC 방지 스크립트(`src/app/layout.tsx`)는 이미 `localStorage`/`matchMedia` 접근을 `try-catch`로 감싸고 있었으나, 동일한 작업을 수행하는 `useTheme` 훅에는 방어 코드가 없어 불일치가 존재했음.

## 문제

`localStorage`가 차단된 환경(일부 브라우저의 프라이빗 브라우징, CSP 제한 iframe 등)에서 `localStorage.getItem` / `localStorage.setItem` 호출이 `DOMException`을 던질 수 있음. 에러가 잡히지 않으면 훅 자체가 크래시되어 테마 버튼이 동작하지 않게 됨.

## 변경 내용

### 초기화 useEffect (읽기)

```ts
// 변경 전
const stored = localStorage.getItem("theme") as Theme | null;
if (stored === "dark" || stored === "light") { ... }
else { setTheme(window.matchMedia(...).matches ? ...) }

// 변경 후
try {
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "dark" || stored === "light") { ... }
  else { setTheme(window.matchMedia(...).matches ? ...) }
} catch {
  setTheme("dark"); // 접근 불가 시 기본값
}
```

### 동기화 useEffect (쓰기)

```ts
// 변경 전
localStorage.setItem("theme", theme);

// 변경 후
try {
  localStorage.setItem("theme", theme);
} catch {
  // 쓰기 실패 시 무시 — 현재 세션 테마는 정상 동작
}
```

## 결과

- FOUC 스크립트와 `useTheme` 훅의 방어 코드 일관성 확보
- `localStorage` 차단 환경에서도 훅이 크래시 없이 기본 다크 테마로 동작
- 기존 정상 환경에서의 동작은 변경 없음
