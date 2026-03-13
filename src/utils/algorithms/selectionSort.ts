import { sleep, speedToMs, swap } from "@/utils/animation";
import { SortFn } from "./types";

/** 선택 정렬 */
export const selectionSort: SortFn = async (arr, setArray, setBarStates, speedRef, stopRef) => {
  let current = [...arr];
  const n = current.length;

  for (let i = 0; i < n - 1; i++) {
    if (stopRef.current) break;

    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (stopRef.current) break;

      // 현재 최솟값 후보와 비교 중인 요소 표시
      setBarStates((prev) => {
        const next = [...prev];
        next[minIdx] = 'comparing';
        next[j] = 'comparing';
        return next;
      });

      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) break;

      if (current[j] < current[minIdx]) {
        // 이전 최솟값 색상 복원
        setBarStates((prev) => {
          const next = [...prev];
          next[minIdx] = 'default';
          return next;
        });
        minIdx = j;
      } else {
        // 비교 요소 색상 복원
        setBarStates((prev) => {
          const next = [...prev];
          next[j] = 'default';
          return next;
        });
      }
    }

    if (stopRef.current) break;

    // 최솟값 위치에 교환
    if (minIdx !== i) {
      setBarStates((prev) => {
        const next = [...prev];
        next[i] = 'swapping';
        next[minIdx] = 'swapping';
        return next;
      });

      current = swap(current, i, minIdx);
      setArray([...current]);

      await sleep(speedToMs(speedRef.current));
    }

    // 현재 위치 정렬 완료 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[i] = 'sorted';
      if (minIdx !== i) next[minIdx] = 'default';
      return next;
    });
  }

  // 마지막 요소 정렬 완료 표시
  if (!stopRef.current) {
    setBarStates((prev) => {
      const next = [...prev];
      next[n - 1] = 'sorted';
      return next;
    });
  }
};
