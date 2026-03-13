import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sorting Algorithm Visualizer",
  description: "다양한 정렬 알고리즘의 작동 과정을 실시간 애니메이션으로 시각화하는 웹 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
