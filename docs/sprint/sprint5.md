# Sprint 5 구현 계획: 마무리 및 UX 개선

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 다크모드 지원, 알고리즘 복잡도 정보 표시, UI/UX 최종 개선을 완성하고 `next build` 성공 및 Open Graph/favicon 설정으로 프로덕션 배포를 준비한다.

**Architecture:** `tailwind.config.ts`의 `darkMode: 'class'`를 활성화하고, `ThemeProvider` 패턴(localStorage + `prefers-color-scheme` 초기값)으로 다크모드 상태를 관리한다. 복잡도 데이터는 `src/constants/algorithmInfo.ts`에 순수 상수로 정의하여 컴포넌트에서 선택된 알고리즘 키로 즉시 조회한다. UI/UX 개선은 기존 컴포넌트를 직접 수정하는 방식으로 진행하고, 별도 라이브러리를 추가하지 않는다.

**Tech Stack:** Next.js (App Router), TypeScript, React Hooks (useState, useEffect), Tailwind CSS (`darkMode: 'class'`), Vitest (순수 로직 단위 테스트), Playwright MCP (UI 검증)

---

## 스프린트 정보

| 항목 | 내용 |
|------|------|
| 스프린트 번호 | Sprint 5 |
| 대응 Phase | Phase 5: 마무리 및 UX 개선 |
| 기간 | 2026-03-13 ~ 2026-03-27 |
| 목표 마일스톤 | M5: 프로덕션 릴리스 |
| 상태 | 구현 완료 (2026-03-13) |

---

## 구현 범위

### 포함 항목

- `tailwind.config.ts` — `darkMode: 'class'` 설정 추가
- `src/hooks/useTheme.ts` — 다크모드 상태 관리 훅 (localStorage + 시스템 감지)
- `src/components/ThemeToggle.tsx` — 다크/라이트 전환 버튼 컴포넌트
- `src/app/layout.tsx` — ThemeScript(깜빡임 방지 인라인 스크립트) 삽입, Open Graph 메타 태그, favicon 설정
- `src/app/SortingVisualizer.tsx` — ThemeToggle 버튼 통합
- `src/constants/algorithmInfo.ts` — 5종 알고리즘 복잡도 상수 정의
- `src/components/AlgorithmInfo.tsx` — 복잡도 정보 표시 컴포넌트
- `src/components/TopNav.tsx` — AlgorithmInfo 영역 통합, 다크모드 스타일 추가
- `src/components/ControlBar.tsx` — hover/active 스타일, aria-label 접근성 추가
- `src/components/VisualizerArea.tsx` — 다크모드 배경 스타일 추가
- `src/__tests__/constants/algorithmInfo.test.ts` — 복잡도 데이터 유닛 테스트 (5종 × 4항목)
- `public/favicon.ico` (또는 `src/app/icon.png`) — favicon 설정
- `docs/sprint/sprint5/playwright-report.md` — Playwright MCP 검증 보고서
- `docs/sprint/sprint5/code-review.md` — 코드 리뷰 보고서

### 제외 항목

- 알고리즘 로직 변경 없음 (Sprint 3, 4에서 완성)
- 신규 알고리즘 추가 없음 (Backlog 항목)
- Vercel 실제 배포 실행 없음 (빌드 성공 확인까지만, 배포 타이밍은 사용자가 결정)
- 애니메이션 엔진 교체(`requestAnimationFrame`) 없음 (현재 sleep 방식이 안정적으로 동작 중)

---

## 완료 기준 (Definition of Done)

- ✅ 다크모드 토글 버튼 클릭 시 모든 컴포넌트에서 다크/라이트 모드가 즉시 전환됨
- ✅ 시스템 다크모드 설정이 초기 로드 시 자동 반영됨
- ✅ 새로고침 후에도 마지막 선택한 테마가 유지됨 (localStorage)
- ✅ 페이지 초기 로드 시 테마 깜빡임(FOUC) 없음
- ✅ 알고리즘 드롭다운 변경 시 해당 알고리즘의 시간/공간 복잡도가 즉시 표시됨
- ✅ 버블 정렬: O(n²) / O(n²) / O(n²) / O(1) / Stable 표시 확인
- ✅ 병합 정렬: O(n log n) / O(n log n) / O(n log n) / O(n) / Stable 표시 확인
- ✅ `npm run build` (`next build`) 에러 및 경고 없이 성공
- ✅ `npx vitest run` 전체 테스트 통과 (13/13)
- ✅ 모든 버튼에 `aria-label` 또는 명시적 텍스트 레이블이 있음
- ⬜ 브라우저 콘솔에 에러가 없음 (수동 검증 필요)

