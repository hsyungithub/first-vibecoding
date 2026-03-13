"use client";

import { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import VisualizerArea from "@/components/VisualizerArea";
import ControlBar from "@/components/ControlBar";
import { generateRandomArray } from "@/utils/array";
import { AlgorithmType, ARRAY_SIZE_DEFAULT } from "@/types";

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
