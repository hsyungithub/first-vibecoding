# 프로젝트 로드맵: Sorting Algorithm Visualizer

## 개요
- **목표**: 다양한 정렬 알고리즘의 작동 과정을 실시간 애니메이션으로 시각화하는 웹 애플리케이션
- **전체 예상 기간**: 5 Phase / 약 10주 (2주 스프린트 x 5)
- **현재 진행 단계**: Phase 1 시작 전

## 진행 상태 범례
- ✅ 완료
- 🔄 진행 중
- 📋 예정
- ⏸️ 보류

---

## 📊 프로젝트 현황 대시보드

| 항목 | 상태 |
|------|------|
| 전체 진행률 | 20% |
| 현재 Phase | Phase 2 (예정) |
| 다음 마일스톤 | 애니메이션 유틸리티 완성 |
| 시작일 | 2026-03-13 |
| 예상 완료일 | 2026-05-22 |

---

## 🏗️ 기술 아키텍처 결정 사항

| 결정 사항 | 선택 | 이유 |
|-----------|------|------|
| Framework | Next.js (App Router) | React 기반 + SSG 지원으로 정적 배포 최적화, PRD에서 React.js 또는 Next.js 허용 |
| Styling | Tailwind CSS | PRD 명시, 유틸리티 기반으로 빠른 UI 구현 |
| State Management | React Hooks (useState, useEffect, useRef) | PRD 명시, 외부 라이브러리 불필요한 수준의 상태 관리 |
| 배포 | Vercel | Next.js와의 자연스러운 통합, PRD 명시 |
| 애니메이션 제어 | async/await + requestAnimationFrame | 정렬 스텝별 지연(sleep)과 부드러운 렌더링 동시 달성 |

---

## 🔗 의존성 맵

```
Phase 1: UI 뼈대 + 랜덤 배열 생성
    └── Phase 2: 애니메이션 유틸리티 (sleep, 비동기 처리)
        └── Phase 3: 기본 알고리즘 (버블, 선택, 삽입 정렬)
            └── Phase 4: 고급 알고리즘 (퀵, 병합 정렬)
                └── Phase 5: 마무리 (다크모드, 복잡도 정보)
```

- Phase 2는 Phase 1의 UI 컴포넌트와 배열 상태에 의존
- Phase 3은 Phase 2의 애니메이션 유틸리티에 의존
- Phase 4는 Phase 3의 시각화 패턴(색상 피드백, 스왑 표현)을 재활용
- Phase 5는 전체 기능이 안정된 후 진행

---

## Phase 1: UI 뼈대 구축 (Sprint 1) ✅

**완료일:** 2026-03-13

### 목표
Tailwind CSS를 이용한 전체 레이아웃 설계 및 랜덤 막대 배열 생성 로직 구현. 사용자가 배열 크기를 조절하고 새 배열을 생성할 수 있는 인터랙티브 UI 완성.

### 작업 목록

- ✅ **프로젝트 초기 설정** (복잡도: 낮음)
  - Next.js 프로젝트 생성 (`npx create-next-app@latest --tailwind --typescript`)
  - 불필요한 보일러플레이트 코드 제거
  - 기본 폴더 구조 정리 (`components/`, `utils/`, `types/`)

- ✅ **Top Navigation 컴포넌트** (복잡도: 낮음)
  - 로고 및 프로젝트 타이틀 ("Sorting Algorithm Visualizer") 표시
  - 알고리즘 선택 드롭다운 (UI만 구현, 동작은 Phase 3에서 연결)
    - 옵션: 버블 정렬, 선택 정렬, 삽입 정렬, 퀵 정렬, 병합 정렬
  - 배열 크기 슬라이더 (range: 10~100, 기본값: 50)
  - 애니메이션 속도 슬라이더 (UI만 배치, 동작은 Phase 2에서 연결)

- ✅ **Main Visualizer Area 컴포넌트** (복잡도: 중간)
  - 막대 그래프 렌더링 영역 (화면 중앙, 반응형)
  - 배열 크기에 따라 막대 너비 자동 조정 (`flex` 또는 비율 계산)
  - 막대 높이는 배열 값에 비례 (최소 5px ~ 컨테이너 높이 100%)
  - 기본 색상: 파란색 (`bg-blue-500`)

