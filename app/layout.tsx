import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata: Metadata = {
  title: "Hanna Sage - Software Engineer & AI Enthusiast",
  description: "Creative technologist with 5+ years building scalable systems and leading teams. Currently expanding AI/ML expertise in Baltimore, Maryland.",
  keywords: ["Software Engineer", "AI", "Machine Learning", "Full Stack", "React", "Python", "Baltimore"],
  authors: [{ name: "Hanna Sage" }],
  openGraph: {
    title: "Hanna Sage - Software Engineer & AI Enthusiast",
    description: "Creative technologist with 5+ years building scalable systems and leading teams.",
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
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
