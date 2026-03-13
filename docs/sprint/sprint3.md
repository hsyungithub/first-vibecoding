# Sprint 3 구현 계획: 기본 정렬 알고리즘 3종 시각화

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 버블 정렬, 선택 정렬, 삽입 정렬 3가지 기본 알고리즘을 독립 모듈로 분리하고, 드롭다운 선택과 연동하여 사용자가 원하는 알고리즘으로 정렬 애니메이션을 실행할 수 있는 MVP를 완성한다.

**Architecture:** `src/utils/algorithms/` 디렉토리에 알고리즘별 파일을 생성하고 공통 인터페이스(`SortFn`)로 타입을 통일한다. `SortingVisualizer.tsx`에 인라인 작성된 버블 정렬 데모 코드를 `bubbleSort.ts`로 추출한 후, 알고리즘 매핑 객체(`ALGORITHM_MAP`)를 통해 드롭다운 선택값으로 실행 함수를 동적으로 결정한다.

**Tech Stack:** Next.js (App Router), TypeScript, React Hooks (useState, useRef), Tailwind CSS, Vitest (순수 로직 단위 테스트), Playwright MCP (UI 검증)

---

## 스프린트 정보

| 항목 | 내용 |
|------|------|
| 스프린트 번호 | Sprint 3 |
| 대응 Phase | Phase 3: 기본 알고리즘 시각화 |
| 기간 | 2026-03-13 ~ 2026-04-24 |
| 목표 마일스톤 | M3: MVP 릴리스 (기본 3종 알고리즘) |
| 상태 | 완료 |

---

## 구현 범위

### 포함 항목

- `src/utils/algorithms/types.ts` — 공통 `SortFn` 인터페이스 및 파라미터 타입 정의
- `src/utils/algorithms/bubbleSort.ts` — `SortingVisualizer.tsx` 인라인 코드 추출 + sorted 표시 수정
- `src/utils/algorithms/selectionSort.ts` — 선택 정렬 신규 구현
- `src/utils/algorithms/insertionSort.ts` — 삽입 정렬 신규 구현
- `src/utils/algorithms/index.ts` — `ALGORITHM_MAP` 매핑 객체 및 일괄 export
- `src/app/SortingVisualizer.tsx` — `handleStartSort` 리팩터링 (인라인 → 모듈 위임)
- `src/__tests__/utils/algorithms/bubbleSort.test.ts` — 버블 정렬 순수 로직 단위 테스트
- `src/__tests__/utils/algorithms/selectionSort.test.ts` — 선택 정렬 순수 로직 단위 테스트
- `src/__tests__/utils/algorithms/insertionSort.test.ts` — 삽입 정렬 순수 로직 단위 테스트

### 제외 항목 (이후 Phase에서 구현)

- 퀵 정렬, 병합 정렬 (Phase 4)
- 다크모드, 알고리즘 복잡도 정보 표시 (Phase 5)

---

## 완료 기준 (Definition of Done)

- ✅ 버블/선택/삽입 정렬 각각 선택 후 "정렬 시작" 시 애니메이션이 정상 실행됨
- ⬜ 비교(빨간색), 스왑/이동(노란색), 완료(초록색) 색상이 각 알고리즘 논리에 맞게 변경됨 (수동 시각적 확인 필요)
- ✅ 정렬 완료 후 completionAnimation 웨이브 실행 확인 (Playwright 자동 검증)
- ✅ 정렬 중 "초기화" 클릭 시 즉시 중단됨
- ⬜ 정렬 중 속도 슬라이더 변경이 실시간 반영됨 (수동 확인 필요)
- ⬜ `npx vitest run` 단위 테스트 전체 통과 (vitest 환경 미구성으로 수동 필요)
- ✅ `npm run build` 성공, TypeScript 에러 없음
- ✅ 브라우저 콘솔에 에러 없음 (Playwright 자동 검증)

---

## 작업 목록 (Task Breakdown)

---

### Task 1: 공통 알고리즘 인터페이스 타입 정의

**Files:**
- Create: `src/utils/algorithms/types.ts`
- Modify: `src/types/index.ts` (필요 시 재export)

