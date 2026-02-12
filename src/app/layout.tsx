import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WordQuest - Learn Languages Through Games!",
  description: "A fun gamification app to help kids learn words, sentences, and build learning habits in English, Dutch, and German.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
