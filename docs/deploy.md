# 배포 및 검증 체크리스트

Sprint별 검증 완료 항목과 수동 검증 필요 항목을 기록합니다.

---

## Sprint 4 검증 (Phase 4: 고급 알고리즘 시각화)

**검증일:** 2026-03-13

### 자동 검증 완료

- ✅ `npm run build` — Next.js 빌드 성공 (TypeScript 에러 없음)
- ✅ `npx tsc --noEmit` — 타입 체크 통과
- ✅ `npx vitest run` — 8/8 테스트 통과 (quickSort.test.ts 4개, mergeSort.test.ts 4개)
- ✅ localhost:3000 HTTP 200 응답 확인
- ✅ 드롭다운에 "퀵 정렬", "병합 정렬" 옵션 HTML 구조 확인
- ✅ "새 배열 생성", "정렬 시작", "초기화" 버튼 존재 확인
- ✅ ALGORITHM_MAP에 quick/merge 연결 확인 (코드 정적 분석)
- ✅ stopRef 중단 로직 구현 확인 (quickSortHelper, mergeSortHelper 진입부)

### 수동 검증 필요

- ⬜ 퀵 정렬 실행 시 피벗(노란색) / 비교 중 요소(빨간색) 색상 시각적 확인
- ⬜ 병합 정렬 실행 시 비교(빨간색) → 병합(노란색) → 완료(초록색) 색상 시각적 확인
- ⬜ 정렬 완료 후 모든 막대가 오름차순 + 초록색 웨이브 애니메이션 확인
- ⬜ 배열 크기 100에서 퀵/병합 정렬 실행 시 브라우저 응답성 유지 확인
- ⬜ 정렬 중 "초기화" 클릭 시 재귀 정렬 즉시 중단 및 새 배열 생성 확인
- ⬜ 브라우저 개발자 도구 콘솔 에러 없음 확인 (F12 → Console 탭)
- ⬜ Vercel 배포 (타이밍은 사용자 결정)

### 수동 검증 방법

1. `npm run dev` 실행 후 http://localhost:3000 접속
2. 퀵 정렬: 드롭다운에서 "퀵 정렬" 선택 → "정렬 시작" → 피벗/비교 색상 확인
3. 병합 정렬: "새 배열 생성" → "병합 정렬" 선택 → "정렬 시작" → 색상 전환 확인
4. 중단 검증: 속도 슬라이더 최저속 설정 → 정렬 시작 → "초기화" 클릭 → 즉시 중단 확인
5. 대규모 배열: 배열 크기 슬라이더 100으로 설정 → 퀵 정렬 실행 → 응답성 확인

---

## Sprint 3 검증 (Phase 3: 기본 알고리즘 시각화)

**검증일:** 2026-03-13

### 자동 검증 완료

- ✅ `npm run build` — 빌드 성공
- ✅ 버블/선택/삽입 정렬 드롭다운 옵션 HTML 구조 확인
- ✅ ALGORITHM_MAP 연결 코드 정적 분석

### 수동 검증 필요

- ⬜ 버블/선택/삽입 정렬 시각적 색상 피드백 확인
- ⬜ 정렬 완료 후 오름차순 배열 확인
- ⬜ 정렬 중 초기화 즉시 중단 확인

---

## Sprint 2 검증 (Phase 2: 핵심 유틸리티)

**검증일:** 2026-03-13

### 자동 검증 완료

- ✅ `npm run build` — 빌드 성공
- ✅ sleep 유틸리티, 색상 상태 타입 코드 정적 분석

### 수동 검증 필요

- ⬜ 속도 슬라이더 실시간 연동 시각적 확인
- ⬜ 정렬 중 버튼 비활성화 상태 확인

---

## Sprint 1 검증 (Phase 1: UI 뼈대)

**검증일:** 2026-03-13

### 자동 검증 완료

- ✅ `npm run build` — 빌드 성공
- ✅ localhost:3000 HTML 구조 확인