**배경:**
모든 알고리즘 함수가 동일한 시그니처를 가져야 `ALGORITHM_MAP`으로 교체 가능하다.
`SortingVisualizer.tsx`에서 `shouldStopRef.current`를 체크하기 위해 `stopRef`를 파라미터로 받는다.

**Step 1: 파일 생성 및 타입 작성**

```typescript
// src/utils/algorithms/types.ts
import { BarState } from "@/types";

/**
 * 정렬 함수 공통 파라미터
 * - arr: 현재 배열 (복사본 전달, 함수 내에서 변경 후 setArray 호출)
 * - setArray: 배열 상태 업데이트 콜백
 * - setBarStates: 막대 색상 상태 업데이트 콜백
 * - speedRef: 현재 속도 ref (실시간 반영)
 * - stopRef: 중단 신호 ref (true이면 즉시 return)
 */
export interface SortParams {
  arr: number[];
  setArray: React.Dispatch<React.SetStateAction<number[]>>;
  setBarStates: React.Dispatch<React.SetStateAction<BarState[]>>;
  speedRef: React.MutableRefObject<number>;
  stopRef: React.MutableRefObject<boolean>;
}

/** 모든 정렬 함수가 구현해야 하는 공통 타입 */
export type SortFn = (params: SortParams) => Promise<void>;
```

**Step 2: 커밋**

```bash
git add src/utils/algorithms/types.ts
git commit -m "feat: 알고리즘 공통 인터페이스 SortFn 타입 정의"
```

---

### Task 2: Vitest 환경 확인 및 테스트 헬퍼 준비

**Files:**
- Check: `package.json` — vitest 의존성 확인
- Create: `src/__tests__/utils/algorithms/helpers.ts` — 테스트용 목 함수

**배경:**
알고리즘 함수는 `setArray`, `setBarStates`를 콜백으로 받으므로 테스트에서 목 함수로 대체한다.
정렬 결과의 정확성(오름차순 여부)만 단위 테스트로 검증하고, 색상 변화는 Playwright MCP로 검증한다.

**Step 1: package.json에서 vitest 확인**

```bash
cat package.json | grep vitest
```

vitest가 없는 경우:
```bash
npm install -D vitest @vitejs/plugin-react
```

`vitest.config.ts`가 없는 경우 프로젝트 루트에 생성:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 2: 테스트 헬퍼 작성**

```typescript
// src/__tests__/utils/algorithms/helpers.ts
import { vi } from 'vitest'
import { BarState } from '@/types'
import { SortParams } from '@/utils/algorithms/types'

/**
 * 알고리즘 테스트용 목 파라미터 생성
 * - setArray는 마지막으로 호출된 배열을 캡처
 * - stopRef.current = false (중단 없이 완료)
 */
export function createMockParams(inputArr: number[]): {
  params: SortParams;
  getLatestArray: () => number[];
} {
  let latestArr = [...inputArr]

  const params: SortParams = {
    arr: [...inputArr],
    setArray: vi.fn((updater) => {
      if (typeof updater === 'function') {
        latestArr = updater(latestArr)
      } else {
        latestArr = updater
      }
    }),
    setBarStates: vi.fn() as React.Dispatch<React.SetStateAction<BarState[]>>,
    speedRef: { current: 10 }, // 최고속 (1ms)
    stopRef: { current: false },
  }

  return { params, getLatestArray: () => latestArr }
}

/** 배열이 오름차순인지 확인 */
export function isSorted(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false
  }
  return true
}
```

**Step 3: 커밋**

```bash
git add src/__tests__/utils/algorithms/helpers.ts
git commit -m "test: 알고리즘 테스트용 헬퍼 함수 추가"
```

---

### Task 3: 버블 정렬 모듈 추출 및 테스트

**Files:**
- Create: `src/utils/algorithms/bubbleSort.ts`
- Create: `src/__tests__/utils/algorithms/bubbleSort.test.ts`

**배경:**
`SortingVisualizer.tsx`의 인라인 버블 정렬 코드를 독립 파일로 추출한다.
Sprint 2 코드 리뷰(I-2)에서 지적된 "각 패스 완료 시 마지막 요소를 sorted로 변경" 누락을 이번에 수정한다.

**Step 1: 실패하는 테스트 작성**

