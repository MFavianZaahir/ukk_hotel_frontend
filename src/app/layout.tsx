"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, User, LogOut, LogIn, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import whotel from "@/public/w-hotels-1.png";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Function to fetch user role
  const getUserRole = async () => {
    try {
      // const response = await axios.get(`${process.env.NEXT_PUBLIC_baseURL}/auth/role`, {
      //   withCredentials: true,
      // });
      // setUserRole(response.data.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleLogout = () => {
    const cookies = Object.keys(Cookies.get());
    cookies.forEach((cookie) => {
      Cookies.remove(cookie, { path: "/" });
    });
    router.push("/auth/login-as-guest");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);

    // Fetch user role if logged in
    if (token) {
      getUserRole();
    }
  }, []);

  // Generates the dashboard link based on the user role
  const getDashboardLink = () => {
    switch (userRole) {
      case "admin":
        return "/admin/dashboard";
      case "resepsionis":
        return "/resepsionis/dashboard";
      case "pelanggan":
        return "/pelanggan/dashboard";
      default:
        return "/";
    }
  };

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
                  {/* Show login button only if not logged in */}
                  {!isLoggedIn && (
                    <Link href="/auth/login-as-guest">
                      <Button
                        variant="ghost"
                        className="text-gray-300 hover:text-white"
                      >
                        <LogIn className="mr-2 h-4 w-4" /> Login
                      </Button>
                    </Link>
                  )}

                  {/* Show dropdown if logged in */}
                  {isLoggedIn && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer">
                          <AvatarImage src="/path/to/user/profile.jpg" alt="Profile" />
                          <AvatarFallback>{userRole?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
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
