import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { getMetadataInfo } from "./lib/content-loader";

const metadataInfo = getMetadataInfo();

export const metadata: Metadata = {
  title: metadataInfo.title,
  description: metadataInfo.description,
  keywords: metadataInfo.keywords,
  authors: [{ name: metadataInfo.author }],
  openGraph: {
    title: metadataInfo.openGraph.title,
    description: metadataInfo.openGraph.description,
    type: metadataInfo.openGraph.type as "website",
    locale: metadataInfo.openGraph.locale,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
