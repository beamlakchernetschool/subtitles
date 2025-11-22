import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sourceSerif4 = Source_Serif_4({
  variable: "--font-source-serif-4",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beamlak SRTs - Subtitle Download Service",
  description: "Search and download subtitles for movies and TV shows from OpenSubtitles. Free, fast, and easy to use.",
  keywords: ["subtitles", "movies", "TV shows", "OpenSubtitles", "SRT", "downloads", "Beamlak"],
  authors: [{ name: "Beamlak SRTs Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Beamlak SRTs",
    description: "Search and download subtitles for movies and TV shows",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beamlak SRTs",
    description: "Search and download subtitles for movies and TV shows",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sourceSerif4.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
