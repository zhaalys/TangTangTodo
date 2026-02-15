import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { LanguageProvider } from "../context/LanguageContext";
import SplashScreen from "./components/SplashScreen";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tangtangtodo.netlify.app"),
  title: "Tangtang - Productivity for Next Generation",
  description:
    "Master your day with Tangtang. Simple, fun, and powerful productivity.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/tangtanglogo1.png",
    shortcut: "/tangtanglogo1.png",
    apple: "/tangtanglogo1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/tangtanglogo1.png" />
      </head>
      <body
        className={`${manrope.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <SplashScreen />
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
