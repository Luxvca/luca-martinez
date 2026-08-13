import localFont from "next/font/local";
import "./globals.css";

const sans = localFont({
  src: "./fonts/Manrope-latin.woff2",
  variable: "--font-sans",
  weight: "200 800",
  display: "swap"
});

const display = localFont({
  src: "./fonts/CormorantGaramond-latin.woff2",
  variable: "--font-display",
  weight: "300 700",
  display: "swap"
});

export const metadata = {
  title: "Luca Martinez | Director & Editor",
  description: "Minimal cinematic portfolio for filmmaker Luca Martinez."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
