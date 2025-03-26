"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ProfileProvider } from "@/components/profile-data-provider"
import { PortfolioDataProvider } from "@/components/data-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ProfileProvider>
            <PortfolioDataProvider>
              <main className="min-h-screen">{children}</main>
            </PortfolioDataProvider>
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}