- ✅ **Control Bar 컴포넌트** (복잡도: 낮음)
  - "새 배열 생성" 버튼 -> 클릭 시 랜덤 배열 생성
  - "정렬 시작" 버튼 (UI만 배치, 동작은 Phase 3에서 연결)
  - 정렬 진행 중일 때 버튼 비활성화 상태 표시 (disabled 스타일)

- ✅ **랜덤 배열 생성 로직** (복잡도: 낮음)
  - `generateRandomArray(size: number): number[]` 유틸리티 함수
  - 값 범위: 5 ~ 500 (막대 높이로 직접 사용)
  - 배열 크기 슬라이더 변경 시 자동으로 새 배열 생성

- ✅ **반응형 레이아웃** (복잡도: 중간)
  - 모바일(< 640px): 슬라이더와 버튼 세로 배치
  - 태블릿(640px~1024px): 컨트롤 2열 배치
  - 데스크톱(> 1024px): 전체 가로 배치

### 완료 기준 (Definition of Done)
- ✅ `npm run dev`로 개발 서버 실행 시 레이아웃이 정상 렌더링됨
- ✅ "새 배열 생성" 버튼 클릭 시 랜덤 막대 그래프가 표시됨
- ✅ 배열 크기 슬라이더 조작 시 막대 개수가 변경됨
- ✅ 모바일/데스크톱 뷰포트에서 레이아웃이 깨지지 않음
- ✅ 브라우저 콘솔에 에러/경고가 없음

### 🧪 Playwright MCP 검증 시나리오
> `npm run dev` 실행 후 아래 순서로 검증

