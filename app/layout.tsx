import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import "./globals.css";
import "@hannasage/projection-ui/tokens";
import { ThemeProvider } from "./context/ThemeContext";
import { getMetadataInfo } from "./lib/content-loader";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const metadataInfo = getMetadataInfo();

export const viewport: Viewport = {
  themeColor: "#07090C",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hannasage.love"),
  title: {
    default: metadataInfo.title,
    template: "%s · Hanna Sage",
  },
  description: metadataInfo.description,
  keywords: metadataInfo.keywords,
  authors: [{ name: metadataInfo.author }],
  openGraph: {
    title: metadataInfo.openGraph.title,
    description: metadataInfo.openGraph.description,
    type: metadataInfo.openGraph.type as "website",
    locale: metadataInfo.openGraph.locale,
    url: "/",
    siteName: "Hanna Sage",
  },
  twitter: {
    card: "summary_large_image",
    title: metadataInfo.openGraph.title,
    description: metadataInfo.openGraph.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plexMono.variable} ${syne.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