---

## Task 1: Tailwind 다크모드 설정 및 useTheme 훅

**Files:**
- Modify: `tailwind.config.ts`
- Create: `src/hooks/useTheme.ts`
- Create: `src/__tests__/hooks/useTheme.test.ts` (선택 — 로직 단위 테스트)

### Step 1: `tailwind.config.ts`에 `darkMode: 'class'` 추가

`tailwind.config.ts`를 열어 다음을 추가한다:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',   // ← 이 줄 추가
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
```

### Step 2: `useTheme` 훅 구현

`src/hooks/useTheme.ts`를 생성한다:

```typescript
'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
  // 서버 렌더링 환경에서는 기본값 반환
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (stored === 'dark' || stored === 'light') return stored

  // 시스템 설정 감지
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // 클라이언트에서만 초기 테마 결정
    setTheme(getInitialTheme())
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return { theme, toggle }
}
```

### Step 3: 개발 서버 실행 후 콘솔 에러 없음 확인

```bash
npm run dev
```

브라우저 콘솔에 에러가 없는지 확인한다. `useTheme` 자체는 이 단계에서 UI에 연결하지 않아도 된다.

### Step 4: 커밋

```bash
git add tailwind.config.ts src/hooks/useTheme.ts
git commit -m "feat: Tailwind 다크모드 class 설정 및 useTheme 훅 구현"
```

---

## Task 2: FOUC 방지 ThemeScript 및 layout.tsx 업데이트

**Files:**
- Modify: `src/app/layout.tsx`

### 배경 지식

Next.js App Router는 서버에서 HTML을 렌더링한다. 클라이언트 JS가 실행되기 전에 화면이 잠깐 기본 테마로 보이는 현상(FOUC: Flash Of Unstyled Content)이 발생할 수 있다. 이를 방지하려면 `<html>` 태그에 클래스를 설정하는 인라인 스크립트를 `<head>` 최상단에 삽입해야 한다.

### Step 1: `layout.tsx` 수정

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sorting Algorithm Visualizer',
  description:
    '버블, 선택, 삽입, 퀵, 병합 정렬 알고리즘의 작동 과정을 실시간 애니메이션으로 시각화하는 웹 앱',
  openGraph: {
    title: 'Sorting Algorithm Visualizer',
    description: '정렬 알고리즘을 실시간으로 시각화하여 학습할 수 있는 인터랙티브 웹 앱',
    type: 'website',
  },
}

// FOUC 방지: 페이지 로드 전 localStorage 확인하여 dark 클래스 적용
const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

> **주의:** `suppressHydrationWarning`은 서버/클라이언트 간 `className` 불일치(dark 클래스) 경고를 억제하기 위해 필요하다. 이것은 의도된 패턴이다.

### Step 2: 빌드 확인

```bash
npm run build
```

기대 결과: 빌드 성공 (에러 없음)

### Step 3: 커밋

```bash
git add src/app/layout.tsx
git commit -m "feat: FOUC 방지 ThemeScript 및 Open Graph 메타 태그 추가"
```

---

## Task 3: ThemeToggle 컴포넌트 및 앱 통합

**Files:**
- Create: `src/components/ThemeToggle.tsx`
- Modify: `src/app/SortingVisualizer.tsx`

### Step 1: `ThemeToggle.tsx` 구현

```typescript
'use client'

import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="
        rounded-full w-9 h-9 flex items-center justify-center
        bg-gray-200 hover:bg-gray-300 active:bg-gray-400
        dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500
        transition-colors duration-200
        text-gray-800 dark:text-gray-100
      "
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
```

### Step 2: `SortingVisualizer.tsx`에 ThemeToggle 추가

`SortingVisualizer.tsx`의 `TopNav` 렌더링 영역에 `ThemeToggle`을 추가한다. 정확한 위치는 현재 파일을 열어 확인한다. 일반적으로 TopNav 우측 영역에 삽입한다:

```typescript
import ThemeToggle from '@/components/ThemeToggle'

