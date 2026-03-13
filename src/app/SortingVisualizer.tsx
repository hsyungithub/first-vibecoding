"use client";

import { useState, useEffect, useRef } from "react";
import TopNav from "@/components/TopNav";
import VisualizerArea from "@/components/VisualizerArea";
import ControlBar from "@/components/ControlBar";
import { generateRandomArray } from "@/utils/array";
import { completionAnimation } from "@/utils/animation";
import { ALGORITHM_MAP } from "@/utils/algorithms";
import { AlgorithmType, BarState, ARRAY_SIZE_DEFAULT, SPEED_DEFAULT } from "@/types";

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [barStates, setBarStates] = useState<BarState[]>([]);
  const [arraySize, setArraySize] = useState<number>(ARRAY_SIZE_DEFAULT);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("bubble");
  const [animationSpeed, setAnimationSpeed] = useState<number>(SPEED_DEFAULT);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  // 비동기 루프에서 최신 값을 참조하기 위한 ref
  const isSortingRef = useRef<boolean>(false);
  const shouldStopRef = useRef<boolean>(false);
  const speedRef = useRef<number>(SPEED_DEFAULT);

  // animationSpeed state 변경 시 speedRef 동기화 (정렬 중 실시간 반영)
  useEffect(() => {
    speedRef.current = animationSpeed;
  }, [animationSpeed]);

  // 배열 초기화 헬퍼
  const initArray = (size: number) => {
    const newArr = generateRandomArray(size);
    setArray(newArr);
    setBarStates(new Array(size).fill('default'));
  };

  // 초기 배열 생성 및 배열 크기 변경 시 자동 재생성
  useEffect(() => {
    initArray(arraySize);
  }, [arraySize]);

  const handleGenerateArray = () => {
    initArray(arraySize);
  };

  const handleReset = () => {
    // 정렬 중이면 중단 신호 설정
    shouldStopRef.current = true;
    isSortingRef.current = false;
    setIsSorting(false);
    // 새 배열 생성
    initArray(arraySize);
  };

  const handleStartSort = async () => {
    if (isSortingRef.current) return;

    const sortFn = ALGORITHM_MAP[selectedAlgorithm];
    if (!sortFn) {
      // 아직 구현되지 않은 알고리즘
      return;
    }

    isSortingRef.current = true;
    shouldStopRef.current = false;
    setIsSorting(true);

    await sortFn(array, setArray, setBarStates, speedRef, shouldStopRef);

    // 정상 완료 시 초록 웨이브 애니메이션
    if (!shouldStopRef.current) {
      await completionAnimation(array.length, setBarStates);
    }

    isSortingRef.current = false;
    setIsSorting(false);
  };

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      <TopNav
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
        isSorting={isSorting}
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
