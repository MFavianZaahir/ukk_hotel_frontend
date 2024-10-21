"use client"

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, User, LogOut, LogIn } from "lucide-react";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import whotel from "@/public/w-hotels-1.png"
import "./globals.css";

// Import custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// RootLayout component
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    // Get all cookie names
    const cookies = Object.keys(Cookies.get());

    // Remove all cookies
    cookies.forEach(cookie => {
      Cookies.remove(cookie, { path: '/' });
    });

    // Redirect to login page
    router.push("/");
  };

  // useEffect(() => {
  //   // Check if the user is logged in
  //   const token = Cookies.get("token");
  //   if (!token) {
  //     router.push("/");
  //   }
  // }, [router]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster richColors />

          {/* Wrapper with Navigation, Main Content, and Footer */}
          <div className="min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="bg-gray-800 shadow-md p-4">
              <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src={whotel}
                    alt="Wikusama Hotel Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-2xl font-bold">Wikusama Hotel</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <Link href="/auth/login-as-guest">
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    className="text-gray-300 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 bg-gray-900">{children}</main>

            {/* Footer Component */}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}