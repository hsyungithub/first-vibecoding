"use client";

interface ThemeToggleProps {
  theme: "dark" | "light";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      className="p-2 rounded text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      title={theme === "dark" ? "라이트 모드" : "다크 모드"}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