**레이아웃 렌더링 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_snapshot` -> 타이틀, 드롭다운, 슬라이더, 버튼이 모두 존재하는지 확인
3. `browser_console_messages(level: "error")` -> 콘솔 에러 없음 확인

**랜덤 배열 생성 검증:**
4. `browser_click` -> "새 배열 생성" 버튼 클릭
5. `browser_snapshot` -> 막대 그래프 요소들이 렌더링되었는지 확인

**배열 크기 슬라이더 검증:**
6. `browser_click` -> 배열 크기 슬라이더 조작 (값 변경)
7. `browser_snapshot` -> 막대 개수가 변경되었는지 확인

**반응형 검증:**
8. `browser_resize(width: 375, height: 812)` -> 모바일 뷰포트
9. `browser_snapshot` -> 레이아웃이 세로로 적절히 배치되는지 확인
10. `browser_resize(width: 1440, height: 900)` -> 데스크톱 뷰포트 복원

### 기술 고려사항
- Next.js App Router 사용 시 클라이언트 컴포넌트(`"use client"`)로 인터랙티브 부분 분리
- Tailwind CSS 클래스만으로 스타일링 (커스텀 CSS 최소화)
- 배열 상태는 최상위 페이지 컴포넌트에서 `useState`로 관리

---

## Phase 2: 핵심 유틸리티 (Sprint 2) 📋

### 목표
정렬 애니메이션의 핵심인 비동기 지연(sleep) 함수, 스왑 함수, 색상 상태 관리 구조를 구현. Phase 3에서 알고리즘 구현 시 재사용할 공통 유틸리티 완성.

### 작업 목록

- ⬜ **sleep 유틸리티 함수** (복잡도: 낮음)
  - `sleep(ms: number): Promise<void>` 구현
  - 속도 슬라이더 값과 연동 (슬라이더 값을 ms로 변환)
  - 속도 범위: 1ms(최고속) ~ 500ms(최저속)

- ⬜ **애니메이션 상태 타입 정의** (복잡도: 낮음)
  - `BarState` 타입: `'default' | 'comparing' | 'swapping' | 'sorted'`
  - 각 상태에 대응하는 색상 매핑:
    - default -> `bg-blue-500` (파란색)
    - comparing -> `bg-red-500` (빨간색)
    - swapping -> `bg-yellow-400` (노란색)
    - sorted -> `bg-green-500` (초록색)
  - 배열과 동일 길이의 상태 배열 `barStates: BarState[]` 관리

- ⬜ **스왑 함수 및 배열 업데이트 로직** (복잡도: 중간)
  - `swap(arr: number[], i: number, j: number)` 유틸리티
  - 스왑 시 React 상태 업데이트 (불변성 유지: 배열 복사 후 교환)
  - 스왑 전/후 색상 상태 변경 포함

- ⬜ **정렬 실행 제어 구조** (복잡도: 중간)
  - `useRef`를 활용한 정렬 중단 플래그 (`isSorting`, `shouldStop`)
  - "정렬 시작" 클릭 시 `isSorting = true`, UI 컨트롤 비활성화
  - "초기화" 클릭 시 `shouldStop = true`, 진행 중인 정렬 중단
  - 정렬 완료 시 모든 막대를 `sorted` 상태(초록색)로 순차 변경하는 완료 애니메이션

- ⬜ **속도 슬라이더 실시간 연동** (복잡도: 낮음)
  - 정렬 진행 중에도 속도 슬라이더 조작 가능
  - `useRef`로 현재 속도 값 참조 (리렌더링 없이 다음 sleep에 반영)

### 완료 기준 (Definition of Done)
- ✅ 속도 슬라이더 변경 시 콘솔/UI로 속도 값 변경이 확인됨
- ✅ 테스트용 더미 정렬(예: 첫 두 요소 스왑)로 색상 변화가 정상 동작함
- ✅ 정렬 진행 중 "초기화" 클릭 시 즉시 중단되고 새 배열이 생성됨
- ✅ 정렬 진행 중 "새 배열 생성", "정렬 시작" 버튼이 비활성화됨
- ✅ 브라우저 콘솔에 에러/경고가 없음

### 🧪 Playwright MCP 검증 시나리오
> `npm run dev` 실행 후 아래 순서로 검증

**색상 상태 변화 검증 (더미 스왑):**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_click` -> "새 배열 생성" 버튼 클릭
3. `browser_snapshot` -> 모든 막대가 파란색(기본) 상태 확인
4. `browser_click` -> "정렬 시작" 버튼 클릭
5. `browser_snapshot` -> 비교/스왑 중 색상 변화(빨간색/노란색) 확인
6. `browser_console_messages(level: "error")` -> 에러 없음 확인

**실행 제어 검증:**
7. `browser_click` -> "새 배열 생성" 버튼 클릭
8. `browser_click` -> "정렬 시작" 버튼 클릭
9. `browser_snapshot` -> 정렬 중 버튼 비활성화 상태 확인
10. `browser_click` -> "초기화" 버튼 클릭 (정렬 중단)
11. `browser_snapshot` -> 새 배열로 초기화되었는지 확인

**속도 슬라이더 검증:**
12. 속도 슬라이더를 최저속으로 설정
13. `browser_click` -> "정렬 시작" 버튼 클릭
14. `browser_snapshot` -> 애니메이션이 느리게 진행되는지 시각적 확인

### 기술 고려사항
- `useRef`로 속도 값과 중단 플래그를 관리하여 불필요한 리렌더링 방지
- async/await 기반 정렬 루프에서 매 스텝마다 `shouldStop` 확인
- 상태 업데이트 시 `setState(prev => [...prev])` 패턴으로 불변성 보장

---

## Phase 3: 기본 알고리즘 시각화 (Sprint 3) 📋

### 목표
버블 정렬, 선택 정렬, 삽입 정렬 3가지 기본 알고리즘의 시각화를 완성. 알고리즘 선택 드롭다운과 연동하여 사용자가 선택한 알고리즘으로 정렬 실행.

### 작업 목록

- ⬜ **버블 정렬 (Bubble Sort) 시각화** (복잡도: 낮음, Must Have)
  - `async bubbleSort(arr, setArray, setStates, speedRef, stopRef)` 구현
  - 인접 요소 비교 시 두 막대를 빨간색으로 변경
  - 스왑 발생 시 노란색으로 변경 후 교환
  - 각 패스 완료 시 마지막 요소부터 초록색으로 변경

