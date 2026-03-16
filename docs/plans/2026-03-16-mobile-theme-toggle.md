# 모바일 ThemeToggle 위치 최적화

**날짜:** 2026-03-16
**대상 파일:** `src/components/TopNav.tsx`

## 배경

외부 평가에서 모바일 레이아웃의 ThemeToggle 위치 최적화 여지가 지적됨.

## 문제

모바일(< sm)에서 TopNav는 `flex-col` 방향으로 쌓이는데, ThemeToggle이 컨트롤 그룹(알고리즘 선택, 배열 크기, 속도 슬라이더) 맨 아래에 위치해 타이틀과 동떨어져 보였음.

**변경 전 모바일 레이아웃:**
```
Sorting Algorithm Visualizer
알고리즘 [select]
배열 크기 [slider]
속도 [slider]
[☀️]  ← 혼자 뚝 떨어짐
```

## 변경 내용

ThemeToggle을 브레이크포인트별로 다르게 렌더링:

- **모바일 (`sm` 미만):** 타이틀 행 우측에 배치 (`sm:hidden`)
- **데스크탑 (`sm` 이상):** 컨트롤 그룹 끝에 배치 (`hidden sm:block`) — 기존과 동일

**변경 후 모바일 레이아웃:**
```
Sorting Algorithm Visualizer    [☀️]  ← 타이틀 우측
알고리즘 [select]
배열 크기 [slider]
속도 [slider]
```

## 구현 방식

Tailwind의 반응형 유틸리티(`sm:hidden`, `hidden sm:block`)로 동일한 ThemeToggle 컴포넌트를 두 위치에 각각 렌더링. 컴포넌트 분기 없이 CSS visibility만으로 처리.
