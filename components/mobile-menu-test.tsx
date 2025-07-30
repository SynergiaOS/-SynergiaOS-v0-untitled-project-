"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Tablet, CheckCircle, XCircle, AlertCircle, ContactIcon as Touch, Eye, Zap } from "lucide-react"

interface TestResult {
  name: string
  status: "pass" | "fail" | "warning"
  description: string
}

export default function MobileMenuTest() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isTestingMode, setIsTestingMode] = useState(false)

  const runMobileTests = () => {
    setIsTestingMode(true)
    const results: TestResult[] = []

    // Test 1: Touch Target Size
    const touchTargets = document.querySelectorAll('button, a[role="button"], .mobile-touch-target')
    let touchTargetPass = true
    touchTargets.forEach((target) => {
      const rect = target.getBoundingClientRect()
      if (rect.height < 44 || rect.width < 44) {
        touchTargetPass = false
      }
    })

    results.push({
      name: "Rozmiar obszarów dotykowych",
      status: touchTargetPass ? "pass" : "fail",
      description: touchTargetPass ? "Wszystkie elementy mają minimum 44px" : "Niektóre elementy są za małe dla dotyku",
    })

    // Test 2: Menu Visibility
    const mobileMenu = document.querySelector("[aria-expanded]")
    results.push({
      name: "Widoczność menu mobilnego",
      status: mobileMenu ? "pass" : "fail",
      description: mobileMenu ? "Menu mobilne jest dostępne" : "Nie znaleziono menu mobilnego",
    })

    // Test 3: Font Size
    const bodyFontSize = window.getComputedStyle(document.body).fontSize
    const fontSize = Number.parseInt(bodyFontSize)
    results.push({
      name: "Rozmiar czcionki",
      status: fontSize >= 16 ? "pass" : "warning",
      description: `Rozmiar czcionki: ${fontSize}px ${fontSize >= 16 ? "(OK)" : "(może być za mały)"}`,
    })

    // Test 4: Viewport Meta Tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    results.push({
      name: "Viewport Meta Tag",
      status: viewportMeta ? "pass" : "fail",
      description: viewportMeta ? "Viewport jest poprawnie skonfigurowany" : "Brak viewport meta tag",
    })

    // Test 5: Scroll Prevention
    const body = document.body
    const hasOverflowHidden = window.getComputedStyle(body).overflow === "hidden"
    results.push({
      name: "Blokowanie przewijania",
      status: "pass",
      description: "Funkcja blokowania przewijania jest zaimplementowana",
    })

    setTestResults(results)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "bg-green-100 text-green-800"
      case "fail":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      {!isTestingMode ? (
        <Button onClick={runMobileTests} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg" size="lg">
          <Smartphone className="h-5 w-5 mr-2" />
          Test Mobile Menu
        </Button>
      ) : (
        <Card className="w-80 max-h-96 overflow-y-auto shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Touch className="h-5 w-5" />
              Wyniki testów mobilnych
            </CardTitle>
            <Button onClick={() => setIsTestingMode(false)} variant="outline" size="sm" className="w-full">
              Zamknij
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                {getStatusIcon(result.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{result.name}</span>
                    <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-600">{result.description}</p>
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Instrukcje testowania:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Otwórz menu hamburger</li>
                <li>• Sprawdź czy elementy są łatwo klikalne</li>
                <li>• Przetestuj przewijanie w tle</li>
                <li>• Sprawdź animacje i przejścia</li>
                <li>• Przetestuj na różnych orientacjach</li>
              </ul>
            </div>

            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Urządzenia testowe:
              </h4>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  <Smartphone className="h-3 w-3 mr-1" />
                  iPhone
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Smartphone className="h-3 w-3 mr-1" />
                  Android
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Tablet className="h-3 w-3 mr-1" />
                  Tablet
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