- ⬜ **선택 정렬 (Selection Sort) 시각화** (복잡도: 낮음, Must Have)
  - `async selectionSort(arr, setArray, setStates, speedRef, stopRef)` 구현
  - 현재 탐색 중인 요소를 빨간색으로 표시
  - 최솟값 후보를 별도 색상(노란색)으로 강조
  - 선택 완료 후 정렬된 위치의 요소를 초록색으로 변경

- ⬜ **삽입 정렬 (Insertion Sort) 시각화** (복잡도: 중간, Must Have)
  - `async insertionSort(arr, setArray, setStates, speedRef, stopRef)` 구현
  - 삽입할 요소를 빨간색으로 표시
  - 요소 이동(shift) 과정을 노란색으로 표시
  - 삽입 완료된 구간을 초록색으로 표시

- ⬜ **알고리즘 선택 드롭다운 연동** (복잡도: 낮음, Must Have)
  - 드롭다운에서 알고리즘 선택 시 상태 업데이트
  - "정렬 시작" 버튼 클릭 시 선택된 알고리즘 함수 실행
  - 알고리즘 매핑 객체: `{ 'bubble': bubbleSort, 'selection': selectionSort, ... }`

- ⬜ **정렬 완료 애니메이션** (복잡도: 낮음, Should Have)
  - 정렬 완료 후 왼쪽부터 오른쪽으로 순차적으로 초록색 전환
  - 각 막대 전환 간 짧은 딜레이 (20~50ms)로 "웨이브" 효과

### 완료 기준 (Definition of Done)
- ✅ 버블/선택/삽입 정렬 각각 선택 후 "정렬 시작" 시 애니메이션이 정상 실행됨
- ✅ 비교(빨간색), 스왑(노란색), 완료(초록색) 색상이 논리적으로 변경됨
- ✅ 정렬 완료 후 배열이 실제로 오름차순 정렬되어 있음 (막대 높이 순서 확인)
- ✅ 정렬 중 "초기화" 시 즉시 중단됨
- ✅ 정렬 중 속도 슬라이더 변경이 실시간 반영됨

### 🧪 Playwright MCP 검증 시나리오
> `npm run dev` 실행 후 아래 순서로 검증