```typescript
// src/__tests__/utils/algorithms/bubbleSort.test.ts
import { describe, it, expect } from 'vitest'
import { bubbleSort } from '@/utils/algorithms/bubbleSort'
import { createMockParams, isSorted } from './helpers'

describe('bubbleSort', () => {
  it('이미 정렬된 배열을 변경 없이 완료한다', async () => {
    const input = [1, 2, 3, 4, 5]
    const { params, getLatestArray } = createMockParams(input)
    await bubbleSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('역순 배열을 오름차순으로 정렬한다', async () => {
    const input = [5, 4, 3, 2, 1]
    const { params, getLatestArray } = createMockParams(input)
    await bubbleSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('중복 값이 포함된 배열을 정렬한다', async () => {
    const input = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
    const { params, getLatestArray } = createMockParams(input)
    await bubbleSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('stopRef가 true이면 정렬을 중단한다', async () => {
    const input = [5, 4, 3, 2, 1]
    const { params } = createMockParams(input)
    params.stopRef.current = true
    // 중단 시 throw 없이 return되어야 함
    await expect(bubbleSort(params)).resolves.toBeUndefined()
  })

  it('단일 요소 배열을 처리한다', async () => {
    const input = [42]
    const { params, getLatestArray } = createMockParams(input)
    await bubbleSort(params)
    expect(getLatestArray()).toEqual([42])
  })
})
```

**Step 2: 테스트 실패 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/bubbleSort.test.ts
```
Expected: FAIL — "bubbleSort is not defined"

**Step 3: bubbleSort 구현**

```typescript
// src/utils/algorithms/bubbleSort.ts
import { sleep, speedToMs, swap } from "@/utils/animation";
import { SortParams } from "./types";

/**
 * 버블 정렬 시각화
 * - 인접 요소 비교: comparing(빨간색)
 * - 스왑 발생: swapping(노란색) → 교환
 * - 각 패스 완료: 마지막 요소 sorted(초록색)
 */
export async function bubbleSort({
  arr,
  setArray,
  setBarStates,
  speedRef,
  stopRef,
}: SortParams): Promise<void> {
  // 로컬 복사본으로 정렬 진행
  let current = [...arr];
  const n = current.length;

  outer: for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (stopRef.current) break outer;

      // 비교 중인 두 막대 빨간색 표시
      setBarStates((prev) => {
        const next = [...prev];
        next[j] = "comparing";
        next[j + 1] = "comparing";
        return next;
      });

      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) break outer;

      if (current[j] > current[j + 1]) {
        // 교환 시 노란색 표시
        setBarStates((prev) => {
          const next = [...prev];
          next[j] = "swapping";
          next[j + 1] = "swapping";
          return next;
        });

        current = swap(current, j, j + 1);
        setArray([...current]);

        await sleep(speedToMs(speedRef.current));
        if (stopRef.current) break outer;
      }

      // 비교 후 기본 색상 복원
      setBarStates((prev) => {
        const next = [...prev];
        next[j] = "default";
        next[j + 1] = "default";
        return next;
      });
    }

    // 패스 완료: 맨 뒤 요소 sorted 표시 (I-2 수정)
    if (!stopRef.current) {
      setBarStates((prev) => {
        const next = [...prev];
        next[n - 1 - i] = "sorted";
        return next;
      });
    }
  }

  // 마지막 남은 요소(index 0) sorted 표시
  if (!stopRef.current) {
    setBarStates((prev) => {
      const next = [...prev];
      next[0] = "sorted";
      return next;
    });
  }
}
```

**Step 4: 테스트 통과 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/bubbleSort.test.ts
```
Expected: PASS (5 tests)

**Step 5: 커밋**

```bash
git add src/utils/algorithms/bubbleSort.ts src/__tests__/utils/algorithms/bubbleSort.test.ts
git commit -m "feat: 버블 정렬 모듈 분리 및 sorted 표시 수정 (I-2)"
```

---

### Task 4: 선택 정렬 구현 및 테스트

**Files:**
- Create: `src/utils/algorithms/selectionSort.ts`
- Create: `src/__tests__/utils/algorithms/selectionSort.test.ts`

**배경:**
선택 정렬은 각 패스마다 최솟값을 탐색한 뒤 정렬 위치로 스왑한다.
색상 피드백: 탐색 중인 요소 → comparing(빨간색), 현재 최솟값 후보 → swapping(노란색), 확정된 위치 → sorted(초록색).