### 수동 검증 필요

- ⬜ 모바일/데스크톱 반응형 레이아웃 시각적 확인
- ⬜ "새 배열 생성" 버튼 클릭 시 랜덤 막대 렌더링 확인

---

---

## Sprint 5 검증 (Phase 5: 마무리 및 UX 개선)

**검증일:** 2026-03-13

### 자동 검증 완료

- ✅ `npm run build` — Next.js 빌드 성공 (TypeScript 에러 없음)
- ✅ `npx vitest run` — 13/13 테스트 통과 (기존 8개 + algorithmInfo 5개)
- ✅ `useTheme` 훅 구현 확인 (localStorage + 시스템 설정 감지, useEffect 기반)
- ✅ FOUC 방지 인라인 스크립트 확인 (`layout.tsx` 내 themeScript IIFE)
- ✅ `ThemeToggle` 컴포넌트 — props 기반 순수 컴포넌트로 구현
- ✅ `ALGORITHM_INFO` 상수 — `Record<AlgorithmType, ComplexityInfo>` 타입 안전성 확인
- ✅ `AlgorithmInfo` 컴포넌트 — 6개 필드 렌더링 (best/average/worst/space/stable/label)
- ✅ Open Graph + Twitter 메타 태그 설정 완료
- ✅ 전체 컴포넌트 다크모드 `dark:` Tailwind 클래스 적용 확인
- ✅ `aria-label` 접근성 — 슬라이더 2개, 버튼 3개, 시각화 영역, ThemeToggle 적용 확인

### 코드 리뷰 결과

Critical 이슈 없음 — PR 머지 가능.

Important 이슈 3건 (다음 핫픽스 권장):
- `useTheme` 초기값이 `"dark"` 하드코딩 (FOUC 스크립트와 기본값 불일치)
- `layout.tsx` `<html>` 태그에 `suppressHydrationWarning` 누락
- `themeScript` IIFE 내부에 try-catch 없음 (localStorage 접근 오류 시 스크립트 중단 가능)

상세 내용: [코드 리뷰 보고서](sprint5/code-review.md)

### 수동 검증 필요

- ⬜ 다크모드 토글 버튼 클릭 시 전체 UI 즉시 전환 시각 확인
- ⬜ 새로고침 후 다크모드 유지 확인 (localStorage 영속성)
- ⬜ FOUC 없이 초기 로드 시 테마 바로 적용되는지 확인
- ⬜ 알고리즘 드롭다운 변경 시 AlgorithmInfo 즉시 갱신 확인
- ⬜ 모바일(375px) 레이아웃에서 ThemeToggle + AlgorithmInfo 겹침 없음 확인
- ⬜ 브라우저 개발자 도구 콘솔 에러 없음 확인 (F12 → Console 탭)
- ⬜ 기존 정렬 기능(5종 알고리즘) 다크모드에서 정상 동작 확인

### 수동 검증 방법

1. `npm run dev` 실행 후 http://localhost:3000 접속
2. 다크모드 토글: TopNav 우측 🌙/☀️ 버튼 클릭 → 전체 배경/텍스트 전환 확인
3. 새로고침: 다크모드 상태에서 F5 → FOUC 없이 다크 배경 유지 확인
4. 복잡도 정보: 알고리즘 드롭다운에서 각 알고리즘 선택 → 복잡도 바 갱신 확인
5. 정렬 실행: 다크모드에서 "정렬 시작" → 막대 색상(비교/스왑/완료)이 배경과 구분되는지 확인

### 배포 준비

- ✅ Open Graph 메타 태그 설정 완료
- ✅ favicon 설정 완료 (`src/app/favicon.ico`)
- ✅ `npm run build` 성공 확인
- ⬜ Vercel 배포 실행 (사용자 직접 수행 — `vercel --prod`)
- ⬜ Lighthouse 성능 점수 90+ 확인 (배포 후 수행)
