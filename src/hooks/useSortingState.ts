"use client";

import { useState, useEffect, useRef } from "react";
import { generateRandomArray } from "@/utils/array";
import { completionAnimation } from "@/utils/animation";
import { ALGORITHM_MAP } from "@/utils/algorithms";
import { AlgorithmType, BarState, SPEED_DEFAULT } from "@/types";

export function useSortingState(
  arraySize: number,
  selectedAlgorithm: AlgorithmType,
  animationSpeed: number
) {
  const [array, setArray] = useState<number[]>([]);
  const [barStates, setBarStates] = useState<BarState[]>([]);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const isSortingRef = useRef<boolean>(false);
  const shouldStopRef = useRef<boolean>(false);
  const speedRef = useRef<number>(SPEED_DEFAULT);

  // animationSpeed 변경 시 speedRef 실시간 동기화
  useEffect(() => {
    speedRef.current = animationSpeed;
  }, [animationSpeed]);

  const initArray = (size: number) => {
    const newArr = generateRandomArray(size);
    setArray(newArr);
    setBarStates(new Array(size).fill('default'));
  };

  // arraySize 변경 시 자동 재생성
  useEffect(() => {
    initArray(arraySize);
  }, [arraySize]);

  const handleGenerateArray = () => {
    initArray(arraySize);
  };

  const handleReset = () => {
    shouldStopRef.current = true;
    isSortingRef.current = false;
    setIsSorting(false);
    initArray(arraySize);
  };

  const handleStartSort = async () => {
    if (isSortingRef.current) return;

    const sortFn = ALGORITHM_MAP[selectedAlgorithm];
    if (!sortFn) return;

    isSortingRef.current = true;
    shouldStopRef.current = false;
    setIsSorting(true);

    await sortFn(array, setArray, setBarStates, speedRef, shouldStopRef);

    if (!shouldStopRef.current) {
      await completionAnimation(array.length, setBarStates);
    }

    isSortingRef.current = false;
    setIsSorting(false);
  };

  return {
    array,
    barStates,
    isSorting,
    handleGenerateArray,
    handleStartSort,
    handleReset,
  };
}