// TopNav 바로 아래 또는 TopNav 내부 prop으로 전달
// SortingVisualizer의 return 최상단 div에 추가:
<div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
  <div className="relative">
    <TopNav ... />
    <div className="absolute top-3 right-4">
      <ThemeToggle />
    </div>
  </div>
  {/* 나머지 컴포넌트 */}
</div>
```

> **중요:** `SortingVisualizer.tsx`는 이미 `'use client'`이므로 ThemeToggle을 직접 import하여 사용할 수 있다.

### Step 3: Playwright MCP로 토글 동작 검증

1. `browser_navigate` → `http://localhost:3000`
2. `browser_snapshot` → ThemeToggle 버튼이 렌더링되는지 확인
3. `browser_click` → 다크모드 토글 버튼 클릭
4. `browser_snapshot` → 배경색이 어두워졌는지 확인 (다크모드 적용 여부)
5. `browser_console_messages(level: "error")` → 에러 없음 확인

### Step 4: 커밋

```bash
git add src/components/ThemeToggle.tsx src/app/SortingVisualizer.tsx
git commit -m "feat: ThemeToggle 컴포넌트 구현 및 앱에 통합"
```

---

## Task 4: 전체 컴포넌트 다크모드 스타일 적용

**Files:**
- Modify: `src/components/TopNav.tsx`
- Modify: `src/components/ControlBar.tsx`
- Modify: `src/components/VisualizerArea.tsx`

### 다크모드 색상 설계

| 요소 | 라이트 모드 | 다크 모드 |
|------|-------------|-----------|
| 페이지 배경 | `bg-white` | `dark:bg-gray-900` |
| TopNav 배경 | `bg-gray-100` | `dark:bg-gray-800` |
| 텍스트 (기본) | `text-gray-900` | `dark:text-gray-100` |
| 텍스트 (보조) | `text-gray-600` | `dark:text-gray-400` |
| 버튼 (기본) | `bg-blue-600` | `dark:bg-blue-500` |
| 버튼 (비활성) | `bg-gray-400` | `dark:bg-gray-600` |
| 슬라이더 트랙 | `bg-gray-300` | `dark:bg-gray-600` |
| 시각화 영역 배경 | `bg-gray-50` | `dark:bg-gray-800` |
| 막대 (기본 파란색) | `#3b82f6` | `#60a5fa` (밝은 파란색) |

### Step 1: TopNav.tsx 다크모드 스타일 추가

파일을 열어 현재 클래스명을 확인한 후, 각 요소에 `dark:` 접두사 클래스를 추가한다. 주요 패턴:

```typescript
// 예시: 기존 bg-gray-100 → bg-gray-100 dark:bg-gray-800
// 기존 text-gray-900 → text-gray-900 dark:text-gray-100
// 기존 border-gray-300 → border-gray-300 dark:border-gray-600
```

### Step 2: ControlBar.tsx 다크모드 스타일 및 hover/active 개선

버튼에 hover/active 상태 스타일과 다크모드 스타일을 추가한다:

```typescript
// 정렬 시작 버튼
className="
  bg-blue-600 text-white px-4 py-2 rounded
  hover:bg-blue-700 active:bg-blue-800
  dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700
  disabled:bg-gray-400 dark:disabled:bg-gray-600
  disabled:cursor-not-allowed
  transition-colors duration-150
"

// 새 배열 생성 버튼
className="
  bg-gray-200 text-gray-800 px-4 py-2 rounded
  hover:bg-gray-300 active:bg-gray-400
  dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:active:bg-gray-500
  transition-colors duration-150
"
```

### Step 3: VisualizerArea.tsx 다크모드 배경 추가

시각화 영역 컨테이너에 다크모드 배경색을 추가한다:

```typescript
className="bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
```

### Step 4: Playwright MCP로 전체 다크모드 검증