**버블 정렬 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_click` -> "새 배열 생성" 버튼 클릭
3. `browser_select_option` -> 알고리즘 드롭다운에서 "버블 정렬" 선택
4. `browser_click` -> "정렬 시작" 버튼 클릭
5. `browser_snapshot` -> 색상 변화(비교/스왑) 확인
6. `browser_wait_for` -> 정렬 완료 대기 (모든 막대 초록색)
7. `browser_snapshot` -> 모든 막대가 오름차순 + 초록색 확인

**선택 정렬 검증:**
8. `browser_click` -> "새 배열 생성" 버튼 클릭
9. `browser_select_option` -> "선택 정렬" 선택
10. `browser_click` -> "정렬 시작" 버튼 클릭
11. `browser_wait_for` -> 정렬 완료 대기
12. `browser_snapshot` -> 정렬 결과 확인

**삽입 정렬 검증:**
13. `browser_click` -> "새 배열 생성" 버튼 클릭
14. `browser_select_option` -> "삽입 정렬" 선택
15. `browser_click` -> "정렬 시작" 버튼 클릭
16. `browser_wait_for` -> 정렬 완료 대기
17. `browser_snapshot` -> 정렬 결과 확인

**공통 검증:**
18. `browser_console_messages(level: "error")` -> 콘솔 에러 없음 확인

### 기술 고려사항
- 각 알고리즘 함수는 동일한 인터페이스를 가져야 함 (교체 가능성)
- 알고리즘 함수는 `utils/algorithms/` 디렉토리에 개별 파일로 분리
- 매 비교/스왑 스텝마다 `await sleep(speedRef.current)` 호출
- 매 스텝마다 `if (stopRef.current) return` 체크

---

## Phase 4: 고급 알고리즘 시각화 (Sprint 4) 📋

### 목표
재귀 기반 퀵 정렬과 병합 정렬의 시각화 구현. 재귀 호출 과정에서의 분할(partition/merge) 구간을 시각적으로 구분하여 알고리즘 이해도 향상.

### 작업 목록

- ⬜ **퀵 정렬 (Quick Sort) 시각화** (복잡도: 높음, Must Have)
  - `async quickSort(arr, low, high, setArray, setStates, speedRef, stopRef)` 구현
  - 피벗 요소를 별도 색상(노란색)으로 강조
  - 분할(partition) 과정에서 비교 요소를 빨간색으로 표시
  - 피벗이 최종 위치에 놓이면 초록색으로 변경
  - 재귀 호출 시 현재 처리 구간을 시각적으로 구분

- ⬜ **병합 정렬 (Merge Sort) 시각화** (복잡도: 높음, Must Have)
  - `async mergeSort(arr, left, right, setArray, setStates, speedRef, stopRef)` 구현
  - 분할 단계: 현재 분할 구간을 색상으로 구분
  - 병합 단계: 병합 중인 두 요소를 빨간색으로 비교 표시
  - 병합 완료된 요소를 노란색 -> 초록색으로 전환
  - 보조 배열 사용 시 원본 배열에 값 복사하는 과정 시각화

- ⬜ **알고리즘 선택 드롭다운 확장** (복잡도: 낮음, Must Have)
  - 기존 매핑 객체에 퀵 정렬, 병합 정렬 추가
  - 5가지 알고리즘 모두 선택/실행 가능

### 완료 기준 (Definition of Done)
- ✅ 퀵 정렬 선택 후 "정렬 시작" 시 피벗/분할 과정이 시각화됨
- ✅ 병합 정렬 선택 후 "정렬 시작" 시 분할/병합 과정이 시각화됨
- ✅ 두 알고리즘 모두 정렬 완료 후 배열이 오름차순임
- ✅ 재귀 깊이가 깊어져도 (배열 크기 100) 정상 동작하고 브라우저가 멈추지 않음
- ✅ 기존 3가지 기본 알고리즘과 동일한 색상 피드백 패턴 유지
- ✅ 정렬 중 "초기화" 시 재귀 정렬도 즉시 중단됨

### 🧪 Playwright MCP 검증 시나리오
> `npm run dev` 실행 후 아래 순서로 검증

**퀵 정렬 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_click` -> "새 배열 생성" 버튼 클릭
3. `browser_select_option` -> "퀵 정렬" 선택
4. `browser_click` -> "정렬 시작" 버튼 클릭
5. `browser_snapshot` -> 피벗(노란색) 및 비교(빨간색) 색상 확인
6. `browser_wait_for` -> 정렬 완료 대기
7. `browser_snapshot` -> 모든 막대 초록색 + 오름차순 확인

**병합 정렬 검증:**
8. `browser_click` -> "새 배열 생성" 버튼 클릭
9. `browser_select_option` -> "병합 정렬" 선택
10. `browser_click` -> "정렬 시작" 버튼 클릭
11. `browser_snapshot` -> 분할/병합 과정 색상 변화 확인
12. `browser_wait_for` -> 정렬 완료 대기
13. `browser_snapshot` -> 정렬 결과 확인

**대규모 배열 안정성 검증:**
14. 배열 크기 슬라이더를 100으로 설정
15. `browser_select_option` -> "퀵 정렬" 선택
16. `browser_click` -> "정렬 시작" 버튼 클릭
17. `browser_wait_for` -> 정렬 완료 대기 (브라우저 응답성 유지 확인)
18. `browser_console_messages(level: "error")` -> 에러 없음 확인

**중단 검증:**
19. `browser_click` -> "새 배열 생성" 버튼 클릭
20. `browser_select_option` -> "병합 정렬" 선택 (속도 슬라이더 최저속)
21. `browser_click` -> "정렬 시작" 버튼 클릭
22. `browser_click` -> "초기화" 버튼 클릭 (정렬 중단)
23. `browser_snapshot` -> 새 배열로 초기화 확인

