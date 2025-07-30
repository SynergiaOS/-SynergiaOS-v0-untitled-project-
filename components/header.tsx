"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Phone, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const navigation = [
  { name: "Strona główna", href: "/" },
  { name: "O mnie", href: "/o-mnie" },
  { name: "Usługi", href: "/uslugi" },
  { name: "Kontakt", href: "/kontakt" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Zamknij menu przy zmianie rozmiaru okna
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Zablokuj przewijanie gdy menu jest otwarte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = "unset"
      document.body.style.position = "unset"
      document.body.style.width = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
      document.body.style.position = "unset"
      document.body.style.width = "unset"
    }
  }, [isOpen])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative h-12 w-48 md:h-16 md:w-64">
              <Image
                src="/images/logo.png"
                alt="EDU HUSTAWKA THERAPY CENTER"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded px-2 py-1",
                  pathname === item.href ? "text-teal-600" : "text-gray-700",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
              onClick={() => (window.location.href = "tel:+48531509008")}
            >
              <Phone className="h-4 w-4 mr-2" />
              Zadzwoń
            </Button>
          </div>

          {/* Mobile menu button - Zwiększony obszar dotykowy */}
          <button
            className="md:hidden p-3 -mr-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 mobile-touch-target"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={isOpen}
            style={{ minHeight: "48px", minWidth: "48px" }}
          >
            {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Navigation - Pełnoekranowe overlay */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <div className="fixed top-16 left-0 right-0 bottom-0 bg-white z-50 md:hidden overflow-y-auto mobile-menu-slide-in">
              <nav className="flex flex-col p-6 space-y-2">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between text-lg font-medium transition-all duration-200 px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2",
                      "hover:bg-teal-50 hover:text-teal-700 active:bg-teal-100 touch-ripple",
                      "mobile-touch-target mobile-nav-item", // Minimum 48px wysokości
                      pathname === item.href
                        ? "text-teal-600 bg-teal-50 border-l-4 border-teal-600"
                        : "text-gray-700 hover:text-teal-600",
                    )}
                    onClick={() => setIsOpen(false)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      minHeight: "48px", // Zapewnia minimum 48px wysokości dla lepszej dostępności
                    }}
                  >
                    <span>{item.name}</span>
                    <ChevronDown className="h-4 w-4 rotate-[-90deg] opacity-40" />
                  </Link>
                ))}

                {/* Separator */}
                <div className="border-t border-gray-200 my-4" />

                {/* Mobile CTA Button */}
                <div className="px-4 pt-2">
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white text-lg py-4 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 mobile-touch-target touch-ripple"
                    onClick={() => {
                      window.location.href = "tel:+48531509008"
                      setIsOpen(false)
                    }}
                    style={{ minHeight: "48px" }}
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    Zadzwoń teraz
                  </Button>
                </div>

                {/* Dodatkowe informacje kontaktowe */}
                <div className="px-4 pt-6 text-center text-sm text-gray-500">
                  <p className="font-medium">+48 531 509 008</p>
                  <p className="mt-1">Poniedziałek - Piątek: 9:00 - 17:00</p>
                  <p className="mt-2 text-xs">
                    ul. Przykładowa 123
                    <br />
                    31-000 Kraków
                  </p>
                </div>

                {/* Debug info dla testowania */}
                {process.env.NODE_ENV === "development" && (
                  <div className="px-4 pt-4 text-xs text-gray-400 border-t border-gray-100">
                    <p>🔧 Debug Mode</p>
                    <p>
                      Screen: {typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "N/A"}
                    </p>
                    <p>
                      User Agent:{" "}
                      {typeof navigator !== "undefined"
                        ? navigator.userAgent.includes("Mobile")
                          ? "Mobile"
                          : "Desktop"
                        : "N/A"}
                    </p>
                  </div>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
