import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
//import { ToyboxPanel } from "@/components/ToyboxPanel";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-accent",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Kevin Kim", template: "%s — Kevin Kim" },
  description: "Software engineer — CS + Cognitive Science @ Johns Hopkins.",
  metadataBase: new URL("https://kev-kim.com"),
  openGraph: {
    title: "Kevin Kim",
    description: "Software engineer — CS + Cognitive Science @ Johns Hopkins.",
    url: "https://kev-kim.com",
    siteName: "Kevin Kim",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Kim",
    description: "Software engineer — CS + Cognitive Science @ Johns Hopkins.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
