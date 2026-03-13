import { describe, it, expect } from 'vitest'
import { mergeSync } from '@/utils/algorithms/mergeSort'

describe('mergeSync', () => {
  it('두 정렬된 구간을 하나로 병합한다', () => {
    const arr = [1, 3, 5, 2, 4, 6]
    mergeSync(arr, 0, 2, 5)
    expect(arr).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('단일 요소 구간 병합', () => {
    const arr = [2, 1]
    mergeSync(arr, 0, 0, 1)
    expect(arr).toEqual([1, 2])
  })

  it('이미 정렬된 구간은 변경되지 않는다', () => {
    const arr = [1, 2, 3, 4]
    mergeSync(arr, 0, 1, 3)
    expect(arr).toEqual([1, 2, 3, 4])
  })

  it('모든 왼쪽 요소가 오른쪽보다 큰 경우', () => {
    const arr = [3, 4, 1, 2]
    mergeSync(arr, 0, 1, 3)
    expect(arr).toEqual([1, 2, 3, 4])
  })
})
