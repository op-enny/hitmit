import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HITMIT | Verkaufe dein Auto über Social Media",
  description: "Der moderne Auto-Marktplatz, auf dem Privatverkäufer und Händler ihre Fahrzeuge über unsere TikTok- und Instagram-Kanäle verkaufen. Erreiche tausende Käufer sofort.",
  keywords: ["Auto Marktplatz", "Auto verkaufen", "TikTok", "Instagram", "Fahrzeugverkauf", "Autohändler", "Gebrauchtwagen"],
  openGraph: {
    title: "HITMIT | Verkaufe dein Auto über Social Media",
    description: "Der moderne Auto-Marktplatz. Reiche dein Fahrzeug ein und erreiche tausende Käufer über unsere Social-Kanäle.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
