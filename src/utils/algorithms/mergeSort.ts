import { sleep, speedToMs, markComparing, markSwapping } from "@/utils/animation";
import { BarState } from "@/types";
import { SortFn } from "./types";

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

    setBarStates(markComparing(left + i, mid + 1 + j));
    await sleep(speedToMs(speedRef.current));
    if (stopRef.current) return;

    arr[k] = leftPart[i] <= rightPart[j] ? leftPart[i++] : rightPart[j++];
    setArray([...arr]);
    setBarStates(markSwapping(k));
    k++;
  }

  while (i < leftPart.length) {
    if (stopRef.current) return;
    arr[k] = leftPart[i++];
    setArray([...arr]);
    setBarStates(markSwapping(k));
    k++;
    await sleep(speedToMs(speedRef.current));
  }

  while (j < rightPart.length) {
    if (stopRef.current) return;
    arr[k] = rightPart[j++];
    setArray([...arr]);
    setBarStates(markSwapping(k));
    k++;
    await sleep(speedToMs(speedRef.current));
  }

  // 병합 완료 구간 초록색
  setBarStates((prev) => {
    const next = [...prev];
    for (let idx = left; idx <= right; idx++) next[idx] = 'sorted';
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
