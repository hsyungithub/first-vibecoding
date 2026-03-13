"use client";

import { useState } from "react";
import TopNav from "@/components/TopNav";
import VisualizerArea from "@/components/VisualizerArea";
import ControlBar from "@/components/ControlBar";
import AlgorithmInfo from "@/components/AlgorithmInfo";
import { useTheme } from "@/hooks/useTheme";
import { useSortingState } from "@/hooks/useSortingState";
import { AlgorithmType, ARRAY_SIZE_DEFAULT, SPEED_DEFAULT } from "@/types";

export default function SortingVisualizer() {
  const [arraySize, setArraySize] = useState<number>(ARRAY_SIZE_DEFAULT);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>("bubble");
  const [animationSpeed, setAnimationSpeed] = useState<number>(SPEED_DEFAULT);

  const { theme, toggleTheme } = useTheme();
  const { array, barStates, isSorting, handleGenerateArray, handleStartSort, handleReset } =
    useSortingState(arraySize, selectedAlgorithm, animationSpeed);

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
