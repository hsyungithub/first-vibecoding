import { BarState, SPEED_MIN, SPEED_MAX } from "@/types";

type SetBarStates = (updater: (prev: BarState[]) => BarState[]) => void;

/** 지정 인덱스들을 특정 상태로 변경하는 updater를 반환 */
function markAs(state: BarState, ...indices: number[]) {
  return (prev: BarState[]): BarState[] => {
    const next = [...prev];
    indices.forEach((i) => { next[i] = state; });
    return next;
  };
}

/** 지정 인덱스들을 comparing(빨간색)으로 표시 */
export const markComparing = (...indices: number[]) => markAs('comparing', ...indices);

/** 지정 인덱스들을 swapping(노란색)으로 표시 */
export const markSwapping = (...indices: number[]) => markAs('swapping', ...indices);

/** 지정 인덱스들을 sorted(초록색)으로 표시 */
export const markSorted = (...indices: number[]) => markAs('sorted', ...indices);

/** 지정 인덱스들을 default(기본색)으로 복원 */
export const markDefault = (...indices: number[]) => markAs('default', ...indices);

export type { SetBarStates };

/** 지정된 밀리초만큼 대기 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 슬라이더 속도(1~10)를 딜레이(ms)로 변환
 * 속도 1 → 500ms, 속도 10 → 1ms (선형 보간)
 */
export function speedToMs(speed: number): number {
  const minMs = 1;
  const maxMs = 500;
  // 속도가 클수록 딜레이 작음
  const ratio = (speed - SPEED_MIN) / (SPEED_MAX - SPEED_MIN);
  return Math.round(maxMs - ratio * (maxMs - minMs));
}

/** 불변 배열 swap: i, j 위치의 값을 교환한 새 배열 반환 */
export function swap(arr: number[], i: number, j: number): number[] {
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/**
 * 정렬 완료 후 왼→오 순차 초록 웨이브 애니메이션
 * 각 막대를 20ms 간격으로 순차적으로 sorted 상태로 변경
 */
export async function completionAnimation(
  length: number,
  setBarStates: (updater: (prev: BarState[]) => BarState[]) => void
): Promise<void> {
  for (let i = 0; i < length; i++) {
    setBarStates((prev) => {
      const next = [...prev];
      next[i] = 'sorted';
      return next;
    });
    await sleep(20);
  }
}
