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
