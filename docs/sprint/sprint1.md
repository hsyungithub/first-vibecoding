# Sprint 1 구현 계획: UI 뼈대 구축

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tailwind CSS 기반 레이아웃 및 랜덤 막대 배열 생성 기능을 포함한 인터랙티브 UI 뼈대 완성

**Architecture:** Next.js App Router를 사용하여 클라이언트 컴포넌트(`"use client"`)로 인터랙티브 영역을 분리하고, 배열 상태는 최상위 페이지 컴포넌트에서 `useState`로 단일 관리한다. Tailwind CSS 유틸리티 클래스만 사용하여 커스텀 CSS를 최소화한다.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, React Hooks (useState, useEffect)

---

## 스프린트 정보

| 항목 | 내용 |
|------|------|
| 스프린트 번호 | Sprint 1 |
| 대응 Phase | Phase 1: UI 뼈대 구축 |
| 기간 | 2026-03-13 ~ 2026-03-27 (2주) |
| 목표 마일스톤 | M1: 인터랙티브 UI 완성 |

---

## 구현 범위

### 포함 항목
- Next.js + TypeScript + Tailwind CSS 프로젝트 초기 설정
- Top Navigation 컴포넌트 (타이틀, 알고리즘 드롭다운 UI, 슬라이더 2개)
- Main Visualizer Area 컴포넌트 (막대 그래프 렌더링)
- Control Bar 컴포넌트 (새 배열 생성 버튼, 정렬 시작 버튼 UI)
- `generateRandomArray` 유틸리티 함수
- 반응형 레이아웃 (모바일 / 태블릿 / 데스크톱)

### 제외 항목 (이후 Phase에서 구현)
- 알고리즘 실제 동작 로직 (Phase 3~4)
- 애니메이션 및 색상 상태 변화 (Phase 2)
- 속도 슬라이더 실제 연동 (Phase 2)
- 다크모드 (Phase 5)

---

## 작업 목록 (Task Breakdown)

### Task 1: 프로젝트 초기 설정

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts` (자동 생성)
- Modify: `src/app/globals.css` (보일러플레이트 제거)
- Modify: `src/app/page.tsx` (보일러플레이트 제거)
- Create: `src/components/.gitkeep`, `src/utils/.gitkeep`, `src/types/.gitkeep`

**Step 1: Next.js 프로젝트 생성**

```bash
npx create-next-app@latest sorting-visualizer \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --no-eslint \
  --import-alias "@/*"
cd sorting-visualizer
```

**Step 2: 폴더 구조 생성**

```bash
mkdir -p src/components src/utils src/types
```

**Step 3: 보일러플레이트 제거 — `src/app/globals.css`**

아래 내용으로 교체 (기본 Tailwind 지시문만 유지):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: 보일러플레이트 제거 — `src/app/page.tsx`**

아래 내용으로 교체:
```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <p>Sorting Algorithm Visualizer</p>
    </main>
  );
}
```

**Step 5: 개발 서버 실행 확인**

```bash
npm run dev
```

Expected: `http://localhost:3000` 접속 시 "Sorting Algorithm Visualizer" 텍스트가 표시됨

**Step 6: Commit**

```bash
git add .
git commit -m "feat: Next.js 프로젝트 초기 설정 및 보일러플레이트 제거"
```

---

### Task 2: 타입 정의

**Files:**
- Create: `src/types/index.ts`

**Step 1: 타입 파일 작성**

```typescript
// src/types/index.ts

/** 지원하는 정렬 알고리즘 목록 */
export type AlgorithmType =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'quick'
  | 'merge';

export interface AlgorithmOption {
  value: AlgorithmType;
  label: string;
}

export const ALGORITHM_OPTIONS: AlgorithmOption[] = [
  { value: 'bubble', label: '버블 정렬' },
  { value: 'selection', label: '선택 정렬' },
  { value: 'insertion', label: '삽입 정렬' },
  { value: 'quick', label: '퀵 정렬' },
  { value: 'merge', label: '병합 정렬' },
];

/** 배열 크기 범위 */
export const ARRAY_SIZE_MIN = 10;
export const ARRAY_SIZE_MAX = 100;
export const ARRAY_SIZE_DEFAULT = 50;

/** 막대 높이 값 범위 */
export const BAR_VALUE_MIN = 5;
export const BAR_VALUE_MAX = 500;
```

**Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: 공유 타입 및 상수 정의"
```

---

### Task 3: generateRandomArray 유틸리티 함수

**Files:**
- Create: `src/utils/array.ts`
- Create: `src/__tests__/utils/array.test.ts`

**Step 1: 테스트 파일 먼저 작성 (TDD)**

```typescript
// src/__tests__/utils/array.test.ts
import { describe, it, expect } from 'vitest';
import { generateRandomArray } from '../../utils/array';

describe('generateRandomArray', () => {
  it('요청한 크기와 동일한 배열을 반환한다', () => {
    const result = generateRandomArray(10);
    expect(result).toHaveLength(10);
  });

  it('모든 값이 BAR_VALUE_MIN(5) 이상 BAR_VALUE_MAX(500) 이하다', () => {
    const result = generateRandomArray(50);
    result.forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(500);
    });
  });

  it('크기 0을 받으면 빈 배열을 반환한다', () => {
    expect(generateRandomArray(0)).toHaveLength(0);
  });

  it('호출할 때마다 다른 배열을 반환한다 (무작위성)', () => {
    const a = generateRandomArray(100);
    const b = generateRandomArray(100);
    // 100개 배열이 완전히 동일할 확률은 사실상 0
    expect(a).not.toEqual(b);
  });
});
```

**Step 2: 테스트 실패 확인**

Vitest 설치 및 실행:
```bash
npm install -D vitest
npx vitest run src/__tests__/utils/array.test.ts
```

Expected: FAIL — "Cannot find module '../../utils/array'"

**Step 3: 유틸리티 함수 구현**

```typescript
// src/utils/array.ts
import { BAR_VALUE_MIN, BAR_VALUE_MAX } from '@/types';

/**
 * 지정한 크기의 랜덤 배열을 생성한다.
 * @param size - 배열 크기 (10 ~ 100)
 * @returns BAR_VALUE_MIN ~ BAR_VALUE_MAX 범위의 정수 배열
 */
export function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (BAR_VALUE_MAX - BAR_VALUE_MIN + 1)) + BAR_VALUE_MIN
  );
}
```

**Step 4: 테스트 통과 확인**

```bash
npx vitest run src/__tests__/utils/array.test.ts
```

Expected: PASS (4 tests)

**Step 5: Commit**

```bash
git add src/utils/array.ts src/__tests__/utils/array.test.ts
git commit -m "feat: generateRandomArray 유틸리티 함수 구현 (TDD)"
```

---

### Task 4: TopNav 컴포넌트

**Files:**
- Create: `src/components/TopNav.tsx`

**Step 1: 컴포넌트 구현**

```tsx
// src/components/TopNav.tsx
"use client";

import { AlgorithmType, ALGORITHM_OPTIONS, ARRAY_SIZE_MIN, ARRAY_SIZE_MAX } from "@/types";

interface TopNavProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
}

export default function TopNav({
  selectedAlgorithm,
  onAlgorithmChange,
  arraySize,
  onArraySizeChange,
  animationSpeed,
  onAnimationSpeedChange,
}: TopNavProps) {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* 로고 및 타이틀 */}
        <h1 className="text-lg font-bold text-white whitespace-nowrap">
          Sorting Algorithm Visualizer
        </h1>

        {/* 컨트롤 영역 */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          {/* 알고리즘 선택 드롭다운 */}
          <div className="flex items-center gap-2">
            <label htmlFor="algorithm-select" className="text-sm text-gray-300 whitespace-nowrap">
              알고리즘
            </label>
            <select
              id="algorithm-select"
              value={selectedAlgorithm}
              onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmType)}
              className="bg-gray-800 text-white text-sm border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ALGORITHM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 배열 크기 슬라이더 */}
          <div className="flex items-center gap-2">
            <label htmlFor="array-size-slider" className="text-sm text-gray-300 whitespace-nowrap">
              배열 크기: {arraySize}
            </label>
            <input
              id="array-size-slider"
              type="range"
              min={ARRAY_SIZE_MIN}
              max={ARRAY_SIZE_MAX}
              value={arraySize}
              onChange={(e) => onArraySizeChange(Number(e.target.value))}
              className="w-24 sm:w-32 accent-blue-500"
              aria-label="배열 크기 조절"
            />
          </div>

          {/* 애니메이션 속도 슬라이더 (UI만, Phase 2에서 연동) */}
          <div className="flex items-center gap-2">
            <label htmlFor="speed-slider" className="text-sm text-gray-300 whitespace-nowrap">
              속도: {animationSpeed}
            </label>
            <input
              id="speed-slider"
              type="range"
              min={1}
              max={10}
              value={animationSpeed}
              onChange={(e) => onAnimationSpeedChange(Number(e.target.value))}
              className="w-24 sm:w-32 accent-blue-500"
              aria-label="애니메이션 속도 조절"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/TopNav.tsx
