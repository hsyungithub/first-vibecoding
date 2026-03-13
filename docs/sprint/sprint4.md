# Sprint 4 구현 계획: 고급 알고리즘 시각화 (퀵 정렬 / 병합 정렬)

**Goal:** 재귀 기반 퀵 정렬(Lomuto partition)과 병합 정렬을 구현하고, 분할/병합 과정의 색상 피드백 애니메이션을 추가한다. Vitest 단위 테스트(8개)로 핵심 로직을 검증하고, 기존 `ALGORITHM_MAP`에 `quick` / `merge` 엔트리를 추가하여 5종 알고리즘 선택을 완성한다.

**Architecture:** `src/utils/algorithms/quickSort.ts` 및 `mergeSort.ts`를 Phase 3와 동일한 `SortFn` 인터페이스로 작성. 순수 동기 로직(`partitionSync`, `mergeSync`)을 별도로 분리하여 Vitest로 테스트하고, 애니메이션 로직은 async 래퍼 함수에서 처리한다.

**Tech Stack:** Next.js (App Router), TypeScript, React Hooks (useState, useRef), Tailwind CSS, Vitest (단위 테스트), Playwright MCP (UI 검증)

---

## 스프린트 정보

| 항목 | 내용 |
|------|------|
| 스프린트 번호 | Sprint 4 |
| 대응 Phase | Phase 4: 고급 알고리즘 시각화 |
| 기간 | 2026-03-13 |
| 목표 마일스톤 | M4: 풀 알고리즘 지원 (5종 알고리즘) |
| 상태 | 완료 |

---

## 구현 범위

### 포함 항목

- `vitest.config.ts` — Vitest 설정 (jsdom 환경, path alias)
- `package.json` — `test` 스크립트 추가 (`vitest run`)
- `src/utils/algorithms/quickSort.ts` — 퀵 정렬 구현 (Lomuto partition, 피벗 노란색 강조)
- `src/utils/algorithms/mergeSort.ts` — 병합 정렬 구현 (분할/병합 애니메이션)
- `src/__tests__/utils/algorithms/quickSort.test.ts` — `partitionSync` 유닛 테스트 4개
- `src/__tests__/utils/algorithms/mergeSort.test.ts` — `mergeSync` 유닛 테스트 4개
- `src/utils/algorithms/index.ts` — `ALGORITHM_MAP`에 `quick` / `merge` 추가
- `src/components/VisualizerArea.tsx` — 막대 색상을 파스텔 hex로 변경 (Tailwind 클래스 제거)
- `src/types/index.ts` — `BAR_STATE_COLORS` hex 값으로 교체

### 제외 항목

- UI 레이아웃 변경 없음
- 배포 설정 변경 없음 (Phase 5 예정)

---

## 완료 기준 (Definition of Done)

- ✅ 퀵 정렬 선택 후 "정렬 시작" 시 피벗/분할 과정이 시각화됨
- ✅ 병합 정렬 선택 후 "정렬 시작" 시 분할/병합 과정이 시각화됨
- ✅ 두 알고리즘 모두 정렬 완료 후 배열이 오름차순임
- ✅ 재귀 깊이가 깊어져도 (배열 크기 100) 정상 동작하고 브라우저가 멈추지 않음
- ✅ 기존 3가지 기본 알고리즘과 동일한 색상 피드백 패턴 유지
- ✅ 정렬 중 "초기화" 시 재귀 정렬도 즉시 중단됨
- ✅ `npm run build` 성공
- ✅ `npx vitest run` 8/8 통과

---

## 검증 결과

- [Sprint 4 Playwright 검증 보고서](sprint4/playwright-report.md)
- [코드 리뷰 보고서](sprint4/code-review.md)

---

## 주요 구현 파일

| 파일 | 역할 |
|------|------|
| `src/utils/algorithms/quickSort.ts` | Lomuto partition 퀵 정렬, stopRef 기반 재귀 중단 |
| `src/utils/algorithms/mergeSort.ts` | 보조 배열 병합, 색상 전환 애니메이션 |
| `src/utils/algorithms/index.ts` | ALGORITHM_MAP에 quick/merge 등록 |
| `src/__tests__/utils/algorithms/quickSort.test.ts` | partitionSync 4개 케이스 |
| `src/__tests__/utils/algorithms/mergeSort.test.ts` | mergeSync 4개 케이스 |
| `vitest.config.ts` | Vitest 테스트 환경 설정 |

---

## 📊 실제 추적 기록

### 작업 시간

| 항목 | 시간 |
|------|------|
| 시작 | 2026-03-13 15:21 (Sprint 3 완료 직후) |
| 첫 구현 커밋 | 2026-03-13 15:32 |
| 종료 | 2026-03-13 15:58 (Sprint 4 마무리 완료) |
| **실제 소요 시간** | **약 37분** |
| 계획 소요 시간 | 미설정 |

### 변경 통계 (`ec6d7a1..b361b46`)

| 항목 | 수치 |
|------|------|
| 변경된 파일 수 | 14개 |
| 추가된 라인 수 | +1,878줄 |
| 삭제된 라인 수 | -22줄 |
| 순 변경량 | +1,856줄 |

### 주요 커밋

| 해시 | 시각 | 메시지 |
|------|------|--------|
| `c6bf726` | 15:32 | chore: Vitest 테스트 환경 설정 |
| `a3ed1df` | 15:34 | feat: 퀵 정렬 구현 (partitionSync 유닛 테스트 포함) |
| `da6253f` | 15:37 | feat: 병합 정렬 구현 (mergeSync 유닛 테스트 포함) |
| `98e7b31` | 15:39 | feat: ALGORITHM_MAP에 퀵/병합 정렬 추가 |
| `52c9751` | 15:45 | refactor: 막대 색상을 Tailwind 클래스에서 파스텔 hex 색상으로 변경 |
| `9f4f301` | 15:46 | docs: Sprint 4 마무리 - ROADMAP 완료 표시, sprint4.md 및 deploy.md 생성 |
| `b361b46` | 15:58 | docs: Sprint 4 코드 리뷰 보고서 추가 |

### 계획 대비 실제

| 항목 | 내용 |
|------|------|
| 계획 범위 준수 | ✅ quickSort, mergeSort TDD(8개 테스트), ALGORITHM_MAP 연동, Vitest 환경 모두 완료 |
| 예상 외 추가 작업 | 파스텔 색상 변경(52c9751) — 사용자 요청으로 Sprint 4 중에 추가됨 |
| 코드 리뷰 이슈 | Important 1건 (I-1: mergeSort partial sorted 표시 오버헤드), Suggestion 2건 |
| 미적용 이슈 | I-1은 후속 P1 animation helper 리팩토링에서 개선됨 |