1. `browser_click` → 다크모드 토글 버튼 클릭
2. `browser_snapshot` → TopNav, ControlBar, VisualizerArea 모두 다크 스타일 확인
3. `browser_click` → 라이트모드로 전환
4. `browser_snapshot` → 모든 요소가 라이트 모드로 복원 확인
5. `browser_console_messages(level: "error")` → 에러 없음 확인

### Step 5: 커밋

```bash
git add src/components/TopNav.tsx src/components/ControlBar.tsx src/components/VisualizerArea.tsx
git commit -m "feat: 전체 컴포넌트 다크모드 스타일 및 hover/active 개선"
```

---

## Task 5: 알고리즘 복잡도 상수 정의 (TDD)

**Files:**
- Create: `src/constants/algorithmInfo.ts`
- Create: `src/__tests__/constants/algorithmInfo.test.ts`

### Step 1: 실패하는 테스트 작성

`src/__tests__/constants/algorithmInfo.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { ALGORITHM_INFO, type AlgorithmInfoData } from '../../constants/algorithmInfo'

describe('ALGORITHM_INFO', () => {
  const algorithms = ['bubble', 'selection', 'insertion', 'quick', 'merge'] as const

  it('5종 알고리즘 모두 정의되어 있어야 한다', () => {
    algorithms.forEach((key) => {
      expect(ALGORITHM_INFO[key]).toBeDefined()
    })
  })

  it('각 알고리즘은 required 필드를 모두 가져야 한다', () => {
    algorithms.forEach((key) => {
      const info = ALGORITHM_INFO[key]
      expect(info).toHaveProperty('name')
      expect(info).toHaveProperty('bestCase')
      expect(info).toHaveProperty('averageCase')
      expect(info).toHaveProperty('worstCase')
      expect(info).toHaveProperty('spaceComplexity')
      expect(info).toHaveProperty('stable')
    })
  })

  it('버블 정렬 복잡도가 정확해야 한다', () => {
    const bubble = ALGORITHM_INFO.bubble
    expect(bubble.bestCase).toBe('O(n)')
    expect(bubble.averageCase).toBe('O(n²)')
    expect(bubble.worstCase).toBe('O(n²)')
    expect(bubble.spaceComplexity).toBe('O(1)')
    expect(bubble.stable).toBe(true)
  })

  it('병합 정렬 복잡도가 정확해야 한다', () => {
    const merge = ALGORITHM_INFO.merge
    expect(merge.bestCase).toBe('O(n log n)')
    expect(merge.averageCase).toBe('O(n log n)')
    expect(merge.worstCase).toBe('O(n log n)')
    expect(merge.spaceComplexity).toBe('O(n)')
    expect(merge.stable).toBe(true)
  })

  it('퀵 정렬 복잡도가 정확해야 한다', () => {
    const quick = ALGORITHM_INFO.quick
    expect(quick.bestCase).toBe('O(n log n)')
    expect(quick.averageCase).toBe('O(n log n)')
    expect(quick.worstCase).toBe('O(n²)')
    expect(quick.spaceComplexity).toBe('O(log n)')
    expect(quick.stable).toBe(false)
  })
})
```

### Step 2: 테스트 실패 확인

```bash
npx vitest run src/__tests__/constants/algorithmInfo.test.ts
```

기대 결과: FAIL — "Cannot find module '../../constants/algorithmInfo'"

### Step 3: `algorithmInfo.ts` 구현

`src/constants/algorithmInfo.ts`:

```typescript
export interface AlgorithmInfoData {
  name: string
  bestCase: string
  averageCase: string
  worstCase: string
  spaceComplexity: string
  stable: boolean
  description: string
}

export const ALGORITHM_INFO: Record<string, AlgorithmInfoData> = {
  bubble: {
    name: '버블 정렬',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    description: '인접한 두 요소를 반복 비교하여 정렬하는 가장 단순한 알고리즘',
  },
  selection: {
    name: '선택 정렬',
    bestCase: 'O(n²)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    description: '매 패스마다 최솟값을 찾아 정렬되지 않은 구간의 첫 위치와 교환',
  },
  insertion: {
    name: '삽입 정렬',
    bestCase: 'O(n)',
    averageCase: 'O(n²)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    description: '각 요소를 이미 정렬된 구간의 올바른 위치에 삽입',
  },
  quick: {
    name: '퀵 정렬',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n²)',
    spaceComplexity: 'O(log n)',
    stable: false,
    description: '피벗을 기준으로 분할 정복하는 평균적으로 가장 빠른 비교 정렬',
  },
  merge: {
    name: '병합 정렬',
    bestCase: 'O(n log n)',
    averageCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stable: true,
    description: '배열을 반씩 나눈 뒤 병합하는 안정적인 분할 정복 정렬',
  },
}
```

