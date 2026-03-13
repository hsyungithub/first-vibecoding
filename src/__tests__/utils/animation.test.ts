import { describe, it, expect } from 'vitest'
import { speedToMs, swap } from '@/utils/animation'
import { SPEED_MIN, SPEED_MAX } from '@/types'

describe('speedToMs', () => {
  it('최저 속도(1)는 500ms를 반환한다', () => {
    expect(speedToMs(SPEED_MIN)).toBe(500)
  })

  it('최고 속도(10)는 1ms를 반환한다', () => {
    expect(speedToMs(SPEED_MAX)).toBe(1)
  })

  it('중간 속도(5~6)는 중간 범위 ms를 반환한다', () => {
    const ms = speedToMs(5)
    expect(ms).toBeGreaterThan(1)
    expect(ms).toBeLessThan(500)
  })

  it('속도가 높을수록 딜레이가 작다', () => {
    expect(speedToMs(3)).toBeGreaterThan(speedToMs(7))
  })

  it('반환값은 정수다', () => {
    for (let s = SPEED_MIN; s <= SPEED_MAX; s++) {
      expect(Number.isInteger(speedToMs(s))).toBe(true)
    }
  })
})

describe('swap', () => {
  it('두 인덱스의 값을 교환한 새 배열을 반환한다', () => {
    expect(swap([1, 2, 3], 0, 2)).toEqual([3, 2, 1])
  })

  it('원본 배열을 변경하지 않는다 (불변성)', () => {
    const original = [1, 2, 3]
    swap(original, 0, 1)
    expect(original).toEqual([1, 2, 3])
  })

  it('같은 인덱스를 교환하면 배열이 변하지 않는다', () => {
    expect(swap([1, 2, 3], 1, 1)).toEqual([1, 2, 3])
  })

  it('인접한 요소를 교환한다', () => {
    expect(swap([3, 1, 2], 0, 1)).toEqual([1, 3, 2])
  })
})
