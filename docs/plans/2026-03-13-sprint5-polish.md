# Sprint 5: 마무리 및 UX 개선 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 다크/라이트 모드 토글, 알고리즘 복잡도 정보 표시, OG 메타태그 추가로 프로덕션 준비 완료

**Architecture:** Tailwind v4 class-based 다크모드 (`dark` 클래스를 `<html>`에 토글), `useTheme` 훅으로 localStorage 연동. 복잡도 데이터는 순수 상수로 정의해 Vitest TDD 적용. OG 메타태그는 Next.js Metadata API 사용.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Vitest

---

## 현재 상태 파악

```
현재 앱: 다크 테마 고정 (bg-gray-950 배경, 흰 텍스트)
Tailwind: v4 (globals.css에 @import "tailwindcss"; 한 줄)
메타데이터: title/description만 있음, OG 없음
favicon: Next.js 기본 favicon.ico 존재
```

### 다크모드 동작 방식 (Tailwind v4)

Tailwind v4에서 class-based dark mode는 `globals.css`에 아래를 추가:
```css
@custom-variant dark (&:where(.dark, .dark *));
```
이후 컴포넌트에서 `dark:bg-gray-950 bg-white` 처럼 사용.
`<html class="dark">` 있으면 다크, 없으면 라이트.

---

