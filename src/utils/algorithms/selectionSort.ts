import { sleep, speedToMs, swap, markComparing, markSwapping, markSorted, markDefault } from "@/utils/animation";
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

      setBarStates(markComparing(minIdx, j));
      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) break;

      if (current[j] < current[minIdx]) {
        setBarStates(markDefault(minIdx));
        minIdx = j;
      } else {
        setBarStates(markDefault(j));
      }
    }

    if (stopRef.current) break;

    if (minIdx !== i) {
      setBarStates(markSwapping(i, minIdx));
      current = swap(current, i, minIdx);
      setArray([...current]);
      await sleep(speedToMs(speedRef.current));
    }

    // 현재 위치 sorted, 교환된 위치 default 복원 (한 번에 처리)
    setBarStates((prev) => {
      const next = [...prev];
      next[i] = 'sorted';
      if (minIdx !== i) next[minIdx] = 'default';
      return next;
    });
  }

  if (!stopRef.current) {
    setBarStates(markSorted(n - 1));
  }
};