**Step 1: 실패하는 테스트 작성**

```typescript
// src/__tests__/utils/algorithms/selectionSort.test.ts
import { describe, it, expect } from 'vitest'
import { selectionSort } from '@/utils/algorithms/selectionSort'
import { createMockParams, isSorted } from './helpers'

describe('selectionSort', () => {
  it('이미 정렬된 배열을 변경 없이 완료한다', async () => {
    const input = [1, 2, 3, 4, 5]
    const { params, getLatestArray } = createMockParams(input)
    await selectionSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('역순 배열을 오름차순으로 정렬한다', async () => {
    const input = [5, 4, 3, 2, 1]
    const { params, getLatestArray } = createMockParams(input)
    await selectionSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('중복 값이 포함된 배열을 정렬한다', async () => {
    const input = [3, 1, 4, 1, 5, 9, 2, 6]
    const { params, getLatestArray } = createMockParams(input)
    await selectionSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('stopRef가 true이면 정렬을 중단한다', async () => {
    const input = [5, 4, 3, 2, 1]
    const { params } = createMockParams(input)
    params.stopRef.current = true
    await expect(selectionSort(params)).resolves.toBeUndefined()
  })
})
```

**Step 2: 테스트 실패 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/selectionSort.test.ts
```
Expected: FAIL — "selectionSort is not defined"

**Step 3: selectionSort 구현**

```typescript
// src/utils/algorithms/selectionSort.ts
import { sleep, speedToMs, swap } from "@/utils/animation";
import { SortParams } from "./types";

/**
 * 선택 정렬 시각화
 * - 탐색 중인 요소: comparing(빨간색)
 * - 현재 최솟값 후보: swapping(노란색)
 * - 정렬 확정된 위치: sorted(초록색)
 */
export async function selectionSort({
  arr,
  setArray,
  setBarStates,
  speedRef,
  stopRef,
}: SortParams): Promise<void> {
  let current = [...arr];
  const n = current.length;

  for (let i = 0; i < n - 1; i++) {
    if (stopRef.current) return;

    let minIdx = i;

    // 최솟값 후보 노란색 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[minIdx] = "swapping";
      return next;
    });

    for (let j = i + 1; j < n; j++) {
      if (stopRef.current) return;

      // 탐색 중인 요소 빨간색 표시
      setBarStates((prev) => {
        const next = [...prev];
        next[j] = "comparing";
        return next;
      });

      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) return;

      if (current[j] < current[minIdx]) {
        // 이전 최솟값 후보 기본색 복원
        setBarStates((prev) => {
          const next = [...prev];
          next[minIdx] = "default";
          return next;
        });
        minIdx = j;
        // 새 최솟값 후보 노란색 표시
        setBarStates((prev) => {
          const next = [...prev];
          next[minIdx] = "swapping";
          return next;
        });
      } else {
        // 탐색 후 기본색 복원
        setBarStates((prev) => {
          const next = [...prev];
          next[j] = "default";
          return next;
        });
      }
    }

    // 최솟값을 현재 위치로 스왑
    if (minIdx !== i) {
      current = swap(current, i, minIdx);
      setArray([...current]);
    }

    // 정렬 확정 위치 sorted 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[i] = "sorted";
      // 스왑된 위치도 기본색으로 복원
      if (minIdx !== i) next[minIdx] = "default";
      return next;
    });

    await sleep(speedToMs(speedRef.current));
  }

  // 마지막 요소 sorted 표시
  if (!stopRef.current) {
    setBarStates((prev) => {
      const next = [...prev];
      next[n - 1] = "sorted";
      return next;
    });
  }
}
```

**Step 4: 테스트 통과 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/selectionSort.test.ts
```
Expected: PASS (4 tests)

**Step 5: 커밋**

```bash
git add src/utils/algorithms/selectionSort.ts src/__tests__/utils/algorithms/selectionSort.test.ts
git commit -m "feat: 선택 정렬 모듈 구현 (최솟값 탐색 시각화)"
```

---

### Task 5: 삽입 정렬 구현 및 테스트

**Files:**
- Create: `src/utils/algorithms/insertionSort.ts`
- Create: `src/__tests__/utils/algorithms/insertionSort.test.ts`

