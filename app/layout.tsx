import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ConsentProvider } from "@/contexts/consent-context"
import { UserPreferencesProvider } from "@/contexts/user-preferences-context"
import CookieBanner from "@/components/cookie-banner"
import GoogleAnalytics from "@/components/google-analytics"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "./client-layout"
import MobileMenuTest from "@/components/mobile-menu-test"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "EduHustawka - Centrum Terapii Dzieci | Kraków",
    template: "%s | EduHustawka",
  },
  description:
    "Profesjonalne centrum terapii dzieci w Krakowie. Oferujemy terapię pedagogiczną, logopedyczną, integracji sensorycznej i wiele więcej. Umów wizytę już dziś!",
  keywords: [
    "terapia dzieci",
    "terapia pedagogiczna",
    "logopedia",
    "integracja sensoryczna",
    "Kraków",
    "centrum terapii",
    "rozwój dziecka",
    "wsparcie edukacyjne",
  ],
  authors: [{ name: "EduHustawka" }],
  creator: "EduHustawka",
  publisher: "EduHustawka",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://eduhustawka.pl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "/",
    title: "EduHustawka - Centrum Terapii Dzieci | Kraków",
    description:
      "Profesjonalne centrum terapii dzieci w Krakowie. Oferujemy terapię pedagogiczną, logopedyczną, integracji sensorycznej i wiele więcej.",
    siteName: "EduHustawka",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EduHustawka - Centrum Terapii Dzieci",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduHustawka - Centrum Terapii Dzieci | Kraków",
    description:
      "Profesjonalne centrum terapii dzieci w Krakowie. Oferujemy terapię pedagogiczną, logopedyczną, integracji sensorycznej i wiele więcej.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#0d9488" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <ConsentProvider>
            <UserPreferencesProvider>
              <Suspense fallback={null}>
                <ClientLayout>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1 pt-16">{children}</main>
                    <Footer />
                  </div>
                  <CookieBanner />
                  <GoogleAnalytics />
                  {process.env.NODE_ENV === "development" && <MobileMenuTest />}
                </ClientLayout>
              </Suspense>
            </UserPreferencesProvider>
          </ConsentProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
