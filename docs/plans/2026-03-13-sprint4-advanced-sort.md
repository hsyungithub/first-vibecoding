# Sprint 4: 고급 알고리즘 시각화 (Quick Sort + Merge Sort) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 퀵 정렬과 병합 정렬을 시각화 모듈로 구현하고 드롭다운 연동하여 5종 알고리즘 완성

**Architecture:** 기존 `SortFn` 인터페이스를 그대로 재사용. 재귀 알고리즘은 내부적으로 index 기반 헬퍼 함수를 분리하여 순수 로직을 Vitest로 검증하고 애니메이션 래퍼는 Playwright MCP로 검증. `ALGORITHM_MAP`에 두 키만 추가하면 드롭다운 연동 완료.

**Tech Stack:** Next.js 16, TypeScript, Vitest (신규 설치), Playwright MCP

---

## 현재 파일 구조 (참고)

```
src/
  types/index.ts                     ← AlgorithmType, BarState, BAR_STATE_COLORS 등
  utils/
    animation.ts                     ← sleep, speedToMs, swap, completionAnimation
    algorithms/
      types.ts                       ← SortFn 인터페이스
      bubbleSort.ts                  ← 버블 정렬 (참고용)
      selectionSort.ts               ← 선택 정렬 (참고용)
      insertionSort.ts               ← 삽입 정렬 (참고용)
      index.ts                       ← ALGORITHM_MAP (bubble, selection, insertion)
  app/
    SortingVisualizer.tsx            ← ALGORITHM_MAP으로 알고리즘 실행
```

## SortFn 인터페이스 (참고)

```typescript
// src/utils/algorithms/types.ts
export type SortFn = (
  arr: number[],
  setArray: (arr: number[]) => void,
  setBarStates: (updater: (prev: BarState[]) => BarState[]) => void,
  speedRef: React.MutableRefObject<number>,
  stopRef: React.MutableRefObject<boolean>
) => Promise<void>;
```

## 색상 규칙 (기존 패턴 준수)

| BarState | 색상 | 의미 |
|----------|------|------|
| `default` | 파스텔 블루 | 기본 |
| `comparing` | 파스텔 레드 | 비교 중 |
| `swapping` | 파스텔 옐로 | 피벗/이동 중 |
| `sorted` | 파스텔 그린 | 정렬 완료 |

---

## Task 1: Vitest 설치 및 설정

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

**Step 1: Vitest 설치**

```bash
npm install -D vitest @vitest/ui
```

Expected: package.json에 vitest devDependency 추가됨

**Step 2: vitest.config.ts 생성**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: package.json에 test 스크립트 추가**

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "vitest run"
}
```

**Step 4: 동작 확인**

```bash
npx vitest run
```

Expected: "No test files found" 또는 0 tests passed (에러 없이 종료)

**Step 5: 커밋**

```bash
git add vitest.config.ts package.json package-lock.json
git commit -m "chore: Vitest 테스트 환경 설정"
```

---

## Task 2: 퀵 정렬 순수 로직 TDD

퀵 정렬의 핵심인 `partition` 함수를 먼저 순수 함수로 분리하여 테스트한 후, 애니메이션 래퍼를 구현한다.

**Files:**
- Create: `src/utils/algorithms/quickSort.ts`
- Create: `src/__tests__/utils/algorithms/quickSort.test.ts`

### Step 1: 실패하는 테스트 작성

```typescript
// src/__tests__/utils/algorithms/quickSort.test.ts
import { describe, it, expect } from 'vitest'
import { partitionSync } from '@/utils/algorithms/quickSort'

