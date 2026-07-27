import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { draftMode } from "next/headers";
import { SanityVisualEditing } from "@/components/site/sanity-visual-editing";
import "./globals.css";

// Lato é a única fonte do sistema; Thin 100 é proibido pela spec.
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "OmniChat — Jornada conversacional no WhatsApp",
  description:
    "IA com profundidade de negócio rodando a jornada completa dentro do WhatsApp, com integração nativa e dados que provam resultado.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();
  return (
    <html lang="pt-BR" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        {isEnabled && <SanityVisualEditing />}
      </body>
    </html>
  );
}
