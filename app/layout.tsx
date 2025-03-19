import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image to PDF Converter",
  description: "Convert your images to PDF quickly and easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