describe('partitionSync', () => {
  it('마지막 요소를 피벗으로 파티션 후 피벗 인덱스를 반환한다', () => {
    const arr = [3, 1, 4, 1, 5]
    // 피벗 = 5, 모든 요소가 피벗보다 작으므로 피벗은 마지막 위치(4)에
    const pivotIdx = partitionSync(arr, 0, 4)
    expect(pivotIdx).toBe(4)
    expect(arr[4]).toBe(5)
  })

  it('피벗 왼쪽은 피벗보다 작거나 같고 오른쪽은 크다', () => {
    const arr = [3, 6, 8, 10, 1, 2, 1]
    const pivotIdx = partitionSync(arr, 0, arr.length - 1)
    const pivot = arr[pivotIdx]
    for (let i = 0; i < pivotIdx; i++) {
      expect(arr[i]).toBeLessThanOrEqual(pivot)
    }
    for (let i = pivotIdx + 1; i < arr.length; i++) {
      expect(arr[i]).toBeGreaterThan(pivot)
    }
  })

  it('이미 정렬된 배열도 올바르게 파티션한다', () => {
    const arr = [1, 2, 3, 4, 5]
    const pivotIdx = partitionSync(arr, 0, 4)
    expect(arr[pivotIdx]).toBe(5)
  })

  it('단일 요소 배열은 인덱스 0을 반환한다', () => {
    const arr = [42]
    const pivotIdx = partitionSync(arr, 0, 0)
    expect(pivotIdx).toBe(0)
  })
})
```

**Step 2: 테스트 실패 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/quickSort.test.ts
```

Expected: FAIL — `partitionSync is not exported`

**Step 3: quickSort.ts 구현**

```typescript
// src/utils/algorithms/quickSort.ts
import { sleep, speedToMs } from "@/utils/animation";
import { SortFn } from "./types";

/**
 * Lomuto 파티션 (순수 동기 함수 — 테스트용)
 * arr을 in-place 수정하고 피벗의 최종 인덱스를 반환
 */
export function partitionSync(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

/** 애니메이션을 포함한 재귀 퀵 정렬 헬퍼 */
async function quickSortHelper(
  arr: number[],
  low: number,
  high: number,
  setArray: (arr: number[]) => void,
  setBarStates: (updater: (prev: import("@/types").BarState[]) => import("@/types").BarState[]) => void,
  speedRef: React.MutableRefObject<number>,
  stopRef: React.MutableRefObject<boolean>
): Promise<void> {
  if (low >= high || stopRef.current) return;

  const pivot = arr[high];
  let i = low - 1;

  // 피벗을 노란색으로 강조
  setBarStates((prev) => {
    const next = [...prev];
    next[high] = 'swapping';
    return next;
  });

  for (let j = low; j < high; j++) {
    if (stopRef.current) return;

    // 현재 비교 요소 빨간색
    setBarStates((prev) => {
      const next = [...prev];
      next[j] = 'comparing';
      return next;
    });

    await sleep(speedToMs(speedRef.current));
    if (stopRef.current) return;

    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setArray([...arr]);

      // 교환된 요소 표시
      setBarStates((prev) => {
        const next = [...prev];
        next[i] = 'swapping';
        next[j] = 'default';
        return next;
      });

      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) return;
    } else {
      // 비교 후 복원
      setBarStates((prev) => {
        const next = [...prev];
        next[j] = 'default';
        return next;
      });
    }
  }

  // 피벗을 최종 위치로
  const pivotIdx = i + 1;
  [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];
  setArray([...arr]);

  // 피벗 위치 정렬 완료 표시
  setBarStates((prev) => {
    const next = [...prev];
    next[pivotIdx] = 'sorted';
    // 이전에 swapping으로 표시된 high 복원
    if (next[high] === 'swapping') next[high] = 'default';
    // i+1 범위의 swapping 상태도 복원
    for (let k = low; k <= high; k++) {
      if (next[k] === 'swapping' && k !== pivotIdx) next[k] = 'default';
    }
    return next;
  });

  await sleep(speedToMs(speedRef.current));
  if (stopRef.current) return;

  await quickSortHelper(arr, low, pivotIdx - 1, setArray, setBarStates, speedRef, stopRef);
  await quickSortHelper(arr, pivotIdx + 1, high, setArray, setBarStates, speedRef, stopRef);
}

/** 퀵 정렬 — SortFn 인터페이스 구현 */
export const quickSort: SortFn = async (arr, setArray, setBarStates, speedRef, stopRef) => {
  const current = [...arr];
  await quickSortHelper(current, 0, current.length - 1, setArray, setBarStates, speedRef, stopRef);

  // 정상 완료 시 정렬되지 않은 막대를 sorted로 표시
  if (!stopRef.current) {
    setBarStates((prev) => prev.map((s) => (s === 'default' ? 'sorted' : s)));
  }
};
```