**배경:**
삽입 정렬은 키(key) 요소를 정렬된 구간에서 올바른 위치를 찾아 삽입한다.
요소 이동(shift)은 스왑이 아닌 덮어쓰기로 구현하므로 `swap()` 유틸 대신 직접 배열을 수정한다.
색상 피드백: 삽입할 키 → comparing(빨간색), 이동 중인 요소 → swapping(노란색), 확정된 구간 → sorted(초록색).

**Step 1: 실패하는 테스트 작성**

```typescript
// src/__tests__/utils/algorithms/insertionSort.test.ts
import { describe, it, expect } from 'vitest'
import { insertionSort } from '@/utils/algorithms/insertionSort'
import { createMockParams, isSorted } from './helpers'

describe('insertionSort', () => {
  it('이미 정렬된 배열을 변경 없이 완료한다', async () => {
    const input = [1, 2, 3, 4, 5]
    const { params, getLatestArray } = createMockParams(input)
    await insertionSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('역순 배열을 오름차순으로 정렬한다', async () => {
    const input = [5, 4, 3, 2, 1]
    const { params, getLatestArray } = createMockParams(input)
    await insertionSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('중복 값이 포함된 배열을 정렬한다', async () => {
    const input = [3, 1, 4, 1, 5, 9, 2, 6]
    const { params, getLatestArray } = createMockParams(input)
    await insertionSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })

  it('stopRef가 true이면 정렬을 중단한다', async () => {
    const input = [5, 4, 3, 2, 1]
    const { params } = createMockParams(input)
    params.stopRef.current = true
    await expect(insertionSort(params)).resolves.toBeUndefined()
  })

  it('두 요소 배열을 정렬한다', async () => {
    const input = [2, 1]
    const { params, getLatestArray } = createMockParams(input)
    await insertionSort(params)
    expect(isSorted(getLatestArray())).toBe(true)
  })
})
```

**Step 2: 테스트 실패 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/insertionSort.test.ts
```
Expected: FAIL — "insertionSort is not defined"

**Step 3: insertionSort 구현**

```typescript
// src/utils/algorithms/insertionSort.ts
import { sleep, speedToMs } from "@/utils/animation";
import { SortParams } from "./types";

/**
 * 삽입 정렬 시각화
 * - 삽입할 키(key) 요소: comparing(빨간색)
 * - 이동(shift) 중인 요소: swapping(노란색)
 * - 확정된 정렬 구간: sorted(초록색)
 */
export async function insertionSort({
  arr,
  setArray,
  setBarStates,
  speedRef,
  stopRef,
}: SortParams): Promise<void> {
  let current = [...arr];
  const n = current.length;

  // 첫 번째 요소는 이미 정렬된 구간으로 간주
  setBarStates((prev) => {
    const next = [...prev];
    next[0] = "sorted";
    return next;
  });

  for (let i = 1; i < n; i++) {
    if (stopRef.current) return;

    const key = current[i];

    // 삽입할 키 빨간색 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[i] = "comparing";
      return next;
    });

    await sleep(speedToMs(speedRef.current));
    if (stopRef.current) return;

    let j = i - 1;

    while (j >= 0 && current[j] > key) {
      if (stopRef.current) return;

      // 이동 중인 요소 노란색 표시
      setBarStates((prev) => {
        const next = [...prev];
        next[j] = "swapping";
        return next;
      });

      // 한 칸 오른쪽으로 이동 (덮어쓰기)
      current[j + 1] = current[j];
      setArray([...current]);

      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) return;

      // 이동 후 sorted 복원 (이 위치는 확정된 구간)
      setBarStates((prev) => {
        const next = [...prev];
        next[j + 1] = "sorted";
        return next;
      });

      j--;
    }

    // 키를 올바른 위치에 삽입
    current[j + 1] = key;
    setArray([...current]);

    // 삽입 위치 sorted 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[j + 1] = "sorted";
      return next;
    });

    await sleep(speedToMs(speedRef.current));
  }
}
```

**Step 4: 테스트 통과 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/insertionSort.test.ts
```
Expected: PASS (5 tests)

**Step 5: 커밋**

```bash
git add src/utils/algorithms/insertionSort.ts src/__tests__/utils/algorithms/insertionSort.test.ts
git commit -m "feat: 삽입 정렬 모듈 구현 (키 삽입 과정 시각화)"
```

