# Sprint 5 코드 리뷰 보고서

**리뷰 대상:** PR #5 (sprint5 → main)
**리뷰 일자:** 2026-03-13
**리뷰어:** code-reviewer agent

---

## 총평

Sprint 5 구현은 계획된 모든 기능(다크모드, 복잡도 정보 표시, OG 메타 태그)을 완성했으며, 전반적으로 높은 코드 품질을 유지합니다. 특히 `ThemeToggle`을 독립 훅과 props로 분리한 설계가 깔끔하고, TDD로 작성된 `algorithmInfo.test.ts`의 커버리지가 충분합니다.

---

## 잘 된 점

- **관심사 분리 우수**: `useTheme` 훅이 localStorage/시스템 설정 로직을 캡슐화하고, `ThemeToggle`은 순수 프레젠테이션 컴포넌트로 분리됨. `SortingVisualizer`가 `theme`/`toggleTheme`을 TopNav에 prop으로 전달하는 단방향 흐름이 명확함.
- **FOUC 방지 스크립트**: `layout.tsx`의 인라인 IIFE 스크립트가 서버 렌더링 전에 실행되어 테마 깜빡임을 원천 차단함.
- **타입 안전성**: `ALGORITHM_INFO`가 `Record<AlgorithmType, ComplexityInfo>`로 타입이 고정되어 런타임에 `undefined` 발생 불가.
- **접근성**: 슬라이더에 `aria-label`, 버튼에 `aria-label`/텍스트 레이블, `VisualizerArea`에 `aria-label`이 일관되게 적용됨.
- **다크모드 일관성**: `bg-gray-100 dark:bg-gray-900` 패턴이 TopNav, ControlBar, AlgorithmInfo, VisualizerArea에서 통일되게 사용됨.
- **TDD 준수**: `algorithmInfo.test.ts` 5개 테스트가 구현 전 시나리오를 검증하며, 필드명 변경 추적 가능.

---

## 이슈 목록

### Important (수정 권장)

#### I-1: `useTheme` 초기 상태가 `"dark"`로 하드코딩됨

**파일:** `src/hooks/useTheme.ts`, 8번 줄

```typescript
// 현재 코드
const [theme, setTheme] = useState<Theme>("dark");
```

**문제:** 서버 렌더링 시 초기값이 항상 `"dark"`이므로, 시스템이 라이트 모드인 사용자는 첫 렌더 시 다크 배경을 잠깐 볼 수 있음. `useEffect`에서 `localStorage`를 읽어 라이트로 교정되지만, FOUC 스크립트와 의도가 불일치함.

**권장 수정:** 초기값을 `"light"`로 변경하거나, FOUC 스크립트와 동일한 로직으로 초기값을 결정.

```typescript
const [theme, setTheme] = useState<Theme>("light");
```

> **참고:** FOUC 스크립트는 `prefersDark || (!stored && !prefersLight)` 조건으로 다크를 기본으로 하므로, 훅의 초기 기본값이 `"dark"`인 것도 의도일 수 있음. 팀 정책 확인 필요.

#### I-2: `layout.tsx`에 `suppressHydrationWarning` 누락

**파일:** `src/app/layout.tsx`, 35번 줄

```typescript
// 현재 코드
<html lang="ko">
```

**문제:** FOUC 스크립트가 `<html>` 태그에 `dark` 클래스를 동적으로 추가하므로, 서버 렌더링(클래스 없음)과 클라이언트 hydration(클래스 있을 수 있음) 간 불일치 경고가 발생할 수 있음. Next.js 공식 패턴은 `<html>` 태그에 `suppressHydrationWarning`을 추가함.

**권장 수정:**

```typescript
<html lang="ko" suppressHydrationWarning>
```

#### I-3: `themeScript`에 try-catch 없음

**파일:** `src/app/layout.tsx`, 19~27번 줄

**문제:** `localStorage.getItem` 호출이 보안 정책(예: Safari ITP, iframe 제한)에 의해 예외를 던질 수 있음. 현재 스크립트에 try-catch가 없어 스크립트 오류 시 페이지 렌더링이 차단될 수 있음.

**권장 수정:**

```javascript
(function() {
  try {
    var stored = localStorage.getItem('theme');
    // ...
  } catch (e) {}
})();
```

---

### Suggestion (선택 개선)

#### S-1: `AlgorithmInfo` 컴포넌트의 `"use client"` 불필요

**파일:** `src/components/AlgorithmInfo.tsx`, 1번 줄

`AlgorithmInfo`는 상태나 이벤트 없이 props만 렌더링하는 순수 컴포넌트이므로 `"use client"` 없이 서버 컴포넌트로 동작 가능. 번들 크기 최적화에 유리함.

#### S-2: 속도 슬라이더에 `disabled` 누락

**파일:** `src/components/TopNav.tsx`, 82~86번 줄

배열 크기 슬라이더는 `disabled={isSorting}`이 있지만, 속도 슬라이더에는 없음. 스프린트 계획에서 "정렬 중에도 속도 슬라이더 조작 가능"이 의도된 설계이므로, 이것은 의도된 동작임. 하지만 사용자에게 명시적 힌트(예: 레이블에 "조작 가능" 텍스트)를 주면 UX가 개선될 수 있음.

#### S-3: 테스트 파일의 `description` 필드 누락

**파일:** `src/constants/algorithmInfo.ts`

실제 구현에서 `description` 필드가 빠져 있음. 스프린트 계획(`sprint5.md`)에는 `description` 필드가 포함된 인터페이스가 명시되어 있었으나, 최종 구현에서는 `ComplexityInfo`에 `description`이 없음. 향후 툴팁이나 설명 영역 추가 시 필드를 확장하면 됨.

---

## 이슈 요약

| 구분 | 수 | 항목 |
|------|----|------|
| Critical | 0 | — |
| Important | 3 | I-1 (useTheme 초기값), I-2 (suppressHydrationWarning), I-3 (themeScript try-catch) |
| Suggestion | 3 | S-1 (use client 제거), S-2 (속도 슬라이더 UX), S-3 (description 필드) |

**Critical 이슈 없음 — PR 머지 진행 가능합니다.**

Important 이슈 중 I-2(suppressHydrationWarning)와 I-3(try-catch)은 안정성 관련 항목으로 다음 스프린트 또는 핫픽스에서 반영을 권장합니다.

---

## 플랜 대비 구현 적합성

| 계획 항목 | 구현 여부 | 비고 |
|-----------|-----------|------|
| `darkMode: 'class'` 설정 | ✅ | `globals.css`에 `@custom-variant dark` 방식으로 구현 (Tailwind v4 호환) |
| `useTheme` 훅 | ✅ | localStorage + 시스템 설정 감지 완료 |
| FOUC 방지 스크립트 | ✅ | `layout.tsx` 인라인 스크립트 |
| `ThemeToggle` 컴포넌트 | ✅ | props 기반 분리 (계획과 약간 다르나 더 나은 설계) |
| `AlgorithmInfo` 컴포넌트 | ✅ | 복잡도 6개 필드 표시 |
| `algorithmInfo.ts` 상수 | ✅ | `AlgorithmType` 타입 기반으로 더 강한 타입 안전성 |
| Open Graph 메타 태그 | ✅ | Twitter 카드도 추가됨 |
| aria-label 접근성 | ✅ | 슬라이더, 버튼, 시각화 영역 모두 적용 |
| TDD (algorithmInfo.test.ts) | ✅ | 5개 테스트 통과 |