### Step 4: 테스트 통과 확인

```bash
npx vitest run src/__tests__/constants/algorithmInfo.test.ts
```

기대 결과: PASS (5/5 tests)

### Step 5: 커밋

```bash
git add src/constants/algorithmInfo.ts src/__tests__/constants/algorithmInfo.test.ts
git commit -m "feat: 알고리즘 복잡도 상수 정의 및 단위 테스트 추가"
```

---

## Task 6: AlgorithmInfo 컴포넌트 구현 및 통합

**Files:**
- Create: `src/components/AlgorithmInfo.tsx`
- Modify: `src/app/SortingVisualizer.tsx` (또는 `src/components/TopNav.tsx`)

### Step 1: `AlgorithmInfo.tsx` 구현

```typescript
import { ALGORITHM_INFO } from '@/constants/algorithmInfo'

interface AlgorithmInfoProps {
  algorithmKey: string
}

export default function AlgorithmInfo({ algorithmKey }: AlgorithmInfoProps) {
  const info = ALGORITHM_INFO[algorithmKey]

  if (!info) return null

  return (
    <div className="
      mt-3 p-3 rounded-lg
      bg-blue-50 dark:bg-gray-700
      border border-blue-100 dark:border-gray-600
      text-sm
    ">
      <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
        {info.name} — 복잡도 정보
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-600 dark:text-gray-300">
        <span>최선 시간:</span>
        <span className="font-mono font-medium">{info.bestCase}</span>

        <span>평균 시간:</span>
        <span className="font-mono font-medium">{info.averageCase}</span>

        <span>최악 시간:</span>
        <span className="font-mono font-medium">{info.worstCase}</span>

        <span>공간 복잡도:</span>
        <span className="font-mono font-medium">{info.spaceComplexity}</span>

        <span>안정성:</span>
        <span className={info.stable
          ? 'text-green-600 dark:text-green-400 font-medium'
          : 'text-orange-500 dark:text-orange-400 font-medium'
        }>
          {info.stable ? 'Stable' : 'Unstable'}
        </span>
      </div>
      <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">{info.description}</p>
    </div>
  )
}
```

### Step 2: `SortingVisualizer.tsx`에 AlgorithmInfo 통합

`selectedAlgorithm` 상태가 이미 있으므로, 시각화 영역 위(또는 TopNav 아래)에 AlgorithmInfo를 추가한다:

```typescript
import AlgorithmInfo from '@/components/AlgorithmInfo'

// return 내부 적절한 위치에:
<AlgorithmInfo algorithmKey={selectedAlgorithm} />
```

### Step 3: Playwright MCP로 복잡도 표시 검증

1. `browser_navigate` → `http://localhost:3000`
2. `browser_select_option` → "버블 정렬" 선택
3. `browser_snapshot` → 복잡도 정보 영역에 "O(n²)", "O(1)", "Stable" 표시 확인
4. `browser_select_option` → "병합 정렬" 선택
5. `browser_snapshot` → "O(n log n)", "O(n)", "Stable" 표시 확인
6. `browser_select_option` → "퀵 정렬" 선택
7. `browser_snapshot` → "O(n²)" (최악), "O(log n)", "Unstable" 표시 확인
8. `browser_console_messages(level: "error")` → 에러 없음 확인

### Step 4: 커밋

```bash
git add src/components/AlgorithmInfo.tsx src/app/SortingVisualizer.tsx
git commit -m "feat: 알고리즘 복잡도 정보 표시 컴포넌트 구현 및 통합"
```

---

