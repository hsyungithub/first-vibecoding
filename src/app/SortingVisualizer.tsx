"use client";

import { useState, useEffect, useRef } from "react";
import TopNav from "@/components/TopNav";
import VisualizerArea from "@/components/VisualizerArea";
import ControlBar from "@/components/ControlBar";
import { generateRandomArray } from "@/utils/array";
import { sleep, speedToMs, swap, completionAnimation } from "@/utils/animation";
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

    isSortingRef.current = true;
    shouldStopRef.current = false;
    setIsSorting(true);

    // 현재 배열 복사 (로컬에서 정렬 진행)
    let arr = [...array];
    const n = arr.length;

    // 버블 정렬 데모
    outer: for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // 중단 신호 확인
        if (shouldStopRef.current) break outer;

        // 비교 중인 두 막대 빨간색 표시
        setBarStates((prev) => {
          const next = [...prev];
          next[j] = 'comparing';
          next[j + 1] = 'comparing';
          return next;
        });

        await sleep(speedToMs(speedRef.current));
        if (shouldStopRef.current) break outer;

        if (arr[j] > arr[j + 1]) {
          // 교환 시 노란색 표시
          setBarStates((prev) => {
            const next = [...prev];
            next[j] = 'swapping';
            next[j + 1] = 'swapping';
            return next;
          });

          arr = swap(arr, j, j + 1);
          setArray([...arr]);

          await sleep(speedToMs(speedRef.current));
          if (shouldStopRef.current) break outer;
        }

        // 비교 후 기본 색상 복원
        setBarStates((prev) => {
          const next = [...prev];
          next[j] = 'default';
          next[j + 1] = 'default';
          return next;
        });
      }
    }

    // 정상 완료 시 초록 웨이브 애니메이션
    if (!shouldStopRef.current) {
      await completionAnimation(n, setBarStates);
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