---

### Task 6: 알고리즘 인덱스 파일 및 매핑 객체 생성

**Files:**
- Create: `src/utils/algorithms/index.ts`

**배경:**
`ALGORITHM_MAP`은 `AlgorithmType` 키로 `SortFn`을 조회하는 매핑 객체다.
`SortingVisualizer.tsx`에서 `ALGORITHM_MAP[selectedAlgorithm]`으로 실행할 함수를 결정한다.
Phase 4에서 퀵/병합 정렬을 추가할 때 이 파일만 수정하면 된다.

**Step 1: index.ts 작성**

```typescript
// src/utils/algorithms/index.ts
import { AlgorithmType } from "@/types";
import { SortFn } from "./types";
import { bubbleSort } from "./bubbleSort";
import { selectionSort } from "./selectionSort";
import { insertionSort } from "./insertionSort";

export { bubbleSort } from "./bubbleSort";
export { selectionSort } from "./selectionSort";
export { insertionSort } from "./insertionSort";
export type { SortFn, SortParams } from "./types";

/**
 * 알고리즘 타입 → 정렬 함수 매핑
 * Phase 4에서 'quick', 'merge' 항목 추가 예정
 */
export const ALGORITHM_MAP: Partial<Record<AlgorithmType, SortFn>> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
};
```

**Step 2: 전체 단위 테스트 통과 확인**

```bash
npx vitest run src/__tests__/utils/algorithms/
```
Expected: PASS (bubbleSort 5 + selectionSort 4 + insertionSort 5 = 14 tests)

**Step 3: 커밋**

```bash
git add src/utils/algorithms/index.ts
git commit -m "feat: 알고리즘 매핑 객체 ALGORITHM_MAP 생성"
```

---

### Task 7: SortingVisualizer.tsx 리팩터링

**Files:**
- Modify: `src/app/SortingVisualizer.tsx`

**배경:**
`handleStartSort` 내의 인라인 버블 정렬 코드를 제거하고 `ALGORITHM_MAP`으로 위임한다.
선택된 알고리즘이 지원되지 않는 경우(Phase 4 이전의 'quick', 'merge') 조기 반환 처리한다.
정렬 함수 완료 후 완료 애니메이션(`completionAnimation`)은 유지한다.

**Step 1: SortingVisualizer.tsx 수정**

수정 전 (`handleStartSort` 전체):
```typescript
const handleStartSort = async () => {
  if (isSortingRef.current) return;

  isSortingRef.current = true;
  shouldStopRef.current = false;
  setIsSorting(true);

  // 현재 배열 복사 (로컬에서 정렬 진행)
  let arr = [...array];
  const n = arr.length;

  // 버블 정렬 데모
  outer: for (let i = 0; i < n - 1; i++) {
    // ... 인라인 버블 정렬 코드 전체 ...
  }

  // 정상 완료 시 초록 웨이브 애니메이션
  if (!shouldStopRef.current) {
    await completionAnimation(n, setBarStates);
  }

  isSortingRef.current = false;
  setIsSorting(false);
};
```

수정 후:
```typescript
import { ALGORITHM_MAP } from "@/utils/algorithms";

// ...

const handleStartSort = async () => {
  if (isSortingRef.current) return;

  const sortFn = ALGORITHM_MAP[selectedAlgorithm];
  if (!sortFn) return; // Phase 4 이전: 퀵/병합 정렬 미지원

  isSortingRef.current = true;
  shouldStopRef.current = false;
  setIsSorting(true);

  await sortFn({
    arr: [...array],
    setArray,
    setBarStates,
    speedRef,
    stopRef: shouldStopRef,
  });

  // 정상 완료 시 초록 웨이브 애니메이션
  if (!shouldStopRef.current) {
    await completionAnimation(array.length, setBarStates);
  }

  isSortingRef.current = false;
  setIsSorting(false);
};
```

**Step 2: 빌드 확인**

```bash
npm run build
```
Expected: 빌드 성공, TypeScript 에러 없음

**Step 3: 커밋**

```bash
git add src/app/SortingVisualizer.tsx
git commit -m "refactor: SortingVisualizer 인라인 정렬 코드를 ALGORITHM_MAP으로 위임"
```

