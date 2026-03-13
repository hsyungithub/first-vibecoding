import { describe, it, expect } from 'vitest'
import { ALGORITHM_INFO } from '@/constants/algorithmInfo'

describe('ALGORITHM_INFO', () => {
  it('5종 알고리즘 정보가 모두 존재한다', () => {
    expect(ALGORITHM_INFO).toHaveProperty('bubble')
    expect(ALGORITHM_INFO).toHaveProperty('selection')
    expect(ALGORITHM_INFO).toHaveProperty('insertion')
    expect(ALGORITHM_INFO).toHaveProperty('quick')
    expect(ALGORITHM_INFO).toHaveProperty('merge')
  })

  it('각 항목에 필수 필드가 존재한다', () => {
    for (const info of Object.values(ALGORITHM_INFO)) {
      expect(info).toHaveProperty('best')
      expect(info).toHaveProperty('average')
      expect(info).toHaveProperty('worst')
      expect(info).toHaveProperty('space')
      expect(info).toHaveProperty('stable')
    }
  })

  it('버블 정렬 복잡도가 정확하다', () => {
    expect(ALGORITHM_INFO.bubble.average).toBe('O(n²)')
    expect(ALGORITHM_INFO.bubble.space).toBe('O(1)')
    expect(ALGORITHM_INFO.bubble.stable).toBe(true)
  })

  it('병합 정렬 복잡도가 정확하다', () => {
    expect(ALGORITHM_INFO.merge.average).toBe('O(n log n)')
    expect(ALGORITHM_INFO.merge.space).toBe('O(n)')
    expect(ALGORITHM_INFO.merge.stable).toBe(true)
  })

  it('퀵 정렬 안정성이 false다', () => {
    expect(ALGORITHM_INFO.quick.stable).toBe(false)
  })
})
