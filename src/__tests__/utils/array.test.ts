import { describe, it, expect } from 'vitest'
import { generateRandomArray } from '@/utils/array'
import { BAR_VALUE_MIN, BAR_VALUE_MAX, ARRAY_SIZE_MIN, ARRAY_SIZE_MAX } from '@/types'

describe('generateRandomArray', () => {
  it('지정한 크기의 배열을 반환한다', () => {
    expect(generateRandomArray(10)).toHaveLength(10)
    expect(generateRandomArray(50)).toHaveLength(50)
    expect(generateRandomArray(100)).toHaveLength(100)
  })

  it('모든 값이 BAR_VALUE_MIN 이상 BAR_VALUE_MAX 이하다', () => {
    const arr = generateRandomArray(200)
    for (const val of arr) {
      expect(val).toBeGreaterThanOrEqual(BAR_VALUE_MIN)
      expect(val).toBeLessThanOrEqual(BAR_VALUE_MAX)
    }
  })

  it('모든 값이 정수다', () => {
    const arr = generateRandomArray(50)
    for (const val of arr) {
      expect(Number.isInteger(val)).toBe(true)
    }
  })

  it('호출마다 다른 배열을 반환한다 (랜덤성)', () => {
    const a = generateRandomArray(50)
    const b = generateRandomArray(50)
    // 50개 중 모두 같을 확률은 사실상 0
    expect(a).not.toEqual(b)
  })

  it('최솟값(ARRAY_SIZE_MIN)과 최댓값(ARRAY_SIZE_MAX) 경계 크기도 정상 동작한다', () => {
    expect(generateRandomArray(ARRAY_SIZE_MIN)).toHaveLength(ARRAY_SIZE_MIN)
    expect(generateRandomArray(ARRAY_SIZE_MAX)).toHaveLength(ARRAY_SIZE_MAX)
  })
})
