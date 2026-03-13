# Sprint 2 구현 계획: 핵심 애니메이션 유틸리티

**Goal:** 정렬 애니메이션의 핵심인 비동기 지연(sleep) 함수, 스왑 함수, 색상 상태 관리 구조를 구현. Phase 3에서 알고리즘 구현 시 재사용할 공통 유틸리티 완성.

**Architecture:** `src/utils/animation.ts`에 애니메이션 유틸리티를 모듈화하고, `src/types/index.ts`에 BarState 타입과 색상 매핑 상수를 추가한다. SortingVisualizer에서 `useRef`로 중단 플래그와 속도를 관리하여 불필요한 리렌더링을 방지한다.

**Tech Stack:** Next.js (App Router), TypeScript, React Hooks (useState, useEffect, useRef), Tailwind CSS

---

## 스프린트 정보

| 항목 | 내용 |
|------|------|
| 스프린트 번호 | Sprint 2 |
| 대응 Phase | Phase 2: 핵심 유틸리티 |
| 기간 | 2026-03-13 (완료) |
| 목표 마일스톤 | M2: 애니메이션 엔진 완성 |
| 상태 | ✅ 완료 |

---

## 구현 범위

### 포함 항목

- `src/utils/animation.ts`: sleep, speedToMs, swap, completionAnimation 유틸리티
- `src/types/index.ts`: BarState 타입, BAR_STATE_COLORS 상수, SPEED_MIN/MAX/DEFAULT 상수 추가
- `src/components/VisualizerArea.tsx`: barStates prop으로 동적 색상 적용
- `src/components/TopNav.tsx`: isSorting prop으로 정렬 중 컨트롤 비활성화, SPEED 상수 적용
- `src/components/ControlBar.tsx`: 초기화 버튼 추가
- `src/app/SortingVisualizer.tsx`: barStates state, useRef 제어, 버블 정렬 데모, 완료 웨이브 애니메이션

### 제외 항목 (이후 Phase에서 구현)

- 실제 알고리즘 선택 및 실행 (Phase 3)
- 퀵/병합 정렬 등 고급 알고리즘 (Phase 4)
- 다크모드, 복잡도 정보 표시 (Phase 5)

---

## 완료 기준 (Definition of Done)

- ✅ 속도 슬라이더 변경 시 실시간 반영됨
- ✅ 버블 정렬 데모로 색상 변화(빨간/노란/초록)가 정상 동작함
- ✅ 정렬 진행 중 "초기화" 클릭 시 즉시 중단되고 새 배열이 생성됨
- ✅ 정렬 진행 중 "새 배열 생성", "정렬 시작" 버튼이 비활성화됨
- ✅ `npm run build` 성공, TypeScript 에러 없음
- ⬜ 브라우저 콘솔에 에러/경고 없음 (수동 확인 필요)

---

## 검증 결과

- [Playwright 테스트 보고서](sprint2/playwright-report.md)
- [코드 리뷰 보고서](sprint2/code-review.md)
- [배포 체크리스트](sprint2/deploy.md)

### 자동 검증 요약 (2026-03-13)

| 항목 | 결과 | 비고 |
|------|------|------|
| `npm run build` | ✅ 성공 | Next.js 16.1.6, 빌드 시간 2.6초 |
| TypeScript 검사 | ✅ 통과 | 빌드 내 포함 |
| Playwright UI 검증 | ⬜ 수동 필요 | Playwright MCP 미사용 환경 |

### 코드 리뷰 요약

- Critical 이슈: 없음
- Important 이슈: 2건 (I-1: useCallback 미사용, I-2: 버블 정렬 중간 sorted 표시 누락)
- Suggestion: 3건 (S-1: handleReset 타이밍, S-2: 하드코딩 상수, S-3: transition-none 제거)

---

## 기술 고려사항

### useRef 기반 제어 구조

- `isSortingRef`: 정렬 진행 중 중복 실행 방지
- `shouldStopRef`: 비동기 루프에서 중단 신호 감지
- `speedRef`: 정렬 중 속도 변경 실시간 반영 (state와 동기화)

### 색상 상태 관리

- `BarState` 타입으로 타입 안전성 보장
- `BAR_STATE_COLORS` 상수로 색상 매핑 중앙화 — 테마 변경 시 한 곳만 수정

### Phase 3 연동 준비

- `animation.ts`의 유틸리티 함수들은 Phase 3 알고리즘 함수와 동일한 인터페이스로 재사용 가능
- `SortingVisualizer`의 버블 정렬 데모 코드는 Phase 3에서 독립 모듈로 분리 예정

---

## 📊 실제 추적 기록

### 작업 시간

| 항목 | 시간 |
|------|------|
| 시작 | 2026-03-13 13:43 (Sprint 1 완료 직후) |
| 첫 구현 커밋 | 2026-03-13 14:27 |
| 종료 | 2026-03-13 14:33 (Sprint 2 마무리 완료) |
| **실제 소요 시간** | **약 50분** |
| 계획 소요 시간 | 미설정 |

### 변경 통계 (`1c26c0e..9a146af`)

| 항목 | 수치 |
|------|------|
| 변경된 파일 수 | 11개 |
| 추가된 라인 수 | +521줄 |
| 삭제된 라인 수 | -31줄 |
| 순 변경량 | +490줄 |

### 주요 커밋

| 해시 | 시각 | 메시지 |
|------|------|--------|
| `a83a058` | 14:27 | feat: Sprint 2 - 핵심 애니메이션 유틸리티 구현 |
| `c2a8848` | 14:28 | docs: Sprint 2 완료 - ROADMAP 업데이트 |
| `9a146af` | 14:33 | docs: Sprint 2 마무리 - 검증 보고서 및 코드 리뷰 추가 |

### 계획 대비 실제

| 항목 | 내용 |
|------|------|
| 계획 범위 준수 | ✅ sleep, speedToMs, swap, completionAnimation, BarState 타입, BAR_STATE_COLORS 모두 완료 |
| 예상 외 추가 작업 | 없음 |
| 코드 리뷰 이슈 | Important 2건 (I-1: useCallback 미사용, I-2: 버블 정렬 sorted 표시 누락), Suggestion 3건 |
| 미적용 이슈 | I-1 useCallback은 적용 보류, I-2는 Sprint 3에서 해결됨 |
