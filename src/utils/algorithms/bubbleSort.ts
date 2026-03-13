import { sleep, speedToMs, swap, markComparing, markSwapping, markSorted, markDefault } from "@/utils/animation";
import { SortFn } from "./types";

/** 버블 정렬 */
export const bubbleSort: SortFn = async (arr, setArray, setBarStates, speedRef, stopRef) => {
  let current = [...arr];
  const n = current.length;

  outer: for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (stopRef.current) break outer;

      setBarStates(markComparing(j, j + 1));
      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) break outer;

      if (current[j] > current[j + 1]) {
        setBarStates(markSwapping(j, j + 1));
        current = swap(current, j, j + 1);
        setArray([...current]);
        await sleep(speedToMs(speedRef.current));
        if (stopRef.current) break outer;
      }

      setBarStates(markDefault(j, j + 1));
    }

    setBarStates(markSorted(n - 1 - i));
  }

  if (!stopRef.current) {
    setBarStates(markSorted(0));
  }
};
