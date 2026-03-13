import { sleep, speedToMs } from "@/utils/animation";
import { BarState } from "@/types";
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
  setBarStates: (updater: (prev: BarState[]) => BarState[]) => void,
  speedRef: React.MutableRefObject<number>,
  stopRef: React.MutableRefObject<boolean>
): Promise<void> {
  if (low >= high || stopRef.current) return;

  let i = low - 1;

  // 피벗을 노란색으로 강조
  setBarStates((prev) => {
    const next = [...prev];
    next[high] = 'swapping';
    return next;
  });

  for (let j = low; j < high; j++) {
    if (stopRef.current) return;

    setBarStates((prev) => {
      const next = [...prev];
      next[j] = 'comparing';
      return next;
    });

    await sleep(speedToMs(speedRef.current));
    if (stopRef.current) return;

    if (arr[j] <= arr[high]) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setArray([...arr]);

      setBarStates((prev) => {
        const next = [...prev];
        next[i] = 'swapping';
        next[j] = 'default';
        return next;
      });

      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) return;
    } else {
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

  setBarStates((prev) => {
    const next = [...prev];
    next[pivotIdx] = 'sorted';
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

  if (!stopRef.current) {
    setBarStates((prev) => prev.map((s) => (s === 'default' ? 'sorted' : s)));
  }
};