### 기술 고려사항
- 재귀 함수 내부에서 매 단계마다 `stopRef.current` 체크 필수 (중단 지원)
- 병합 정렬의 보조 배열 사용 시 원본 배열 인덱스와 시각화 인덱스 일치 유의
- 퀵 정렬 피벗 선택 전략: 마지막 요소 (Lomuto partition) - 구현 단순성 우선
- `async` 재귀 함수에서 `await` 누락 시 애니메이션이 건너뛰어지므로 주의

---

## Phase 5: 마무리 및 UX 개선 (Sprint 5) 📋

### 목표
다크모드 지원 및 알고리즘별 시간/공간 복잡도 정보 표시. 전반적인 UI 품질 개선 및 배포 준비.

### 작업 목록

- ⬜ **다크모드 지원** (복잡도: 중간, Should Have)
  - Tailwind CSS `dark:` 접두사를 활용한 다크모드 스타일링
  - 시스템 설정 자동 감지 (`prefers-color-scheme: dark`)
  - 토글 버튼으로 수동 전환 가능
  - 다크모드에서 막대 색상이 배경과 구분되도록 색상 조정

- ⬜ **알고리즘 복잡도 정보 표시** (복잡도: 낮음, Should Have)
  - 선택된 알고리즘의 시간/공간 복잡도 정보 표시 영역
  - 표시 항목: 최선/평균/최악 시간 복잡도, 공간 복잡도, 안정성(Stable/Unstable)
  - 각 알고리즘별 복잡도 데이터 상수로 정의

- ⬜ **UI/UX 최종 개선** (복잡도: 중간, Should Have)
  - 애니메이션 부드러움 점검 및 최적화
  - 버튼/슬라이더 hover/active 상태 스타일링
  - 접근성 개선: aria-label, 키보드 네비게이션
  - 모바일 터치 인터랙션 점검

- ⬜ **배포 준비** (복잡도: 낮음, Must Have)
  - `next build` 빌드 에러 없음 확인
  - Vercel 또는 GitHub Pages 배포 설정
  - Open Graph 메타 태그 설정 (프로젝트 제목, 설명, 이미지)
  - favicon 설정

### 완료 기준 (Definition of Done)
- ✅ 다크/라이트 모드 전환이 모든 컴포넌트에서 정상 동작함
- ✅ 알고리즘 선택 시 정확한 복잡도 정보가 표시됨
- ✅ `next build` 빌드 성공, 경고 없음
- ✅ Lighthouse 성능 점수 90+ (Performance, Accessibility, Best Practices)
- ✅ 모바일/데스크톱에서 모든 기능이 정상 동작함

### 🧪 Playwright MCP 검증 시나리오
> `npm run dev` 실행 후 아래 순서로 검증

**다크모드 검증:**
1. `browser_navigate` -> `http://localhost:3000` 접속
2. `browser_snapshot` -> 라이트 모드 기본 렌더링 확인
3. `browser_click` -> 다크모드 토글 버튼 클릭
4. `browser_take_screenshot` -> 다크모드 스타일 시각적 확인
5. `browser_snapshot` -> 막대 색상이 다크 배경에서 구분되는지 확인

**복잡도 정보 검증:**
6. `browser_select_option` -> "버블 정렬" 선택
7. `browser_snapshot` -> 시간 복잡도 O(n^2), 공간 복잡도 O(1) 표시 확인
8. `browser_select_option` -> "병합 정렬" 선택
9. `browser_snapshot` -> 시간 복잡도 O(n log n), 공간 복잡도 O(n) 표시 확인

**전체 기능 통합 검증:**
10. `browser_click` -> "새 배열 생성" 버튼 클릭
11. `browser_select_option` -> "퀵 정렬" 선택
12. `browser_click` -> "정렬 시작" 버튼 클릭
13. `browser_wait_for` -> 정렬 완료 대기
14. `browser_snapshot` -> 정렬 완료 상태 확인
15. `browser_console_messages(level: "error")` -> 에러 없음 확인

**반응형 최종 검증:**
16. `browser_resize(width: 375, height: 812)` -> 모바일 뷰
17. `browser_snapshot` -> 모바일 레이아웃 정상 확인
18. `browser_resize(width: 1440, height: 900)` -> 데스크톱 뷰 복원

