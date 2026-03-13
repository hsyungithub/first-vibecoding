import { BAR_VALUE_MIN, BAR_VALUE_MAX } from '@/types';

/**
 * 지정한 크기의 랜덤 배열을 생성한다.
 * @param size - 배열 크기 (10 ~ 100)
 * @returns BAR_VALUE_MIN ~ BAR_VALUE_MAX 범위의 정수 배열
 */
export function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (BAR_VALUE_MAX - BAR_VALUE_MIN + 1)) + BAR_VALUE_MIN
  );
}
