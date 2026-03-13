"use client";

import { useState, useEffect, useRef } from "react";
import TopNav from "@/components/TopNav";
import VisualizerArea from "@/components/VisualizerArea";
import ControlBar from "@/components/ControlBar";
import { generateRandomArray } from "@/utils/array";
import { completionAnimation } from "@/utils/animation";
import { ALGORITHM_MAP } from "@/utils/algorithms";
import { useTheme } from "@/hooks/useTheme";
import { AlgorithmType, BarState, ARRAY_SIZE_DEFAULT, SPEED_DEFAULT } from "@/types";
import AlgorithmInfo from "@/components/AlgorithmInfo";

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [barStates, setBarStates] = useState<BarState[]>([]);
  const [arraySize, setArraySize] = useState<number>(ARRAY_SIZE_DEFAULT);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("bubble");
  const [animationSpeed, setAnimationSpeed] = useState<number>(SPEED_DEFAULT);
  const [isSorting, setIsSorting] = useState<boolean>(false);

  const { theme, toggleTheme } = useTheme();

  const isSortingRef = useRef<boolean>(false);
  const shouldStopRef = useRef<boolean>(false);
  const speedRef = useRef<number>(SPEED_DEFAULT);

  useEffect(() => {
    speedRef.current = animationSpeed;
  }, [animationSpeed]);

  const initArray = (size: number) => {
    const newArr = generateRandomArray(size);
    setArray(newArr);
    setBarStates(new Array(size).fill('default'));
  };

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

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors">
      <TopNav
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
        arraySize={arraySize}
        onArraySizeChange={setArraySize}
        animationSpeed={animationSpeed}
        onAnimationSpeedChange={setAnimationSpeed}
        isSorting={isSorting}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <AlgorithmInfo algorithm={selectedAlgorithm} />
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