## Task 1: 다크모드 인프라 — Tailwind 설정 + useTheme 훅

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/hooks/useTheme.ts`
- Modify: `src/app/layout.tsx`

### Step 1: globals.css에 dark variant 추가

```css
/* src/app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));
```

### Step 2: useTheme 훅 생성

```typescript
// src/hooks/useTheme.ts
"use client";

import { useState, useEffect } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  // 마운트 시 localStorage 또는 시스템 설정 확인
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  // theme 변경 시 <html> 클래스 및 localStorage 업데이트
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
```

### Step 3: layout.tsx — FOUC 방지 인라인 스크립트 추가

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sorting Algorithm Visualizer",
  description: "다양한 정렬 알고리즘의 작동 과정을 실시간 애니메이션으로 시각화하는 웹 애플리케이션",
  openGraph: {
    title: "Sorting Algorithm Visualizer",
    description: "버블, 선택, 삽입, 퀵, 병합 정렬을 실시간 애니메이션으로 시각화",
    type: "website",
  },
};

// FOUC(Flash of Unstyled Content) 방지: 렌더 전 테마 클래스 즉시 적용
const themeScript = `
  (function() {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark) || (!stored && !window.matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
```

### Step 4: 빌드 확인

```bash
npm run build
```

Expected: 성공

### Step 5: 커밋

```bash
git add src/app/globals.css src/hooks/useTheme.ts src/app/layout.tsx
git commit -m "feat: 다크모드 인프라 구축 (useTheme 훅, FOUC 방지)"
```

---

## Task 2: ThemeToggle 컴포넌트 + 전체 컴포넌트 다크모드 스타일

**Files:**
- Create: `src/components/ThemeToggle.tsx`
- Modify: `src/app/SortingVisualizer.tsx`
- Modify: `src/components/TopNav.tsx`
- Modify: `src/components/ControlBar.tsx`
- Modify: `src/components/VisualizerArea.tsx`

### Step 1: ThemeToggle 컴포넌트

```tsx
// src/components/ThemeToggle.tsx
"use client";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="p-2 rounded text-gray-300 hover:text-white hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 light:text-gray-600 transition-colors"
      title={theme === "dark" ? "라이트 모드" : "다크 모드"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

### Step 2: SortingVisualizer.tsx — useTheme 연동

```tsx
// src/app/SortingVisualizer.tsx 수정 내용
// 기존 import에 추가:
import { useTheme } from "@/hooks/useTheme";
import ThemeToggle from "@/components/ThemeToggle";

// export default function SortingVisualizer() { 안에 추가:
const { theme, toggleTheme } = useTheme();

// TopNav에 props 추가:
// theme={theme} onThemeToggle={toggleTheme}
```

전체 파일:
```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import TopNav from "@/components/TopNav";
import VisualizerArea from "@/components/VisualizerArea";
import ControlBar from "@/components/ControlBar";
import { generateRandomArray } from "@/utils/array";
import { completionAnimation } from "@/utils/animation";
import { ALGORITHM_MAP } from "@/utils/algorithms";
import { useTheme } from "@/hooks/useTheme";
import { AlgorithmType, BarState, ARRAY_SIZE_DEFAULT, SPEED_DEFAULT } from "@/types";

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [barStates, setBarStates] = useState<BarState[]>([]);
  const [arraySize, setArraySize] = useState<number>(ARRAY_SIZE_DEFAULT);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("bubble");
  const [animationSpeed, setAnimationSpeed] = useState<number>(SPEED_DEFAULT);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const { theme, toggleTheme } = useTheme();

  const isSortingRef = useRef<boolean>(false);
  const shouldStopRef = useRef<boolean>(false);
  const speedRef = useRef<number>(SPEED_DEFAULT);

  useEffect(() => {
    speedRef.current = animationSpeed;
  }, [animationSpeed]);

  const initArray = (size: number) => {
    const newArr = generateRandomArray(size);
    setArray(newArr);
    setBarStates(new Array(size).fill('default'));
  };

  useEffect(() => {
    initArray(arraySize);
  }, [arraySize]);

  const handleGenerateArray = () => {
    initArray(arraySize);
  };

  const handleReset = () => {
    shouldStopRef.current = true;
    isSortingRef.current = false;
    setIsSorting(false);
    initArray(arraySize);
  };

  const handleStartSort = async () => {
    if (isSortingRef.current) return;

    const sortFn = ALGORITHM_MAP[selectedAlgorithm];
    if (!sortFn) return;

    isSortingRef.current = true;
    shouldStopRef.current = false;
    setIsSorting(true);

    await sortFn(array, setArray, setBarStates, speedRef, shouldStopRef);

    if (!shouldStopRef.current) {
      await completionAnimation(array.length, setBarStates);
    }

    isSortingRef.current = false;
    setIsSorting(false);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <TopNav
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
        isSorting={isSorting}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <VisualizerArea array={array} barStates={barStates} />
      <ControlBar
        onGenerateArray={handleGenerateArray}
        onStartSort={handleStartSort}
        onReset={handleReset}
        isSorting={isSorting}
      />
    </div>
  );
}
```

### Step 3: TopNav.tsx — 다크모드 스타일 + ThemeToggle 추가

```tsx
"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { AlgorithmType, ALGORITHM_OPTIONS, ARRAY_SIZE_MIN, ARRAY_SIZE_MAX, SPEED_MIN, SPEED_MAX } from "@/types";

interface TopNavProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  isSorting: boolean;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export default function TopNav({
  selectedAlgorithm,
  onAlgorithmChange,
  arraySize,
  onArraySizeChange,
  animationSpeed,
  onAnimationSpeedChange,
  isSorting,
  theme,
  onThemeToggle,
}: TopNavProps) {
  return (
    <nav className="bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 px-4 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
          Sorting Algorithm Visualizer
        </h1>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex items-center gap-2">
            <label htmlFor="algorithm-select" className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
              알고리즘
            </label>
            <select
              id="algorithm-select"
              value={selectedAlgorithm}
              onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmType)}
              disabled={isSorting}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ALGORITHM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="array-size-slider" className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
              배열 크기: {arraySize}
            </label>
            <input
              id="array-size-slider"
              type="range"
              min={ARRAY_SIZE_MIN}
              max={ARRAY_SIZE_MAX}
              value={arraySize}
              onChange={(e) => onArraySizeChange(Number(e.target.value))}
              disabled={isSorting}
              className="w-24 sm:w-32 accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="배열 크기 조절"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="speed-slider" className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
              속도: {animationSpeed}
            </label>
            <input
              id="speed-slider"
              type="range"
              min={SPEED_MIN}
              max={SPEED_MAX}
              value={animationSpeed}
              onChange={(e) => onAnimationSpeedChange(Number(e.target.value))}
              className="w-24 sm:w-32 accent-blue-500"
              aria-label="애니메이션 속도 조절"
            />
          </div>

          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </div>
      </div>
    </nav>
  );
}
```

### Step 4: ControlBar.tsx — 다크모드 스타일 적용

```tsx
"use client";

interface ControlBarProps {
  onGenerateArray: () => void;
  onStartSort: () => void;
  onReset: () => void;
  isSorting: boolean;
}

export default function ControlBar({
  onGenerateArray,
  onStartSort,
  onReset,
  isSorting,
}: ControlBarProps) {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 px-4 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <button
          onClick={onGenerateArray}
          disabled={isSorting}
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="새 배열 생성"
        >
          새 배열 생성
        </button>

        <button
          onClick={onStartSort}
          disabled={isSorting}
          className="px-6 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-500 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="정렬 시작"
        >
          {isSorting ? "정렬 중..." : "정렬 시작"}
        </button>

        <button
          onClick={onReset}
          className="px-6 py-2 rounded bg-gray-500 dark:bg-gray-600 text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 active:bg-gray-600 dark:active:bg-gray-700 transition-colors"
          aria-label="초기화"
        >
          초기화
        </button>
      </div>
    </footer>
  );
}
```

### Step 5: VisualizerArea.tsx — 다크모드 배경 적용

```tsx
"use client";

import { BAR_VALUE_MAX, BarState, BAR_STATE_COLORS } from "@/types";

interface VisualizerAreaProps {
  array: number[];
  barStates: BarState[];
}

export default function VisualizerArea({ array, barStates }: VisualizerAreaProps) {
  return (
    <section
      className="flex-1 flex items-end justify-center gap-px px-4 py-6 bg-gray-50 dark:bg-gray-950 transition-colors"
      aria-label="정렬 시각화 영역"
    >
      {array.map((value, index) => {
        const heightPercent = (value / BAR_VALUE_MAX) * 100;
        const color = BAR_STATE_COLORS[barStates[index] ?? 'default'];

        return (
          <div
            key={index}
            className="rounded-t-sm"
            style={{
              height: `${heightPercent}%`,
              flex: "1 1 0%",
              minWidth: "1px",
              maxWidth: "20px",
              backgroundColor: color,
            }}
            aria-label={`막대 ${index + 1}: 높이 ${value}`}
          />
        );
      })}
    </section>
  );
}
```

### Step 6: 빌드 확인

```bash
npm run build
```

Expected: 성공

### Step 7: 커밋

```bash
git add src/components/ThemeToggle.tsx src/app/SortingVisualizer.tsx src/components/TopNav.tsx src/components/ControlBar.tsx src/components/VisualizerArea.tsx
git commit -m "feat: 다크/라이트 모드 토글 UI 구현"
```

---

## Task 3: 알고리즘 복잡도 정보 TDD + AlgorithmInfo 컴포넌트

**Files:**
- Create: `src/constants/algorithmInfo.ts`
- Create: `src/__tests__/constants/algorithmInfo.test.ts`
- Create: `src/components/AlgorithmInfo.tsx`
- Modify: `src/app/SortingVisualizer.tsx`

### Step 1: 실패하는 테스트 작성

```typescript
// src/__tests__/constants/algorithmInfo.test.ts
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
```

### Step 2: 테스트 실패 확인

```bash
npx vitest run src/__tests__/constants/algorithmInfo.test.ts
```

Expected: FAIL

### Step 3: algorithmInfo.ts 구현

```typescript
// src/constants/algorithmInfo.ts
import { AlgorithmType } from "@/types";

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
}

export const ALGORITHM_INFO: Record<AlgorithmType, ComplexityInfo> = {
  bubble: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
  },
  selection: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: false,
  },
  insertion: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    stable: true,
  },
  quick: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
  },
  merge: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
  },
};
```

### Step 4: 테스트 통과 확인

```bash
npx vitest run src/__tests__/constants/algorithmInfo.test.ts
```

Expected: PASS — 5 tests passed

### Step 5: AlgorithmInfo 컴포넌트 구현

```tsx
// src/components/AlgorithmInfo.tsx
"use client";

import { AlgorithmType, ALGORITHM_OPTIONS } from "@/types";
import { ALGORITHM_INFO } from "@/constants/algorithmInfo";

interface AlgorithmInfoProps {
  algorithm: AlgorithmType;
}

export default function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  const info = ALGORITHM_INFO[algorithm];
  const label = ALGORITHM_OPTIONS.find((o) => o.value === algorithm)?.label ?? algorithm;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 px-4 py-2 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
        <span className="font-semibold text-gray-900 dark:text-gray-200">{label}</span>
        <span>최선 <code className="text-blue-600 dark:text-blue-400">{info.best}</code></span>
        <span>평균 <code className="text-blue-600 dark:text-blue-400">{info.average}</code></span>
        <span>최악 <code className="text-blue-600 dark:text-blue-400">{info.worst}</code></span>
        <span>공간 <code className="text-blue-600 dark:text-blue-400">{info.space}</code></span>
        <span className={info.stable ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
          {info.stable ? "안정 정렬" : "불안정 정렬"}
        </span>
      </div>
    </div>
  );
}
```

### Step 6: SortingVisualizer.tsx에 AlgorithmInfo 추가

기존 파일에서 `import` 추가 및 `<AlgorithmInfo>` 삽입:

```tsx
// 기존 import들 아래에 추가
import AlgorithmInfo from "@/components/AlgorithmInfo";

// return 안에서 TopNav 바로 아래에 추가:
// <AlgorithmInfo algorithm={selectedAlgorithm} />
```

전체 return 부분:
```tsx
  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <TopNav
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
        isSorting={isSorting}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <AlgorithmInfo algorithm={selectedAlgorithm} />
      <VisualizerArea array={array} barStates={barStates} />
      <ControlBar
        onGenerateArray={handleGenerateArray}
        onStartSort={handleStartSort}
        onReset={handleReset}
        isSorting={isSorting}
      />
    </div>
  );
```

### Step 7: 빌드 + 전체 테스트 확인

```bash
npm run build && npx vitest run
```

Expected: 빌드 성공, 13 tests passed (8 기존 + 5 신규)

### Step 8: 커밋

```bash
git add src/constants/algorithmInfo.ts src/__tests__/constants/algorithmInfo.test.ts src/components/AlgorithmInfo.tsx src/app/SortingVisualizer.tsx
git commit -m "feat: 알고리즘 복잡도 정보 표시 (TDD)"
```

---

## Task 4: OG 메타태그 + favicon

**Files:**
- Modify: `src/app/layout.tsx`
- Add: `public/og-image.png` (선택사항 — 없으면 기본 설정만)

### Step 1: layout.tsx metadata 업데이트

Task 1에서 이미 openGraph를 추가했으므로, twitter 카드도 추가:

```typescript
export const metadata: Metadata = {
  title: "Sorting Algorithm Visualizer",
  description: "버블, 선택, 삽입, 퀵, 병합 정렬 알고리즘의 작동 과정을 실시간 애니메이션으로 시각화",
  openGraph: {
    title: "Sorting Algorithm Visualizer",
    description: "버블, 선택, 삽입, 퀵, 병합 정렬을 실시간 애니메이션으로 시각화",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sorting Algorithm Visualizer",
    description: "버블, 선택, 삽입, 퀵, 병합 정렬을 실시간 애니메이션으로 시각화",
  },
};
```

### Step 2: 빌드 확인

```bash
npm run build
```

Expected: 성공

### Step 3: 커밋

```bash
git add src/app/layout.tsx
git commit -m "feat: OG/Twitter 메타태그 추가"
```

---

## Task 5: 최종 빌드 검증 + sprint-close

```bash
npx vitest run   # 13 tests passed
npm run build    # 성공
```

sprint-close 에이전트 실행:
- ROADMAP Phase 5 완료 표시
- PR 생성 (sprint5 → main)
- 코드 리뷰
- docs/deploy.md 업데이트
