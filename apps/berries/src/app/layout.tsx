import type { Metadata } from "next";
import { Footer, Navbar, ThemeScript } from "@pokedex/ui";
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
  title: { default: "Berries · Pokémon Explorer", template: "%s · Pokémon Explorer" },
  description: "Browse berries.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar active="berries" />
        <div className="flex min-h-0 flex-auto flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
