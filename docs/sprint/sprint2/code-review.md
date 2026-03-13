# Sprint 2 코드 리뷰 보고서

> Sprint 2: 핵심 애니메이션 유틸리티 (Phase 2 완료)
> 검토일: 2026-03-13
> PR: https://github.com/hsyungithub/first-vibecoding/pull/2

---

## 요약

Sprint 2 구현을 검토한 결과, 계획 대비 전체적으로 우수한 구현 품질을 보입니다. Critical 이슈는 없으며, Important 이슈 2건과 Suggestion 3건이 확인되었습니다.

---

## 잘된 점

- `sleep`, `speedToMs`, `swap`, `completionAnimation`을 별도 유틸리티 파일(`src/utils/animation.ts`)로 분리하여 재사용성 확보
- `useRef`로 속도와 중단 플래그를 관리하여 불필요한 리렌더링 방지 — 계획의 핵심 요구사항 충실히 이행
- `VisualizerArea`에서 `barStates[index] ?? 'default'` fallback 처리로 배열 길이 불일치 상황 방어
- `BAR_STATE_COLORS` 상수로 색상 매핑을 중앙화하여 향후 테마 변경 용이
- `outer:` 레이블을 활용한 이중 루프 탈출 패턴이 명확하고 의도가 분명함

---

## 이슈 목록

### Important (수정 권장)

#### I-1: `initArray` 함수가 `useEffect` 의존성 배열에 포함되지 않음

**위치:** `src/app/SortingVisualizer.tsx` - L37-39

```tsx
// 현재 코드
useEffect(() => {
  initArray(arraySize);
}, [arraySize]); // initArray가 누락되어 있음
```

`initArray`는 컴포넌트 렌더마다 새로 생성되는 함수이므로, 엄밀히는 의존성 배열에 포함해야 합니다. `useCallback`으로 메모이제이션하거나, `useEffect` 내부에 인라인으로 로직을 작성하는 방법이 있습니다. 현재는 `arraySize`만 변경될 때만 실행되므로 동작상 문제는 없으나, React의 exhaustive-deps 린트 규칙이 경고를 발생시킬 수 있습니다.

**권장 수정:**
```tsx
const initArray = useCallback((size: number) => {
  const newArr = generateRandomArray(size);
  setArray(newArr);
  setBarStates(new Array(size).fill('default'));
}, []); // 의존성 없음 (generateRandomArray는 순수 함수)
```

#### I-2: 버블 정렬 완료 후 각 패스의 마지막 요소가 sorted로 표시되지 않음

**위치:** `src/app/SortingVisualizer.tsx` - L66-106

버블 정렬에서 각 패스가 끝나면 가장 오른쪽 요소가 최종 위치에 정착하므로, 해당 요소를 `sorted`로 표시해야 합니다. 현재는 모든 비교/교환 후 `default`로 복원되어, 완료 웨이브 애니메이션 전까지 중간 완료 상태가 시각화되지 않습니다. Phase 3에서 알고리즘 모듈로 분리될 예정이지만, 데모 단계에서도 시각적 피드백이 더 정확할 수 있습니다.

> Phase 3 알고리즘 구현 시 수정하는 방향으로 넘겨도 무방합니다.

---

### Suggestion (참고)

#### S-1: `handleReset`에서 `isSortingRef.current = false` 설정 후 `setIsSorting(false)` 호출 시 타이밍 문제 가능성

`handleReset`이 정렬 완료 직후 동시에 호출되면, `isSortingRef.current`를 `false`로 먼저 설정한 뒤 정렬 루프가 종료되면서 `setIsSorting(false)`를 한 번 더 호출하는 상황이 발생할 수 있습니다. React 상태 업데이트는 배치 처리되므로 실제 문제가 되지는 않지만, 명시적인 `shouldStop` 체크 이후 정렬 루프의 cleanup 로직(`isSortingRef.current = false; setIsSorting(false)`)을 보호하는 것이 더 명확합니다.

#### S-2: `completionAnimation`의 딜레이 20ms가 하드코딩됨

`completionAnimation` 함수의 20ms 딜레이가 상수로 정의되어 있지 않습니다. `COMPLETION_ANIMATION_DELAY = 20` 상수를 `src/types/index.ts`에 추가하면 일관성이 높아집니다.

#### S-3: `VisualizerArea`에서 `transition-none`이 제거됨

Sprint 1에서 렌더링 성능을 위해 `transition-none`을 적용했으나, Sprint 2 구현에서 제거되었습니다. 색상 변경 시 CSS transition이 적용되면 성능 저하가 발생할 수 있으므로, 의도적인 변경인지 확인이 필요합니다. 색상 변화 시 부드러운 트랜지션이 필요하다면 `transition-colors duration-100` 정도로 짧게 설정하는 것이 좋습니다.

---

## 계획 대비 구현 현황

| 계획 항목 | 구현 여부 | 비고 |
|-----------|-----------|------|
| sleep 유틸리티 함수 | ✅ 완료 | `speedToMs` 함께 구현 |
| BarState 타입 정의 | ✅ 완료 | BAR_STATE_COLORS도 포함 |
| swap 함수 및 배열 업데이트 | ✅ 완료 | 불변 패턴 사용 |
| 정렬 실행 제어 구조 (useRef) | ✅ 완료 | isSortingRef, shouldStopRef 구현 |
| 속도 슬라이더 실시간 연동 | ✅ 완료 | speedRef + useEffect 동기화 |
| 완료 웨이브 애니메이션 | ✅ 완료 | completionAnimation 함수 분리 |
| 초기화 버튼 | ✅ 완료 | ControlBar에 추가됨 |

---

## 결론

Sprint 2의 핵심 목표인 애니메이션 유틸리티 구현이 계획 대비 충실히 이행되었습니다. Critical 이슈가 없으므로 PR 머지는 진행 가능합니다. I-1 (`useCallback` 적용)은 Phase 3 리팩토링 시 함께 처리하는 것을 권장합니다.
