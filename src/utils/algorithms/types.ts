import { BarState } from "@/types";

/** 모든 정렬 알고리즘이 공유하는 함수 시그니처 */
export type SortFn = (
  arr: number[],
  setArray: (arr: number[]) => void,
  setBarStates: (updater: (prev: BarState[]) => BarState[]) => void,
  speedRef: React.MutableRefObject<number>,
  stopRef: React.MutableRefObject<boolean>
) => Promise<void>;
