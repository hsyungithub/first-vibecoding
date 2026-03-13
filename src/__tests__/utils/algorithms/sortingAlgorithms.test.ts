/**
 * 기본 정렬 알고리즘 3종 정렬 정확성 테스트
 * 애니메이션 side effect를 제거한 no-op 함수로 순수 정렬 결과만 검증
 */
import { describe, it, expect, vi } from 'vitest'
import { bubbleSort } from '@/utils/algorithms/bubbleSort'
import { selectionSort } from '@/utils/algorithms/selectionSort'
import { insertionSort } from '@/utils/algorithms/insertionSort'
import { MutableRefObject } from 'react'

/** 테스트용 mock ref 생성 */
function makeRef<T>(val: T): MutableRefObject<T> {
  return { current: val }
}

/** 정렬 함수를 실행하고 최종 배열을 반환하는 헬퍼 */
async function runSort(
  sortFn: typeof bubbleSort,
  input: number[]
): Promise<number[]> {
  let result = [...input]
  const setArray = (arr: number[]) => { result = arr }
  const setBarStates = vi.fn()
  const speedRef = makeRef(10) // 최고 속도로 빠르게 실행
  const stopRef = makeRef(false)

  await sortFn(input, setArray, setBarStates, speedRef, stopRef)
  return result
}

const TEST_CASES = [
  { label: '일반 배열',        input: [5, 3, 8, 1, 9, 2, 7, 4, 6] },
  { label: '이미 정렬된 배열', input: [1, 2, 3, 4, 5] },
  { label: '역순 배열',        input: [5, 4, 3, 2, 1] },
  { label: '중복 포함 배열',   input: [3, 1, 4, 1, 5, 9, 2, 6, 5] },
  { label: '단일 요소',        input: [42] },
  { label: '두 요소',          input: [2, 1] },
]

function isSorted(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false
  }
  return true
}

describe('bubbleSort', () => {
  for (const { label, input } of TEST_CASES) {
    it(`${label}를 오름차순으로 정렬한다`, async () => {
      const result = await runSort(bubbleSort, [...input])
      expect(isSorted(result)).toBe(true)
      expect(result).toHaveLength(input.length)
    })
  }
})

describe('selectionSort', () => {
  for (const { label, input } of TEST_CASES) {
    it(`${label}를 오름차순으로 정렬한다`, async () => {
      const result = await runSort(selectionSort, [...input])
      expect(isSorted(result)).toBe(true)
      expect(result).toHaveLength(input.length)
    })
  }
})

describe('insertionSort', () => {
  for (const { label, input } of TEST_CASES) {
    it(`${label}를 오름차순으로 정렬한다`, async () => {
      const result = await runSort(insertionSort, [...input])
      expect(isSorted(result)).toBe(true)
      expect(result).toHaveLength(input.length)
    })
  }
})