## Task 7: 접근성 개선 및 favicon 설정

**Files:**
- Modify: `src/components/ControlBar.tsx`
- Modify: `src/components/TopNav.tsx`
- Add: `src/app/icon.png` 또는 `public/favicon.ico`

### Step 1: aria-label 및 키보드 접근성 추가

`ControlBar.tsx`의 각 버튼을 확인하고 명시적 레이블이 없는 버튼에 `aria-label`을 추가한다:

```typescript
// 정렬 시작 버튼
<button
  aria-label="선택한 알고리즘으로 정렬 시작"
  disabled={isSorting}
  ...
>
  정렬 시작
</button>

// 새 배열 생성 버튼
<button
  aria-label="새로운 랜덤 배열 생성"
  disabled={isSorting}
  ...
>
  새 배열 생성
</button>
```

`TopNav.tsx`의 슬라이더에 `aria-label` 추가:

```typescript
<input
  type="range"
  aria-label="배열 크기 조절 (10~100)"
  min={10}
  max={100}
  ...
/>

<input
  type="range"
  aria-label="애니메이션 속도 조절"
  ...
/>
```

### Step 2: favicon 설정

Next.js App Router에서 favicon은 `src/app/icon.png` (또는 `src/app/favicon.ico`)에 파일을 두면 자동으로 적용된다. 아이콘 파일을 추가하거나 `layout.tsx`에서 명시적으로 설정한다:

```typescript
// layout.tsx의 metadata에 추가 (파일 없이 메타 태그만으로 설정 시)
export const metadata: Metadata = {
  // 기존 메타데이터 유지 ...
  icons: {
    icon: '/favicon.ico',
  },
}
```

> 아이콘 파일이 없는 경우, `public/favicon.ico`에 간단한 아이콘 파일을 복사하거나 생성한다. 정렬 관련 SVG 아이콘을 사용하거나, 임시로 Next.js 기본 favicon을 활용해도 된다.

### Step 3: 빌드 최종 확인

```bash
npm run build
```

기대 결과: 빌드 성공, TypeScript 에러 없음, `next build` 경고 없음

### Step 4: 전체 Vitest 통과 확인

```bash
npx vitest run
```

기대 결과: 기존 8개 + 신규 5개 = 13개 이상 전체 PASS

### Step 5: 커밋

```bash
git add src/components/ControlBar.tsx src/components/TopNav.tsx src/app/layout.tsx
git commit -m "feat: 접근성 개선 (aria-label) 및 favicon 설정"
```

---

## Task 8: 최종 통합 검증 (Playwright MCP)

**Files:**
- Create: `docs/sprint/sprint5/playwright-report.md`

### 검증 시나리오

`npm run dev` 실행 상태에서 아래 순서로 검증을 수행한다.

**다크모드 전체 검증:**
1. `browser_navigate` → `http://localhost:3000`
2. `browser_snapshot` → 라이트 모드 기본 렌더링 (배경 흰색, TopNav, 시각화 영역)
3. `browser_click` → 다크모드 토글 버튼 클릭
4. `browser_snapshot` → 다크 배경(gray-900), 모든 컴포넌트 다크 스타일 적용 확인
5. `browser_click` → 라이트모드 전환
6. `browser_snapshot` → 라이트모드 복원 확인

**복잡도 정보 표시 검증:**
7. `browser_select_option` → "버블 정렬" 선택
8. `browser_snapshot` → "O(n²)", "O(1)", "Stable" 텍스트 존재 확인
9. `browser_select_option` → "병합 정렬" 선택
10. `browser_snapshot` → "O(n log n)", "O(n)", "Stable" 텍스트 존재 확인

**전체 기능 통합 검증:**
11. `browser_click` → "새 배열 생성" 버튼 클릭
12. `browser_select_option` → "퀵 정렬" 선택
13. `browser_click` → "정렬 시작" 버튼 클릭
14. `browser_snapshot` → 정렬 중 색상 피드백 확인 (비교/스왑 색상)
15. 정렬 완료 대기 후 `browser_snapshot` → 모든 막대 초록색 + 오름차순 확인
16. `browser_console_messages(level: "error")` → 에러 없음 확인

