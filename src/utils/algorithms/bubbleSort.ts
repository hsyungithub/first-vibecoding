import { sleep, speedToMs, swap } from "@/utils/animation";
import { SortFn } from "./types";

/** 버블 정렬 */
export const bubbleSort: SortFn = async (arr, setArray, setBarStates, speedRef, stopRef) => {
  let current = [...arr];
  const n = current.length;

  outer: for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (stopRef.current) break outer;

      // 비교 중인 두 막대 빨간색 표시
      setBarStates((prev) => {
        const next = [...prev];
        next[j] = 'comparing';
        next[j + 1] = 'comparing';
        return next;
      });

      await sleep(speedToMs(speedRef.current));
      if (stopRef.current) break outer;

      if (current[j] > current[j + 1]) {
        // 교환 시 노란색 표시
        setBarStates((prev) => {
          const next = [...prev];
          next[j] = 'swapping';
          next[j + 1] = 'swapping';
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
        next[j] = 'default';
        next[j + 1] = 'default';
        return next;
      });
    }

    // 각 패스 완료 후 정렬된 마지막 요소 표시
    setBarStates((prev) => {
      const next = [...prev];
      next[n - 1 - i] = 'sorted';
      return next;
    });
  }

  // 마지막 남은 요소도 정렬 완료 표시
  if (!stopRef.current) {
    setBarStates((prev) => {
      const next = [...prev];
      next[0] = 'sorted';
      return next;
    });
  }
};
