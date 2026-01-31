import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "InnoInternHUB | Where Ideas Meet Talent",
  description: "Connect innovators, students, and investors to build the future. The premier innovation-to-internship platform.",
  keywords: ["internship", "innovation", "startup", "students", "projects", "certificates"],
  authors: [{ name: "InnoInternHUB Team" }],
  openGraph: {
    title: "InnoInternHUB | Where Ideas Meet Talent",
    description: "Connect innovators, students, and investors to build the future.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
