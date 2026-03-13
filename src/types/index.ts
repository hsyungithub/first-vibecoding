/** 지원하는 정렬 알고리즘 목록 */
export type AlgorithmType =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'quick'
  | 'merge';

export interface AlgorithmOption {
  value: AlgorithmType;
  label: string;
}

export const ALGORITHM_OPTIONS: AlgorithmOption[] = [
  { value: 'bubble', label: '버블 정렬' },
  { value: 'selection', label: '선택 정렬' },
  { value: 'insertion', label: '삽입 정렬' },
  { value: 'quick', label: '퀵 정렬' },
  { value: 'merge', label: '병합 정렬' },
];

/** 배열 크기 범위 */
export const ARRAY_SIZE_MIN = 10;
export const ARRAY_SIZE_MAX = 100;
export const ARRAY_SIZE_DEFAULT = 50;

/** 막대 높이 값 범위 */
export const BAR_VALUE_MIN = 5;
export const BAR_VALUE_MAX = 500;

/** 애니메이션 속도 범위 */
export const SPEED_MIN = 1;
export const SPEED_MAX = 10;
export const SPEED_DEFAULT = 5;

/** 막대 상태 타입 */
export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted';

/** 막대 상태별 파스텔 색상 (hex) */
export const BAR_STATE_COLORS: Record<BarState, string> = {
  default: '#93b4d8',   // 파스텔 블루
  comparing: '#e8a0a0', // 파스텔 레드
  swapping: '#f5d08a',  // 파스텔 옐로
  sorted: '#90c9a0',    // 파스텔 그린
};