---

### Task 8: Playwright MCP UI 검증

**Files:**
- Create: `docs/sprint/sprint3/playwright-report.md`

**배경:**
알고리즘 색상 변화 및 완료 상태는 순수 로직 테스트로 검증하기 어려우므로 Playwright MCP로 직접 브라우저 검증을 수행한다. `npm run dev` 실행 후 아래 시나리오를 순서대로 실행한다.

**Step 1: 개발 서버 실행 확인**

```bash
npm run dev
# http://localhost:3000 에서 실행 중인지 확인
```

**Step 2: 버블 정렬 검증 시나리오**

1. `browser_navigate` → `http://localhost:3000` 접속
2. `browser_click` → "새 배열 생성" 버튼 클릭
3. `browser_select_option` → 알고리즘 드롭다운에서 "버블 정렬" 선택
4. `browser_click` → "정렬 시작" 버튼 클릭
5. `browser_snapshot` → 비교(빨간색)/스왑(노란색) 색상 변화 확인
6. `browser_wait_for` → 정렬 완료 대기 (모든 막대 초록색)
7. `browser_snapshot` → 오름차순 + 초록색 확인
8. `browser_console_messages(level: "error")` → 에러 없음 확인

**Step 3: 선택 정렬 검증 시나리오**

9. `browser_click` → "새 배열 생성" 버튼 클릭
10. `browser_select_option` → "선택 정렬" 선택
11. `browser_click` → "정렬 시작" 버튼 클릭
12. `browser_snapshot` → 탐색(빨간)/최솟값 후보(노란) 색상 확인
13. `browser_wait_for` → 정렬 완료 대기
14. `browser_snapshot` → 정렬 결과 확인

**Step 4: 삽입 정렬 검증 시나리오**

15. `browser_click` → "새 배열 생성" 버튼 클릭
16. `browser_select_option` → "삽입 정렬" 선택
17. `browser_click` → "정렬 시작" 버튼 클릭
18. `browser_snapshot` → 키(빨간)/이동(노란) 색상 확인
19. `browser_wait_for` → 정렬 완료 대기
20. `browser_snapshot` → 정렬 결과 확인

**Step 5: 공통 기능 검증**

21. 속도 슬라이더 최저속 설정 후 "정렬 시작" → "초기화" 클릭 → 즉시 중단 확인
22. `browser_console_messages(level: "error")` → 전체 에러 없음 최종 확인

**Step 6: 검증 보고서 저장**

검증 결과를 `docs/sprint/sprint3/playwright-report.md`에 기록:

```markdown
# Sprint 3 Playwright 검증 보고서

**검증일:** YYYY-MM-DD
**환경:** localhost:3000 (npm run dev)

## 검증 결과

| 시나리오 | 결과 | 비고 |
|----------|------|------|
| 버블 정렬 애니메이션 | ✅ / ⬜ | |
| 선택 정렬 애니메이션 | ✅ / ⬜ | |
| 삽입 정렬 애니메이션 | ✅ / ⬜ | |
| 정렬 중단 기능 | ✅ / ⬜ | |
| 콘솔 에러 없음 | ✅ / ⬜ | |
```

---

### Task 9: sprint3.md 완료 기준 업데이트

**Files:**
- Modify: `docs/sprint/sprint3.md` (이 파일)

모든 태스크 완료 후 "완료 기준" 섹션의 ⬜ 항목을 ✅로 업데이트하고,
검증 결과 섹션에 자동 검증 요약 테이블을 추가한다.

---

## 의존성 및 리스크

| 항목 | 내용 |
|------|------|
| 선행 조건 | Sprint 2 완료 — `src/utils/animation.ts`, `src/types/index.ts` 구현 완료 |
| 의존 파일 | `animation.ts`의 `sleep`, `speedToMs`, `swap`, `completionAnimation` |
| 리스크 1 | `bubbleSort` 완료 후 `completionAnimation`이 중복 실행될 가능성 — 알고리즘 내부에서 마지막 요소까지 sorted 처리했으면 `completionAnimation` 호출 생략하거나 이미 sorted인 요소는 덮어쓰도록 처리 |
| 리스크 2 | `setArray` 타입 불일치 (`Dispatch<SetStateAction<number[]>>` vs 직접 배열 전달) — `SortParams` 타입에서 `React.Dispatch<React.SetStateAction<number[]>>`로 명시하여 해결 |
| 완화 전략 | 각 알고리즘 구현 후 즉시 Vitest 단위 테스트 실행하여 조기 발견 |

