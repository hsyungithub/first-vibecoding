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
            className="bg-blue-500 rounded-t-sm"
            style={{
              height: `${heightPercent}%`,
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
