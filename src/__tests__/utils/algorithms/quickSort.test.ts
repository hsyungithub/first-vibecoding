import { describe, it, expect } from 'vitest'
import { partitionSync } from '@/utils/algorithms/quickSort'

describe('partitionSync', () => {
  it('마지막 요소를 피벗으로 파티션 후 피벗 인덱스를 반환한다', () => {
    const arr = [3, 1, 4, 1, 5]
    const pivotIdx = partitionSync(arr, 0, 4)
    expect(pivotIdx).toBe(4)
    expect(arr[4]).toBe(5)
  })

  it('피벗 왼쪽은 피벗보다 작거나 같고 오른쪽은 크다', () => {
    const arr = [3, 6, 8, 10, 1, 2, 1]
    const pivotIdx = partitionSync(arr, 0, arr.length - 1)
    const pivot = arr[pivotIdx]
    for (let i = 0; i < pivotIdx; i++) {
      expect(arr[i]).toBeLessThanOrEqual(pivot)
    }
    for (let i = pivotIdx + 1; i < arr.length; i++) {
      expect(arr[i]).toBeGreaterThan(pivot)
    }
  })

  it('이미 정렬된 배열도 올바르게 파티션한다', () => {
    const arr = [1, 2, 3, 4, 5]
    const pivotIdx = partitionSync(arr, 0, 4)
    expect(arr[pivotIdx]).toBe(5)
  })

  it('단일 요소 배열은 인덱스 0을 반환한다', () => {
    const arr = [42]
    const pivotIdx = partitionSync(arr, 0, 0)
    expect(pivotIdx).toBe(0)
  })
})