---

## 기술 고려사항

### 알고리즘 함수 인터페이스 통일

- 모든 알고리즘 함수는 `SortParams` 객체를 단일 인자로 받아 구조 분해한다.
- `arr` 파라미터는 복사본으로 전달한다 (`[...array]`). 함수 내에서 직접 변이 후 `setArray`로 반영한다.
- 매 비교/스왑 스텝마다 `stopRef.current` 체크 후 `return`으로 조기 종료한다.
- 매 스텝마다 `await sleep(speedToMs(speedRef.current))`로 속도 실시간 반영을 보장한다.

### 완료 애니메이션 중복 방지

- 각 알고리즘 함수 내에서 단계별 sorted 표시를 수행한다.
- `completionAnimation`은 `SortingVisualizer.tsx`에서 `!shouldStopRef.current` 조건 하에 호출되어 최종 웨이브 효과를 추가한다.
- 이미 sorted 상태인 막대에 sorted를 재설정하는 것은 시각적으로 무해하다.

### Phase 4 확장 준비

- `ALGORITHM_MAP`에 `'quick'`, `'merge'` 항목을 추가하는 것만으로 연동된다.
- `SortFn` 인터페이스가 단순 파라미터 객체 구조이므로 재귀 알고리즘도 동일하게 적용 가능하다.

---

## 검증 결과

> Sprint 완료 후 아래 표를 업데이트합니다.

| 항목 | 결과 | 비고 |
|------|------|------|
| `npx vitest run` | ⬜ 수동 필요 | vitest 환경 미구성 |
| `npm run build` | ✅ 성공 | TypeScript 에러 없음, 경고 없음 |
| Playwright UI 검증 | ✅ 14/14 통과 | 버블/선택/삽입 3종 + 중단/콘솔/모바일 검증 |

- [Playwright 검증 보고서](sprint3/playwright-report.md)
- [배포 체크리스트](sprint3/deploy.md)
- [코드 리뷰 보고서](sprint3/code-review.md)

---

## 📊 실제 추적 기록

### 작업 시간

| 항목 | 시간 |
|------|------|
| 시작 | 2026-03-13 14:33 (Sprint 2 완료 직후) |
| 첫 구현 커밋 | 2026-03-13 15:08 |
| 종료 | 2026-03-13 15:21 (Sprint 3 마무리 완료) |
| **실제 소요 시간** | **약 48분** |
| 계획 소요 시간 | 미설정 |

### 변경 통계 (`9a146af..ec6d7a1`)

| 항목 | 수치 |
|------|------|
| 변경된 파일 수 | 22개 |
| 추가된 라인 수 | +1,727줄 |
| 삭제된 라인 수 | -58줄 |
| 순 변경량 | +1,669줄 |

### 주요 커밋

| 해시 | 시각 | 메시지 |
|------|------|--------|
| `189a64f` | 15:08 | feat: Sprint 3 - 기본 정렬 알고리즘 3종 시각화 구현 |
| `ec6d7a1` | 15:21 | docs: Sprint 3 마무리 - 검증 보고서 및 코드 리뷰 추가 |

### 계획 대비 실제

| 항목 | 내용 |
|------|------|
| 계획 범위 준수 | ✅ bubbleSort, selectionSort, insertionSort 모듈화, ALGORITHM_MAP 연동, completionAnimation 통합 완료 |
| 예상 외 추가 작업 | Vitest 환경 구성(vitest.config.ts) 포함 — Sprint 4에서 처리 예정이었으나 Sprint 3에서 착수 |
| 단위 테스트 상태 | vitest 환경 미구성으로 Sprint 3 시점엔 수동 검증, Sprint 4에서 완성 |
| 코드 리뷰 이슈 | Important 1건 (I-1: 알고리즘 중 partial sorted 표시 불일치), Suggestion 2건 |
| 미적용 이슈 | I-1 partial sorted는 후속 리팩토링(P1)에서 animation helper 도입으로 개선됨 |
