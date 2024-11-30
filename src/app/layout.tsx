import { Inter, Roboto_Mono } from "next/font/google";
import Link from "next/link";
// import Image from 'next/image';
import "./globals.css";
import CanvasAnimation from "./components/CanvasAnimation";

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
        <div className="fixed inset-0 -z-10">
          <CanvasAnimation />
        </div>
        
        <header className="flex justify-between bg-blue-600 p-4 text-white">
          <div className="flex items-center space-x-4">
            {/* <Image
                  src="/COLLO_SPEAK_logo_header.svg"
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-20 h-10"
                />  */}
            <img src="/Collo_SPEAK_logo4.svg" alt="logo" className="w-20 h-10" />      
          </div>

          <div className="flex space-x-6">
            <Link href="/">
              <h1 className="text-lg font-bold">Dictionary</h1>
            </Link>
            <Link href="/progress">
              <h1 className="text-lg font-bold">Progress</h1>
            </Link>
            <Link href="/preference">
              <h1 className="text-lg font-bold">Preference</h1>
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