**Step 4: 테스트 통과 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/quickSort.test.ts
```

Expected: PASS — 4 tests passed

**Step 5: 커밋**

```bash
git add src/utils/algorithms/quickSort.ts src/__tests__/utils/algorithms/quickSort.test.ts
git commit -m "feat: 퀵 정렬 구현 (partitionSync 유닛 테스트 포함)"
```

---

## Task 3: 병합 정렬 순수 로직 TDD

**Files:**
- Create: `src/utils/algorithms/mergeSort.ts`
- Create: `src/__tests__/utils/algorithms/mergeSort.test.ts`

### Step 1: 실패하는 테스트 작성

```typescript
// src/__tests__/utils/algorithms/mergeSort.test.ts
import { describe, it, expect } from 'vitest'
import { mergeSync } from '@/utils/algorithms/mergeSort'

describe('mergeSync', () => {
  it('두 정렬된 구간을 하나로 병합한다', () => {
    const arr = [1, 3, 5, 2, 4, 6]
    mergeSync(arr, 0, 2, 5)
    expect(arr).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('단일 요소 구간 병합', () => {
    const arr = [2, 1]
    mergeSync(arr, 0, 0, 1)
    expect(arr).toEqual([1, 2])
  })

  it('이미 정렬된 구간은 변경되지 않는다', () => {
    const arr = [1, 2, 3, 4]
    mergeSync(arr, 0, 1, 3)
    expect(arr).toEqual([1, 2, 3, 4])
  })

  it('모든 왼쪽 요소가 오른쪽보다 큰 경우', () => {
    const arr = [3, 4, 1, 2]
    mergeSync(arr, 0, 1, 3)
    expect(arr).toEqual([1, 2, 3, 4])
  })
})
```

**Step 2: 테스트 실패 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/mergeSort.test.ts
```

Expected: FAIL — `mergeSync is not exported`

**Step 3: mergeSort.ts 구현**

```typescript
// src/utils/algorithms/mergeSort.ts
import { sleep, speedToMs } from "@/utils/animation";
import { SortFn } from "./types";
import { BarState } from "@/types";

/**
 * 순수 동기 병합 함수 (테스트용)
 * arr[left..mid]와 arr[mid+1..right]를 in-place 병합
 */
export function mergeSync(arr: number[], left: number, mid: number, right: number): void {
  const leftPart = arr.slice(left, mid + 1);
  const rightPart = arr.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  while (i < leftPart.length && j < rightPart.length) {
    if (leftPart[i] <= rightPart[j]) {
      arr[k++] = leftPart[i++];
    } else {
      arr[k++] = rightPart[j++];
    }
  }

  while (i < leftPart.length) arr[k++] = leftPart[i++];
  while (j < rightPart.length) arr[k++] = rightPart[j++];
}

/** 애니메이션을 포함한 병합 함수 */
async function mergeAnimated(
  arr: number[],
  left: number,
  mid: number,
  right: number,
  setArray: (arr: number[]) => void,
  setBarStates: (updater: (prev: BarState[]) => BarState[]) => void,
  speedRef: React.MutableRefObject<number>,
  stopRef: React.MutableRefObject<boolean>
): Promise<void> {
  const leftPart = arr.slice(left, mid + 1);
  const rightPart = arr.slice(mid + 1, right + 1);

  let i = 0, j = 0, k = left;

  while (i < leftPart.length && j < rightPart.length) {
    if (stopRef.current) return;

    // 비교 중인 두 요소 빨간색
    const leftIdx = left + i;
    const rightIdx = mid + 1 + j;

    setBarStates((prev) => {
      const next = [...prev];
      next[leftIdx] = 'comparing';
      next[rightIdx] = 'comparing';
      return next;
    });

    await sleep(speedToMs(speedRef.current));
    if (stopRef.current) return;

    if (leftPart[i] <= rightPart[j]) {
      arr[k] = leftPart[i++];
    } else {
      arr[k] = rightPart[j++];
    }

    setArray([...arr]);

    // 배치된 요소 노란색으로 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[k] = 'swapping';
      return next;
    });

    k++;
  }

  while (i < leftPart.length) {
    if (stopRef.current) return;
    arr[k] = leftPart[i++];
    setArray([...arr]);
    setBarStates((prev) => {
      const next = [...prev];
      next[k] = 'swapping';
      return next;
    });
    k++;
    await sleep(speedToMs(speedRef.current));
  }

  while (j < rightPart.length) {
    if (stopRef.current) return;
    arr[k] = rightPart[j++];
    setArray([...arr]);
    setBarStates((prev) => {
      const next = [...prev];
      next[k] = 'swapping';
      return next;
    });
    k++;
    await sleep(speedToMs(speedRef.current));
  }

  // 병합 완료된 구간 초록색으로 전환
  setBarStates((prev) => {
    const next = [...prev];
    for (let idx = left; idx <= right; idx++) {
      next[idx] = 'sorted';
    }
    return next;
  });

  await sleep(speedToMs(speedRef.current));
}

/** 재귀 병합 정렬 헬퍼 */
async function mergeSortHelper(
  arr: number[],
  left: number,
  right: number,
  setArray: (arr: number[]) => void,
  setBarStates: (updater: (prev: BarState[]) => BarState[]) => void,
  speedRef: React.MutableRefObject<number>,
  stopRef: React.MutableRefObject<boolean>
): Promise<void> {
  if (left >= right || stopRef.current) return;

  const mid = Math.floor((left + right) / 2);

  await mergeSortHelper(arr, left, mid, setArray, setBarStates, speedRef, stopRef);
  await mergeSortHelper(arr, mid + 1, right, setArray, setBarStates, speedRef, stopRef);
  await mergeAnimated(arr, left, mid, right, setArray, setBarStates, speedRef, stopRef);
}

/** 병합 정렬 — SortFn 인터페이스 구현 */
export const mergeSort: SortFn = async (arr, setArray, setBarStates, speedRef, stopRef) => {
  const current = [...arr];
  await mergeSortHelper(current, 0, current.length - 1, setArray, setBarStates, speedRef, stopRef);
};
```

**Step 4: 테스트 통과 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/mergeSort.test.ts
```

Expected: PASS — 4 tests passed

**Step 5: 커밋**

```bash
git add src/utils/algorithms/mergeSort.ts src/__tests__/utils/algorithms/mergeSort.test.ts
git commit -m "feat: 병합 정렬 구현 (mergeSync 유닛 테스트 포함)"
```

---

## Task 4: ALGORITHM_MAP 업데이트

**Files:**
- Modify: `src/utils/algorithms/index.ts`

**Step 1: quickSort, mergeSort 추가**

```typescript
// src/utils/algorithms/index.ts
import { AlgorithmType } from "@/types";
import { SortFn } from "./types";
import { bubbleSort } from "./bubbleSort";
import { selectionSort } from "./selectionSort";
import { insertionSort } from "./insertionSort";
import { quickSort } from "./quickSort";
import { mergeSort } from "./mergeSort";

/** 알고리즘 타입 → 정렬 함수 매핑 */
export const ALGORITHM_MAP: Partial<Record<AlgorithmType, SortFn>> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  quick: quickSort,
  merge: mergeSort,
};

export type { SortFn } from "./types";
```

**Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공, TypeScript 에러 없음

**Step 3: 커밋**

```bash
git add src/utils/algorithms/index.ts
git commit -m "feat: ALGORITHM_MAP에 퀵/병합 정렬 추가"
```

---

## Task 5: Playwright MCP UI 검증

`npm run dev` 실행 상태에서 Playwright MCP 도구로 직접 검증.

**검증 항목:**

1. `browser_navigate` → `http://localhost:3000`
2. 드롭다운에서 "퀵 정렬" 선택 → "정렬 시작" → 애니메이션 확인 → 완료 후 오름차순 확인
3. "새 배열 생성" → "병합 정렬" 선택 → "정렬 시작" → 완료 확인
4. 정렬 중 "초기화" 버튼으로 중단 확인
5. `browser_console_messages(level: "error")` → 콘솔 에러 없음 확인

결과를 `docs/sprint/sprint4/playwright-report.md`에 저장.

---

## Task 6: sprint-close 에이전트로 마무리

- ROADMAP Phase 4 완료 표시
- 변경 사항 커밋 (sprint4 브랜치)
- PR 생성 (sprint4 → main)
- 코드 리뷰
- `docs/deploy.md` 업데이트
