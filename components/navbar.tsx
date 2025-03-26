"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Only show the navbar after client-side hydration to prevent mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { name: "Main", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Admin", href: "/admin" },
  ]

  if (!mounted) {
    return null // Return null on server-side to prevent hydration mismatch
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-end">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

