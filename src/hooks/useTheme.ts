"use client";

import { useState, useEffect } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  // 초기값 undefined — SSR/클라이언트 hydration 불일치 방지
  // 실제 값은 마운트 후 useEffect에서 결정
  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  // 마운트 시 저장된 값 또는 시스템 설정으로 초기화
  // localStorage/matchMedia 접근 실패(프라이빗 브라우징, 차단된 iframe 등) 시 기본값 "dark" 사용
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "dark" || stored === "light") {
        setTheme(stored);
      } else {
        setTheme(window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
      }
    } catch {
      setTheme("dark");
    }
  }, []);

  // theme 확정 후 <html> 클래스 및 localStorage 동기화
  useEffect(() => {
    if (theme === undefined) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // localStorage 쓰기 실패 시 무시 (테마는 현재 세션에서 정상 동작)
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // theme이 확정되기 전엔 FOUC 스크립트가 적용한 값을 그대로 사용
  const resolvedTheme: Theme = theme ?? "dark";

  return { theme: resolvedTheme, toggleTheme };
}
