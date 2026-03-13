import { sleep, speedToMs } from "@/utils/animation";
import { SortFn } from "./types";

/** 삽입 정렬 */
export const insertionSort: SortFn = async (arr, setArray, setBarStates, speedRef, stopRef) => {
  const current = [...arr];
  const n = current.length;

  // 첫 번째 요소는 정렬된 상태로 시작
  setBarStates((prev) => {
    const next = [...prev];
    next[0] = 'sorted';
    return next;
  });

  for (let i = 1; i < n; i++) {
    if (stopRef.current) break;

    const key = current[i];
    let j = i - 1;

    // 삽입할 요소 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[i] = 'comparing';
      return next;
    });

    await sleep(speedToMs(speedRef.current));
    if (stopRef.current) break;

    // 삽입 위치 탐색 및 요소 이동
    while (j >= 0 && current[j] > key) {
      if (stopRef.current) break;

      // 이동 중인 요소 표시
      setBarStates((prev) => {
        const next = [...prev];
        next[j] = 'swapping';
        next[j + 1] = 'swapping';
        return next;
      });

      current[j + 1] = current[j];
      setArray([...current]);

      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) break;

      // 이동 완료 후 색상 복원
      setBarStates((prev) => {
        const next = [...prev];
        next[j + 1] = 'sorted';
        return next;
      });

      j--;
    }

    if (stopRef.current) break;

    current[j + 1] = key;
    setArray([...current]);

    // 삽입 완료 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[j + 1] = 'sorted';
      return next;
    });
  }

  // 모든 요소 정렬 완료 표시
  if (!stopRef.current) {
    setBarStates((prev) => prev.map(() => 'sorted'));
  }
};
