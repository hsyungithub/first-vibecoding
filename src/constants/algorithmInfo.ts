import { AlgorithmType } from "@/types";

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
}

export const ALGORITHM_INFO: Record<AlgorithmType, ComplexityInfo> = {
  bubble: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
  },
  selection: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
  },
  insertion: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
  },
  quick: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
  },
  merge: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
  },
};