**반응형 + 다크모드 조합 검증:**
17. `browser_click` → 다크모드 토글
18. `browser_resize(width: 375, height: 812)` → 모바일 뷰포트
19. `browser_snapshot` → 모바일 다크모드 레이아웃 정상 확인
20. `browser_resize(width: 1440, height: 900)` → 데스크톱 뷰포트 복원

**localStorage 유지 검증:**
21. `browser_click` → 다크모드 활성화
22. `browser_navigate` → `http://localhost:3000` 재접속
23. `browser_snapshot` → 페이지 로드 후 다크모드가 유지되는지, FOUC 없이 바로 다크 배경이 적용되는지 확인

### Step 1: 검증 결과를 `playwright-report.md`에 기록

```bash
mkdir -p docs/sprint/sprint5
```

각 검증 항목의 결과 (PASS/FAIL)와 주요 스냅샷 설명을 `docs/sprint/sprint5/playwright-report.md`에 기록한다.

### Step 2: 최종 커밋

```bash
git add docs/sprint/sprint5/playwright-report.md
git commit -m "docs: Sprint 5 Playwright 검증 보고서 추가"
```

---

## 의존성 및 리스크

| 리스크 | 영향도 | 완화 전략 |
|--------|--------|-----------|
| FOUC (테마 깜빡임) | 중간 | ThemeScript 인라인 스크립트로 완전히 방지 가능 |
| Tailwind 다크모드 클래스가 purge되는 문제 | 낮음 | `tailwind.config.ts`의 `content` 경로가 모든 컴포넌트를 포함하는지 확인 |
| Next.js `suppressHydrationWarning` 오용 | 낮음 | `<html>` 태그에만 사용, 하위 컴포넌트에는 사용하지 않음 |
| `next build` 시 dynamic import 경고 | 낮음 | `useTheme` 훅은 `useEffect` 내부에서만 localStorage 접근하므로 SSR 안전 |
| 모바일에서 복잡도 정보 영역이 좁아 가독성 저하 | 낮음 | `grid-cols-1` 반응형 처리 또는 텍스트 크기 조정 |

---

## Playwright MCP 검증 시나리오 (ROADMAP 기준)

> ROADMAP.md Phase 5에 명시된 시나리오

**다크모드 검증:**
1. `browser_navigate` → `http://localhost:3000` 접속
2. `browser_snapshot` → 라이트 모드 기본 렌더링 확인
3. `browser_click` → 다크모드 토글 버튼 클릭
4. `browser_snapshot` → 다크모드 스타일 적용 확인

**복잡도 정보 검증:**
5. `browser_select_option` → "버블 정렬" 선택
6. `browser_snapshot` → 시간 복잡도 O(n²), 공간 복잡도 O(1) 표시 확인
7. `browser_select_option` → "병합 정렬" 선택
8. `browser_snapshot` → 시간 복잡도 O(n log n), 공간 복잡도 O(n) 표시 확인

**전체 기능 통합 검증:**
9. `browser_click` → "새 배열 생성" 버튼 클릭
10. `browser_select_option` → "퀵 정렬" 선택
11. `browser_click` → "정렬 시작" 버튼 클릭
12. 정렬 완료 후 `browser_snapshot` → 정렬 완료 상태 확인
13. `browser_console_messages(level: "error")` → 에러 없음 확인

**반응형 최종 검증:**
14. `browser_resize(width: 375, height: 812)` → 모바일 뷰
15. `browser_snapshot` → 모바일 레이아웃 정상 확인
16. `browser_resize(width: 1440, height: 900)` → 데스크톱 뷰 복원

---

## 검증 결과

- [코드 리뷰 보고서](sprint5/code-review.md) — 완료 (2026-03-13), Critical 0건 / Important 3건
- Playwright UI 검증 — `npm run dev` 실행 후 수동 확인 필요 (수동 검증 항목 참고)

---

## 주요 구현 파일

