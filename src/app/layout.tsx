import { Inter, Roboto_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "CollocationApp",
  description: "Learning Collocation to improve English",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <header className="flex justify-between bg-blue-600 p-4 text-white">
            <Link href="/">
              <h1 className="text-lg font-bold">Dictionary</h1>
            </Link>
            <Link href="/progress">
              <h1 className="text-lg font-bold">Progress</h1>
            </Link>
            <Link href="/quiz">
              <h1 className="text-lg font-bold">Quiz</h1>
            </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
