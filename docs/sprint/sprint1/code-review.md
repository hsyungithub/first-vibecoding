# Sprint 1 코드 리뷰 보고서

> 리뷰 대상: PR #1 (sprint1 → main)
> 리뷰 일자: 2026-03-13
> 리뷰어: code-reviewer 에이전트

---

## 종합 평가

Sprint 1 구현은 계획(sprint1.md)을 충실히 따르고 있으며, Next.js App Router 클라이언트 컴포넌트 분리, Tailwind CSS 유틸리티 전용 스타일링, 단방향 상태 흐름 등 설계 원칙이 잘 지켜졌습니다. Critical 이슈 없음. Phase 2 이후 연동을 고려한 미리 정의된 구조도 적절합니다.

---

## 잘 된 점

- 계획에 명시된 모든 컴포넌트(TopNav, VisualizerArea, ControlBar, SortingVisualizer)가 구현됨
- `"use client"` 경계를 `SortingVisualizer.tsx`로 집중하여 `page.tsx`를 서버 컴포넌트로 유지한 설계가 적절함
- 모든 컴포넌트에 `aria-label` 속성이 포함되어 접근성 기반이 마련됨
- `generateRandomArray` 함수에 JSDoc 주석이 작성되어 문서화 기준 충족
- 타입과 상수를 `src/types/index.ts`에 중앙 집중화하여 재사용성 확보
- `isSorting`, `handleStartSort` 등 Phase 2/3 연동을 위한 상태와 핸들러가 미리 정의됨

---

## Critical 이슈 (반드시 수정)

없음.

---

## Important 이슈 (수정 권장)

### 1. VisualizerArea — `key={index}` 사용

**파일:** `src/components/VisualizerArea.tsx`, 라인 21

**문제:** 배열 재정렬 시 React는 index 기반 key로 DOM 노드를 재사용합니다. Phase 2에서 배열 값이 변경되며 막대 색상 상태도 함께 관리될 때, index key는 잘못된 DOM 재사용으로 애니메이션 깜빡임을 유발할 수 있습니다.

**권장:** Phase 2 시작 시 배열 요소에 고유 id를 부여하거나, `barStates` 배열 도입 시 함께 개선 검토.

---

### 2. SortingVisualizer — `console.log` 프로덕션 포함

**파일:** `src/app/SortingVisualizer.tsx`, 라인 28

**문제:** `handleStartSort` 내 `console.log` 구문이 프로덕션 빌드에 포함됩니다. 현재는 기능 미구현 상태의 임시 코드이므로 Phase 3 연결 전까지 빌드에서 포함되어 있어도 동작상 무해하지만, 빌드 경고 없음이 완료 기준인 만큼 관리가 필요합니다.

**권장:** Phase 3에서 실제 정렬 로직 연결 시 제거 예정임을 `// TODO(Phase3):` 주석으로 명시.

---

### 3. TopNav — 속도 슬라이더 범위 하드코딩

**파일:** `src/components/TopNav.tsx`, 라인 75-76

**문제:** 속도 슬라이더 범위가 `min={1} max={10}`으로 하드코딩되어 있습니다. Phase 2에서 `sleep(ms)` 변환 로직을 구현할 때 이 범위를 참조해야 하는데, `src/types/index.ts`에 상수가 없어 두 곳의 값이 불일치할 위험이 있습니다.

**권장:** `SPEED_MIN = 1`, `SPEED_MAX = 10`, `SPEED_DEFAULT = 5` 상수를 `src/types/index.ts`에 추가하고 참조.

---

## Suggestion (선택적 개선)

### 1. VisualizerArea — 빈 배열 플레이스홀더

빈 배열 상태에서는 시각화 영역이 비어 표시됩니다. "새 배열 생성 버튼을 눌러 시작하세요" 같은 안내 텍스트를 추가하면 초기 사용자 경험이 향상됩니다. (현재는 `useEffect`로 초기 배열이 자동 생성되므로 실제 발생 가능성 낮음)

### 2. TopNav — aria-label 중복

`input[type="range"]`에 `id`로 연결된 `label` 요소와 `aria-label` 속성이 동시에 있습니다. `label` 요소가 있으면 `aria-label`은 중복이므로 `aria-label`을 제거하거나 `label` 요소를 제거하는 것을 권장합니다.

### 3. generateRandomArray — 음수 size 방어

`size < 0`일 경우 `Array.from({ length: size })` 는 빈 배열을 반환하지만, 의도하지 않은 입력임을 명시하기 위해 방어 로직 또는 주석 추가를 고려하세요.

---

## Phase 2 준비 관련 메모

- `animationSpeed` 상태가 `SortingVisualizer`에서 관리되고 있으나, Phase 2에서 `useRef`로 변환 예정 — 계획과 일치
- `isSorting` 상태와 `handleStartSort` 핸들러가 미리 정의되어 Phase 2/3 연동 준비 완료
- 속도 슬라이더 범위 상수화를 Phase 2 시작 전에 처리하면 연동 작업이 단순해짐

---

## 결론

Sprint 1 구현은 계획 대비 완성도가 높고 안정적입니다. Important 이슈 3개는 현재 기능에 영향을 주지 않으나, Phase 2 진입 전 처리하면 기술 부채 최소화에 도움이 됩니다. 특히 이슈 3번(속도 슬라이더 상수화)은 Phase 2 작업 시작 시 함께 처리하는 것을 권장합니다.
