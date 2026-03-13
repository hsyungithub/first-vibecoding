# Sprint 4 코드 리뷰 보고서

**리뷰일:** 2026-03-13
**대상 PR:** #4 (sprint4 → main)
**리뷰어:** code-reviewer agent
**리뷰 범위:** Phase 4 고급 알고리즘 시각화 구현 전체

---

## 요약

| 분류 | 건수 |
|------|------|
| Critical | 0 |
| Important | 2 |
| Suggestion | 3 |

전반적으로 Phase 3의 코드 패턴을 잘 따르고 있으며, 빌드 성공과 단위 테스트 통과로 기본 품질이 검증되어 있습니다. Critical 이슈는 없습니다.

---

## Important 이슈

### [Important 1] quickSort.ts: React import 누락

**위치:** `src/utils/algorithms/quickSort.ts`, `src/utils/algorithms/mergeSort.ts`

`React.MutableRefObject<number>`, `React.MutableRefObject<boolean>` 타입을 사용하지만 파일 상단에 `import React from 'react'` 또는 `import type { MutableRefObject } from 'react'` 구문이 없습니다.

현재는 빌드가 통과하는데, 이는 `SortFn` 타입이 `types.ts`에서 `React.MutableRefObject`를 선언하고 있고 `quickSort.ts` / `mergeSort.ts`에서는 직접 `React.MutableRefObject`를 파라미터 타입으로 명시하기 때문입니다. 빌드 성공은 TypeScript가 전역 `React` 타입을 해석하기 때문으로 보이나, `@types/react`에서 `React` 네임스페이스를 명시적으로 import하는 것이 안전합니다.

**권장 조치:** `types.ts`의 `SortFn` 타입을 `import type { MutableRefObject } from 'react'`로 교체하고, `quickSortHelper` / `mergeSortHelper` 함수 파라미터도 동일하게 수정. (Phase 5에서 정리 가능)

---

### [Important 2] mergeSort.ts: 병합 완료 후 초록색 표시가 재귀 구조와 충돌 가능

**위치:** `src/utils/algorithms/mergeSort.ts` 100~107행

`mergeAnimated` 함수 마지막에 `left..right` 구간 전체를 `sorted`로 표시합니다. 그러나 병합 정렬은 재귀적으로 하위 구간부터 병합하므로, 작은 구간이 먼저 `sorted`로 표시된 후 상위 병합 시 해당 구간의 상태가 `comparing` / `swapping`으로 덮어써집니다. 최종적으로는 `SortingVisualizer.tsx`의 `completionAnimation`이 모든 막대를 초록색으로 순차 변경하므로 사용자가 최종 결과를 보는 데는 문제가 없습니다. 다만 중간 과정에서 "이미 완료됐다고 표시된 구간이 다시 빨간색으로 변하는" 시각적 혼란이 발생할 수 있습니다.

**권장 조치:** 병합 완료 색상을 `sorted` 대신 `default`로 표시하여 시각적 혼란 방지. 전체 정렬 완료 후 `completionAnimation`에서 일괄 초록색 전환을 담당하도록 역할 분리. (Phase 5 UX 개선 시 검토 권장)

---

## Suggestion

### [Suggestion 1] quickSort.ts: 피벗 색상 초기화 누락 케이스

**위치:** `src/utils/algorithms/quickSort.ts` 85~92행

`stopRef.current`가 true가 되어 중단될 경우, `next[high]` (피벗)의 `swapping` 색상이 초기화되지 않은 채로 남을 수 있습니다. 단, `handleReset`에서 `initArray`가 즉시 새 배열을 생성하므로 사용자에게 시각적으로 노출되지 않습니다. 현재 동작에는 문제가 없습니다.

---

### [Suggestion 2] 테스트 커버리지 — 중복값 케이스 부재

**위치:** `src/__tests__/utils/algorithms/quickSort.test.ts`

`partitionSync` 테스트에서 `[3, 1, 4, 1, 5]`와 같이 중복값이 포함된 배열을 사용하지만, 피벗보다 작거나 같은(`<=`) 조건의 경계값인 "피벗과 동일한 값이 여러 개"인 케이스는 별도로 검증되지 않습니다. 현재 구현(`arr[j] <= pivot`)은 동일 값을 왼쪽으로 보내므로 동작은 정상입니다. 추후 테스트 케이스 보강 시 고려할 수 있습니다.

---

### [Suggestion 3] vitest.config.ts: environment가 'node'로 설정됨

현재 테스트 대상이 순수 로직 함수(`partitionSync`, `mergeSync`)이므로 `node` 환경이 적합합니다. 다만 향후 React 컴포넌트 단위 테스트를 추가할 경우 `jsdom` 환경으로 변경이 필요합니다. 주석으로 의도를 명시하면 협업 시 혼란을 방지할 수 있습니다.

---

## 긍정적 평가

- **SortFn 인터페이스 일관성:** Phase 3에서 정의한 `SortFn` 타입을 퀵/병합 정렬 모두 정확히 따름
- **stopRef 체크 완결성:** `quickSortHelper` 진입부, 매 루프 스텝, `await` 후 총 3곳에서 체크하여 재귀 중단이 촘촘하게 구현됨
- **순수 로직 분리:** `partitionSync` / `mergeSync`를 애니메이션 로직과 분리하여 테스트 가능성을 높인 설계가 우수함
- **불변성 보장:** `setArray([...arr])` 패턴으로 React 상태 불변성을 일관되게 유지함
- **ALGORITHM_MAP 확장:** `Partial<Record<AlgorithmType, SortFn>>` 타입으로 안전하게 5종 알고리즘을 등록함
