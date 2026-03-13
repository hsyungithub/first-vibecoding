import { AlgorithmType } from "@/types";
import { SortFn } from "./types";
import { bubbleSort } from "./bubbleSort";
import { selectionSort } from "./selectionSort";
import { insertionSort } from "./insertionSort";
import { quickSort } from "./quickSort";
import { mergeSort } from "./mergeSort";

/** 알고리즘 타입 → 정렬 함수 매핑 */
export const ALGORITHM_MAP: Partial<Record<AlgorithmType, SortFn>> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  quick: quickSort,
  merge: mergeSort,
};

export type { SortFn } from "./types";
