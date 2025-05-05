import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { LocationProvider } from "@/components/location-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RideCompare India - Compare Ride Fares Instantly",
  description: "Compare ride fares across Uber, Ola, Rapido and more in real-time across India",
  manifest: "/manifest.json",
  themeColor: "#0F172A",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LocationProvider>
              {children}
              <Toaster />
            </LocationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
