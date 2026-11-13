import type { Metadata, Viewport } from "next";
import { temaInicialScript } from "@/components/aluno/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Academia Veritas UniClass", template: "%s · Veritas UniClass" },
  description: "Cursos preparatórios, banco de questões comentadas, simulados e rotina de estudos para concursos.",
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }], apple: "/apple-touch-icon.png" },
  applicationName: "Veritas UniClass",
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#0E1B2E" }, { media: "(prefers-color-scheme: dark)", color: "#0B1524" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaInicialScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