git commit -m "feat: TopNav 컴포넌트 구현 (드롭다운, 슬라이더)"
```

---

### Task 5: VisualizerArea 컴포넌트

**Files:**
- Create: `src/components/VisualizerArea.tsx`

**Step 1: 컴포넌트 구현**

```tsx
// src/components/VisualizerArea.tsx
"use client";

import { BAR_VALUE_MAX } from "@/types";

interface VisualizerAreaProps {
  array: number[];
}

export default function VisualizerArea({ array }: VisualizerAreaProps) {
  return (
    <section
      className="flex-1 flex items-end justify-center gap-px px-4 py-6 bg-gray-950"
      aria-label="정렬 시각화 영역"
    >
      {array.map((value, index) => {
        // 막대 높이: 값 / 최대값 × 100% (컨테이너 기준)
        const heightPercent = (value / BAR_VALUE_MAX) * 100;

        return (
          <div
            key={index}
            className="bg-blue-500 rounded-t-sm transition-none"
            style={{
              height: `${heightPercent}%`,
              // 배열 크기에 따라 막대 너비 자동 조정
              flex: "1 1 0%",
              minWidth: "1px",
              maxWidth: "20px",
            }}
            aria-label={`막대 ${index + 1}: 높이 ${value}`}
          />
        );
      })}
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/VisualizerArea.tsx
git commit -m "feat: VisualizerArea 컴포넌트 구현 (막대 그래프 렌더링)"
```

---

### Task 6: ControlBar 컴포넌트

**Files:**
- Create: `src/components/ControlBar.tsx`

**Step 1: 컴포넌트 구현**

```tsx
// src/components/ControlBar.tsx
"use client";

interface ControlBarProps {
  onGenerateArray: () => void;
  onStartSort: () => void;
  isSorting: boolean;
}

export default function ControlBar({
  onGenerateArray,
  onStartSort,
  isSorting,
}: ControlBarProps) {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
        {/* 새 배열 생성 버튼 */}
        <button
          onClick={onGenerateArray}
          disabled={isSorting}
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="새 배열 생성"
        >
          새 배열 생성
        </button>

        {/* 정렬 시작 버튼 (Phase 3에서 실제 동작 연결) */}
        <button
          onClick={onStartSort}
          disabled={isSorting}
          className="px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-500 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="정렬 시작"
        >
          {isSorting ? "정렬 중..." : "정렬 시작"}
        </button>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/ControlBar.tsx
git commit -m "feat: ControlBar 컴포넌트 구현 (버튼, 비활성화 상태)"
```

---

### Task 7: 최상위 페이지 컴포넌트 조합 및 상태 관리

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/SortingVisualizer.tsx`

**Step 1: 클라이언트 컨테이너 컴포넌트 작성**

페이지(서버 컴포넌트)에서 클라이언트 로직을 분리하기 위해 별도 파일로 작성:

```tsx
// src/app/SortingVisualizer.tsx
"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import VisualizerArea from "@/components/VisualizerArea";
import ControlBar from "@/components/ControlBar";
import { generateRandomArray } from "@/utils/array";
import {
  AlgorithmType,
  ARRAY_SIZE_DEFAULT,
} from "@/types";

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(ARRAY_SIZE_DEFAULT);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("bubble");
  const [animationSpeed, setAnimationSpeed] = useState<number>(5);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  // 초기 배열 생성 및 배열 크기 변경 시 자동 재생성
  useEffect(() => {
    setArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleGenerateArray = () => {
    setArray(generateRandomArray(arraySize));
  };

  const handleStartSort = () => {
    // Phase 3에서 실제 정렬 알고리즘 연결
    console.log(`정렬 시작: ${selectedAlgorithm}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <TopNav
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
      />
      <VisualizerArea array={array} />
      <ControlBar
        onGenerateArray={handleGenerateArray}
        onStartSort={handleStartSort}
        isSorting={isSorting}
      />
    </div>
  );
}
```

**Step 2: 페이지 컴포넌트 수정**

```tsx
// src/app/page.tsx
import SortingVisualizer from "./SortingVisualizer";

export default function Home() {
  return <SortingVisualizer />;
}
```

**Step 3: 개발 서버에서 렌더링 확인**

```bash
npm run dev
```

`http://localhost:3000` 접속 후 확인:
- 타이틀이 네비게이션 바에 표시됨
- 알고리즘 드롭다운에 5가지 옵션이 있음
- 배열 크기 슬라이더가 기본값 50으로 표시됨
- 막대 그래프 50개가 렌더링됨
- "새 배열 생성" 버튼 클릭 시 새 배열이 표시됨
- 배열 크기 슬라이더 조작 시 막대 개수가 변경됨

**Step 4: Commit**

```bash
git add src/app/page.tsx src/app/SortingVisualizer.tsx
git commit -m "feat: 메인 페이지 조합 및 상태 관리 구현"
```

---

### Task 8: 반응형 레이아웃 점검

**Files:**
- 기존 컴포넌트 Tailwind 클래스 조정 (필요 시)

**Step 1: 반응형 브레이크포인트 검증**

`npm run dev` 실행 후 브라우저 개발자 도구에서 아래 뷰포트로 전환하여 레이아웃 확인:

| 뷰포트 | 확인 항목 |
|--------|-----------|
| 375px (모바일) | 슬라이더·버튼이 세로 배치, 막대가 화면 너비에 맞게 표시됨 |
| 768px (태블릿) | 컨트롤 2열 배치 |
| 1440px (데스크톱) | 전체 가로 배치, 막대가 충분한 너비로 표시됨 |

**Step 2: 필요 시 Tailwind 클래스 수정**

`TopNav.tsx`: `flex-col` -> `sm:flex-row` 전환 패턴 확인
`ControlBar.tsx`: `flex-col` -> `sm:flex-row` 전환 패턴 확인

**Step 3: Commit (수정이 있는 경우)**

```bash
git add src/components/TopNav.tsx src/components/ControlBar.tsx
git commit -m "fix: 반응형 레이아웃 브레이크포인트 조정"
```

---

## Playwright MCP 검증 시나리오

> `npm run dev` 실행 후 아래 순서로 검증. sprint-close 시점에 자동 실행됩니다.

### 레이아웃 렌더링 검증

```
1. browser_navigate -> http://localhost:3000 접속
2. browser_snapshot -> 타이틀, 드롭다운, 슬라이더 2개, 버튼 2개가 존재하는지 확인
3. browser_console_messages(level: "error") -> 콘솔 에러 없음 확인
```

### 랜덤 배열 생성 검증

```
4. browser_click -> "새 배열 생성" 버튼 클릭
5. browser_snapshot -> 막대 그래프 요소들이 렌더링되었는지 확인 (50개 기본값)
```

### 배열 크기 슬라이더 검증

```
6. 배열 크기 슬라이더를 최소값(10) 방향으로 조작
7. browser_snapshot -> 막대 개수가 줄어들었는지 확인
8. 배열 크기 슬라이더를 최대값(100) 방향으로 조작
9. browser_snapshot -> 막대 개수가 늘어났는지 확인
```

### 반응형 검증

```
10. browser_resize(width: 375, height: 812) -> 모바일 뷰포트
11. browser_snapshot -> 컨트롤이 세로로 배치되고 막대가 정상 표시되는지 확인
12. browser_resize(width: 1440, height: 900) -> 데스크톱 뷰포트 복원
13. browser_snapshot -> 가로 배치 확인
```

---

## 완료 기준 (Definition of Done)

- ✅ `npm run dev`로 개발 서버 실행 시 레이아웃이 정상 렌더링됨
- ✅ "새 배열 생성" 버튼 클릭 시 랜덤 막대 그래프가 표시됨
- ✅ 배열 크기 슬라이더 조작 시 막대 개수가 실시간 변경됨
- ✅ 모바일(375px)/데스크톱(1440px) 뷰포트에서 레이아웃이 깨지지 않음
- ✅ 브라우저 콘솔에 에러/경고가 없음
- ✅ `generateRandomArray` 단위 테스트 4개가 모두 통과함

---

## 검증 결과

- [Sprint 1 배포 체크리스트](sprint1/deploy.md)
- [코드 리뷰 보고서](sprint1/code-review.md)

### 자동 검증 요약 (2026-03-13)

| 항목 | 결과 | 비고 |
|------|------|------|
| `npm run build` | ✅ 성공 | Next.js 16.1.6, 빌드 시간 2.5초 |
| TypeScript 검사 | ✅ 통과 | 빌드 내 포함 |
| Playwright UI 검증 | ⬜ 수동 필요 | `npm run dev` 미실행 상태 |

---

## 기술 고려사항

### Next.js App Router 클라이언트 컴포넌트 분리
- 인터랙티브 로직이 필요한 컴포넌트에만 `"use client"` 선언
- 최상위 `page.tsx`는 서버 컴포넌트로 유지하고, `SortingVisualizer.tsx`를 클라이언트 경계로 사용

### Tailwind CSS 스타일링 원칙
- 커스텀 CSS(`globals.css`) 추가 없이 Tailwind 유틸리티 클래스만 사용
- 막대 높이처럼 동적으로 계산해야 하는 값은 인라인 `style` prop 사용 (Tailwind의 임의값 클래스보다 안전)
- 다크 배경(gray-950) 위에 파란색(blue-500) 막대로 기본 시각적 대비 확보

### 배열 상태 관리
- `array: number[]` — `SortingVisualizer`에서 단일 관리
- 배열 크기 변경 시 `useEffect([arraySize])`에서 자동으로 새 배열 생성
- 이후 Phase에서 `barStates: BarState[]` 배열이 추가될 예정이므로, 상태 위치를 `SortingVisualizer`에 유지

### Phase 2 연동 준비
- `isSorting` 상태와 `handleStartSort` 핸들러를 미리 정의해 두어 Phase 2에서 최소 변경으로 연동 가능
- `animationSpeed` 상태도 prop으로 전달만 하고, 실제 `useRef` 변환은 Phase 2에서 수행

---

## 의존성 및 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 막대 개수 100개일 때 렌더링 성능 | 낮음 | `gap-px` + `flex: 1 1 0%`로 브라우저 레이아웃 엔진에 위임, CSS 트랜지션 제거(`transition-none`) |
| 모바일 슬라이더 터치 조작 어려움 | 낮음 | `accent-blue-500`으로 슬라이더 가시성 확보, 현재 값 레이블 표시 |
| Next.js App Router `"use client"` 경계 오류 | 낮음 | 클라이언트 컴포넌트는 별도 파일(`SortingVisualizer.tsx`)로 분리 |

---

## 예상 산출물

Sprint 1 완료 시 다음이 제공됩니다:

1. **동작하는 Next.js 웹 앱** (`http://localhost:3000`)
   - 네비게이션 바 (타이틀, 드롭다운, 슬라이더 2개)
   - 막대 그래프 시각화 영역
   - 컨트롤 바 (새 배열 생성, 정렬 시작 버튼)
2. **유틸리티 함수** (`src/utils/array.ts`)
3. **단위 테스트** (`src/__tests__/utils/array.test.ts`, 4개 테스트 통과)
4. **반응형 레이아웃** (모바일 ~ 데스크톱)

---

## 실행 옵션

계획 완료. 두 가지 실행 방법 중 하나를 선택해주세요:

**1. 서브에이전트 방식 (현재 세션)** — 각 Task마다 서브에이전트를 디스패치하고, Task 간 검토 후 진행. 빠른 반복에 적합.

**2. 독립 세션 방식** — 새 세션을 열고 이 계획 파일을 참조하여 executing-plans 스킬로 일괄 실행. 배치 처리에 적합.

어떤 방식으로 진행하시겠습니까?