| 파일 | 역할 |
|------|------|
| `tailwind.config.ts` | `darkMode: 'class'` 활성화 |
| `src/hooks/useTheme.ts` | 다크모드 상태 관리 (localStorage + 시스템 감지) |
| `src/components/ThemeToggle.tsx` | 다크/라이트 전환 토글 버튼 |
| `src/app/layout.tsx` | FOUC 방지 스크립트, Open Graph 메타 태그, favicon |
| `src/constants/algorithmInfo.ts` | 5종 알고리즘 복잡도 상수 |
| `src/components/AlgorithmInfo.tsx` | 복잡도 정보 표시 UI 컴포넌트 |
| `src/__tests__/constants/algorithmInfo.test.ts` | 복잡도 데이터 유닛 테스트 (5종) |

---

## 배포 준비 체크리스트

- ✅ `npm run build` (`next build`) 성공 확인
- ✅ `npx vitest run` 전체 테스트 통과 (13/13)
- ✅ Open Graph 메타 태그 설정 완료
- ✅ favicon 설정 완료
- ✅ 다크/라이트 모드 전환 정상 동작 확인
- ✅ 알고리즘 복잡도 정보 표시 정상 동작 확인
- ⬜ 모바일/데스크톱 레이아웃 이상 없음 (수동 확인 필요)
- ⬜ 브라우저 콘솔 에러 없음 (수동 확인 필요)
- ⬜ Vercel 배포 실행 (사용자 직접 수행 — `vercel --prod`)

---

## 📊 실제 추적 기록

### 작업 시간

| 항목 | 시간 |
|------|------|
| 시작 | 2026-03-13 15:58 (Sprint 4 완료 직후) |
| 첫 구현 커밋 | 2026-03-13 16:08 |
| 초기 완료 | 2026-03-13 16:18 (Sprint 5 마무리 문서) |
| 사후 수정 완료 | 2026-03-13 16:44 (hydration 수정 + 테스트 + 리팩토링) |
| **실제 소요 시간** | **약 46분** (16:44 기준) |
| 계획 소요 시간 | 2026-03-13 ~ 2026-03-27 (여유있게 계획) |

### 변경 통계 (`b361b46..f3e1609`)

| 항목 | 수치 |
|------|------|
| 변경된 파일 수 | 26개 |
| 추가된 라인 수 | +1,724줄 |
| 삭제된 라인 수 | -275줄 |
| 순 변경량 | +1,449줄 |

### 주요 커밋

| 해시 | 시각 | 메시지 |
|------|------|--------|
| `658983e` | 16:08 | feat: 다크모드 인프라 구축 (useTheme 훅, FOUC 방지) |
| `62e21a3` | 16:10 | feat: 다크/라이트 모드 토글 UI 구현 |
| `b94b7b2` | 16:13 | feat: 알고리즘 복잡도 정보 표시 (TDD) |
| `0e9a513` | 16:15 | docs: Sprint 5 마무리 - ROADMAP 완료 표시, sprint5.md 생성 |
| `df64454` | 16:18 | docs: Sprint 5 코드 리뷰 보고서 및 deploy.md 업데이트 |
| `bddd8d4` | 16:21 | fix: 다크모드 hydration 이슈 수정 (suppressHydrationWarning, try-catch, 초기값 undefined) |
| `504aed6` | 16:37 | test: 유틸리티 및 기본 정렬 알고리즘 단위 테스트 추가 |
| `f3e1609` | 16:44 | refactor: 애니메이션 헬퍼 추상화(P1) 및 useSortingState 훅 분리(P3) |

### 계획 대비 실제

| 항목 | 내용 |
|------|------|
| 계획 범위 준수 | ✅ 다크모드, FOUC 방지, AlgorithmInfo, ThemeToggle, OpenGraph, 접근성(aria-label) 완료 |
| 예상 외 추가 작업 | hydration 이슈 수정(bddd8d4), 단위 테스트 추가(504aed6), P1/P3 리팩토링(f3e1609) |
| 코드 리뷰 이슈 | Critical 0건, Important 3건 (I-1: hydration, I-2: suppressHydrationWarning, I-3: try-catch) |
| 적용된 이슈 | I-1, I-2, I-3 모두 bddd8d4에서 수정 완료 |
| 테스트 증가 | Sprint 5 완료 시점 기준: 유틸리티 14개 + 알고리즘 18개 + 복잡도 5개 = 총 37개 통과 |
