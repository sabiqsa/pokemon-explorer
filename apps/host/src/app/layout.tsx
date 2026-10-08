import type { Metadata } from "next";
import { ThemeScript, ThemeToggle } from "@pokedex/ui";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokémon Explorer",
  description: "Pokémon and berries, side by side.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // ThemeScript sets data-theme before hydration, so the attributes differ on purpose.
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex justify-end px-4 pt-4">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
