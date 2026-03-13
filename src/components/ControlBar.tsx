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
