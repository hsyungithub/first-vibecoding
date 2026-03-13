import { sleep, speedToMs, markComparing, markSwapping, markSorted } from "@/utils/animation";
import { SortFn } from "./types";

/** 삽입 정렬 */
export const insertionSort: SortFn = async (arr, setArray, setBarStates, speedRef, stopRef) => {
  const current = [...arr];
  const n = current.length;

  setBarStates(markSorted(0));

  for (let i = 1; i < n; i++) {
    if (stopRef.current) break;

    const key = current[i];
    let j = i - 1;

    setBarStates(markComparing(i));
    await sleep(speedToMs(speedRef.current));
    if (stopRef.current) break;

    while (j >= 0 && current[j] > key) {
      if (stopRef.current) break;

      setBarStates(markSwapping(j, j + 1));
      current[j + 1] = current[j];
      setArray([...current]);
      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) break;

      setBarStates(markSorted(j + 1));
      j--;
    }

    if (stopRef.current) break;

    current[j + 1] = key;
    setArray([...current]);
    setBarStates(markSorted(j + 1));
  }

  if (!stopRef.current) {
    setBarStates((prev) => prev.map(() => 'sorted'));
  }
};
