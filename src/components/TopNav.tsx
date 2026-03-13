"use client";

import { AlgorithmType, ALGORITHM_OPTIONS, ARRAY_SIZE_MIN, ARRAY_SIZE_MAX, SPEED_MIN, SPEED_MAX } from "@/types";

interface TopNavProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  isSorting: boolean;
}

export default function TopNav({
  selectedAlgorithm,
  onAlgorithmChange,
  arraySize,
  onArraySizeChange,
  animationSpeed,
  onAnimationSpeedChange,
  isSorting,
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
          {/* 알고리즘 선택 드롭다운 — 정렬 중 비활성화 */}
          <div className="flex items-center gap-2">
            <label htmlFor="algorithm-select" className="text-sm text-gray-300 whitespace-nowrap">
              알고리즘
            </label>
            <select
              id="algorithm-select"
              value={selectedAlgorithm}
              onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmType)}
              disabled={isSorting}
              className="bg-gray-800 text-white text-sm border border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ALGORITHM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 배열 크기 슬라이더 — 정렬 중 비활성화 */}
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
              disabled={isSorting}
              className="w-24 sm:w-32 accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="배열 크기 조절"
            />
          </div>

          {/* 애니메이션 속도 슬라이더 — 정렬 중에도 조작 가능 */}
          <div className="flex items-center gap-2">
            <label htmlFor="speed-slider" className="text-sm text-gray-300 whitespace-nowrap">
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
        </div>
      </div>
    </nav>
  );
}
