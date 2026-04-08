import type { Metadata } from "next";
import { Caveat, Permanent_Marker, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora"
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat"
});

const marker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marker"
});

export const metadata: Metadata = {
  title: "Wall Calendar",
  description: "Animated range calendar with notes and polaroid stack"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${caveat.variable} ${marker.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