### 기술 고려사항
- Tailwind `darkMode: 'class'` 설정으로 수동 토글 지원
- 다크모드 상태는 `localStorage`에 저장하여 새로고침 후에도 유지
- 복잡도 정보는 정적 데이터이므로 별도 상수 파일로 관리
- `next build` 후 정적 HTML 생성 확인 (SSG)

---

## ⚠️ 리스크 및 완화 전략

| 리스크 | 영향도 | 발생 확률 | 완화 전략 |
|--------|--------|-----------|-----------|
| 대규모 배열(100개)에서 애니메이션 끊김 | 높음 | 중간 | `requestAnimationFrame` 활용, 배치 업데이트로 리렌더링 최소화 |
| 재귀 알고리즘(퀵/병합) 중단 시 상태 불일치 | 중간 | 높음 | 매 재귀 단계마다 `stopRef` 체크, 중단 시 상태 완전 초기화 |
| 비동기 정렬 함수의 메모리 누수 | 중간 | 낮음 | 컴포넌트 언마운트 시 정렬 중단 (`useEffect` cleanup) |
| 모바일에서 슬라이더 조작 어려움 | 낮음 | 중간 | 슬라이더 터치 영역 확대, 숫자 직접 입력 대안 고려 |

---

## 📈 마일스톤

| 마일스톤 | Phase | 예상일 | 설명 |
|----------|-------|--------|------|
| M1: 인터랙티브 UI 완성 | Phase 1 완료 | 2026-03-27 | 랜덤 배열 생성 및 레이아웃 완성 |
| M2: 애니메이션 엔진 완성 | Phase 2 완료 | 2026-04-10 | 색상 피드백, 속도 제어, 중단 기능 |
| **M3: MVP 릴리스** | **Phase 3 완료** | **2026-04-24** | **기본 3종 알고리즘 시각화 - 사용자에게 핵심 가치 제공** |
| M4: 풀 알고리즘 지원 | Phase 4 완료 | 2026-05-08 | 5종 알고리즘 전체 시각화 완성 |
| M5: 프로덕션 릴리스 | Phase 5 완료 | 2026-05-22 | 다크모드, 복잡도 정보, 배포 완료 |

> **MVP 범위**: Phase 1~3 완료 시점 (UI + 애니메이션 엔진 + 기본 3종 알고리즘). 사용자가 정렬 과정을 시각적으로 이해할 수 있는 최소 기능을 제공.

---

## 🔮 향후 계획 (Backlog) - Won't Have (현재 버전)

아래 기능은 PRD 범위 밖이지만, MVP 이후 확장 시 고려할 수 있는 항목입니다.

- ⬜ **알고리즘 비교 모드**: 두 알고리즘을 동시에 실행하여 속도 비교
- ⬜ **스텝 바이 스텝 모드**: 한 단계씩 수동으로 진행하는 교육용 모드
- ⬜ **비교/스왑 카운터**: 실시간 비교 횟수 및 스왑 횟수 표시
- ⬜ **사운드 피드백**: 막대 높이에 따른 사운드 출력 (사인파 등)
- ⬜ **추가 알고리즘**: 힙 정렬, 셸 정렬, 기수 정렬, 카운팅 정렬
- ⬜ **사용자 정의 배열**: 직접 값을 입력하여 배열 생성
- ⬜ **알고리즘 코드 표시**: 현재 실행 중인 코드 라인 하이라이팅

---

## 기술 부채 관리

| Phase | 예상 기술 부채 | 해소 시점 |
|-------|---------------|-----------|
| Phase 2 | sleep 기반 애니메이션의 프레임 드롭 가능성 | Phase 5에서 requestAnimationFrame으로 최적화 검토 |
| Phase 3 | 알고리즘 함수의 인터페이스 불일치 가능성 | Phase 4 시작 전 인터페이스 통일 리팩토링 |
| Phase 4 | 재귀 알고리즘의 상태 관리 복잡도 증가 | Phase 5에서 코드 정리 및 주석 보강 |
