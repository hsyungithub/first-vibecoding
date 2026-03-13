import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sorting Algorithm Visualizer",
  description: "버블, 선택, 삽입, 퀵, 병합 정렬 알고리즘의 작동 과정을 실시간 애니메이션으로 시각화",
  openGraph: {
    title: "Sorting Algorithm Visualizer",
    description: "버블, 선택, 삽입, 퀵, 병합 정렬을 실시간 애니메이션으로 시각화",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sorting Algorithm Visualizer",
    description: "버블, 선택, 삽입, 퀵, 병합 정렬을 실시간 애니메이션으로 시각화",
  },
};

const themeScript = `
  (function() {
    try {
      var stored = localStorage.getItem('theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
