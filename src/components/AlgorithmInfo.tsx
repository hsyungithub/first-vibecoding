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
