# Sprint 3 코드 리뷰 보고서

**리뷰일:** 2026-03-13
**PR:** #3 feat: Sprint 3 완료 - 기본 정렬 알고리즘 3종 시각화 (MVP)
**리뷰 대상 파일:**
- `src/utils/algorithms/types.ts`
- `src/utils/algorithms/bubbleSort.ts`
- `src/utils/algorithms/selectionSort.ts`
- `src/utils/algorithms/insertionSort.ts`
- `src/utils/algorithms/index.ts`
- `src/app/SortingVisualizer.tsx`

---

## 요약

| 등급 | 건수 |
|------|------|
| Critical | 0 |
| Important | 2 |
| Suggestion | 3 |

전반적으로 코드 품질이 양호합니다. 공통 인터페이스(`SortFn`) 기반의 모듈화 구조가 잘 적용되었고, Phase 4 확장을 위한 `ALGORITHM_MAP` 설계가 명확합니다. 중단 신호(`stopRef`) 체크가 매 스텝마다 수행되어 안전성이 확보되어 있습니다.

---

## Important 이슈

### I-1: bubbleSort — stopRef 체크 없이 패스 완료 sorted 표시

**파일:** `src/utils/algorithms/bubbleSort.ts`, 49~54라인

**내용:**
`break outer`로 루프를 탈출해도 외부 루프의 패스 완료 처리 블록이 이미 실행 중인 경우 `setBarStates` 호출이 발생할 수 있습니다. 정확히는 내부 `for` 루프에서 `break outer`를 실행하면 외부 루프를 탈출하므로 49~54라인은 실행되지 않습니다. 단, 내부 루프의 마지막 반복에서 `break outer` 없이 루프를 정상 종료한 경우(j가 n-i-1에 도달), stopRef가 true여도 패스 완료 sorted 표시가 실행됩니다.

```typescript
// 현재 코드 (49~54라인)
// 각 패스 완료 후 정렬된 마지막 요소 표시
setBarStates((prev) => {
  const next = [...prev];
  next[n - 1 - i] = 'sorted';
  return next;
});
```

**권장 수정:** `!stopRef.current` 조건 추가

```typescript
if (!stopRef.current) {
  setBarStates((prev) => {
    const next = [...prev];
    next[n - 1 - i] = 'sorted';
    return next;
  });
}
```

---

### I-2: selectionSort — 내부 루프 중단 시 minIdx 불확정 상태로 swap 진행 가능성

**파일:** `src/utils/algorithms/selectionSort.ts`, 14~46라인

**내용:**
내부 `for` 루프에서 `stopRef.current`가 true일 때 `break`로 탈출하면, 46라인의 `if (stopRef.current) break` 체크에서 외부 루프도 탈출합니다. 따라서 실제로 swap이 잘못 실행되지는 않습니다. 다만, 내부 루프의 마지막 반복(j === n-1)에서 `await sleep` 이후 stopRef가 true가 된 경우, 26라인 체크 없이 28라인의 minIdx 업데이트까지 진행된 후 44라인의 비교가 완료되어 swap이 실행될 수 있습니다.

이 경우 stopRef가 true인 상태에서 swap이 발생하고 60라인의 `await sleep` 이후 46라인에서 break가 실행됩니다. 정렬 중단 시 배열 상태가 의도치 않게 변경될 수 있습니다.

**권장 수정:** `await sleep` 직후 추가 stopRef 체크

```typescript
await sleep(speedToMs(speedRef.current));
if (stopRef.current) break; // 26라인에 이미 존재 - 정상
// 28라인 이후에도 확인 필요
if (current[j] < current[minIdx]) {
  // ...
} else {
  setBarStates(...)
}
// j 루프 종료 후
if (stopRef.current) break; // 46라인 - 정상
if (minIdx !== i) {
  if (stopRef.current) break; // swap 직전 추가 체크 권장
  // swap 실행
}
```

---

## Suggestion

### S-1: types.ts — React 타입 명시적 import 부재

**파일:** `src/utils/algorithms/types.ts`, 4~10라인

**내용:**
`React.MutableRefObject`를 사용하지만 `React`를 import하지 않습니다. Next.js 환경에서는 전역 타입으로 인식되어 빌드 에러가 없지만, 명시적 import를 추가하면 다른 환경으로의 이식성이 향상됩니다.

```typescript
// 권장
import type React from 'react';
```

---

### S-2: insertionSort — 완료 처리 패턴 불일치

**파일:** `src/utils/algorithms/insertionSort.ts`, 74~76라인

**내용:**
bubbleSort와 selectionSort는 마지막 요소만 sorted 표시 후 `completionAnimation`에 웨이브 효과를 위임하지만, insertionSort는 75라인에서 모든 요소를 `prev.map(() => 'sorted')`로 한 번에 sorted 상태로 설정합니다. `completionAnimation`이 이후에 호출되어 시각적으로는 동일하지만, 팀 내 일관성 측면에서 패턴을 통일하는 것이 바람직합니다.

---

### S-3: 알고리즘 파일 주석 부족

**파일:** `src/utils/algorithms/bubbleSort.ts`, `selectionSort.ts`, `insertionSort.ts`

**내용:**
각 함수 상단에 알고리즘 동작 방식과 색상 피드백 정책을 설명하는 JSDoc 주석이 있으면 Phase 4 개발자나 추후 기여자가 색상 패턴을 일관되게 구현하는 데 도움이 됩니다. Sprint 3.md 계획서에 명시된 주석 형식(`비교: comparing, 스왑: swapping, 완료: sorted`)을 실제 코드에도 반영하는 것을 권장합니다.

---

## 긍정적 평가

- `ALGORITHM_MAP` 패턴으로 Phase 4 확장이 단일 파일 수정으로 가능한 설계
- 매 `await sleep` 후 `stopRef.current` 체크로 중단 응답성 확보
- `swap()` 유틸리티를 통한 불변 배열 처리 일관성
- `insertionSort`에서 shift 방식(덮어쓰기)을 올바르게 구현
- Sprint 2 코드 리뷰(I-2) 피드백인 버블 정렬 sorted 마킹 수정 반영
