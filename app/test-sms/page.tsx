"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TestSMSPage() {
  const [phoneNumber, setPhoneNumber] = useState("+48531509008")
  const [message, setMessage] = useState("Test SMS z EduHustawka!")
  const [type, setType] = useState("general")
  const [clientName, setClientName] = useState("Jan Kowalski")
  const [date, setDate] = useState("2024-08-15")
  const [time, setTime] = useState("10:00")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const sendSMS = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: type === "general" ? message : undefined,
          type,
          clientName,
          date,
          time,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Network error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Test SMS - EduHustawka</CardTitle>
          <CardDescription>Testuj funkcjonalność wysyłania SMS-ów przez Twilio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone">Numer telefonu</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+48531509008"
            />
          </div>

          <div>
            <Label htmlFor="type">Typ wiadomości</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Ogólna</SelectItem>
                <SelectItem value="booking">Potwierdzenie rezerwacji</SelectItem>
                <SelectItem value="reminder">Przypomnienie</SelectItem>
                <SelectItem value="confirmation">Potwierdzenie kontaktu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "general" && (
            <div>
              <Label htmlFor="message">Treść wiadomości</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Wpisz treść SMS..."
                rows={3}
              />
            </div>
          )}

          {(type === "booking" || type === "reminder" || type === "confirmation") && (
            <>
              <div>
                <Label htmlFor="clientName">Imię klienta</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Jan Kowalski"
                />
              </div>

              {(type === "booking" || type === "reminder") && (
                <>
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>

                  <div>
                    <Label htmlFor="time">Godzina</Label>
                    <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                </>
              )}
            </>
          )}

          <Button onClick={sendSMS} disabled={loading} className="w-full">
            {loading ? "Wysyłanie..." : "Wyślij SMS"}
          </Button>

          {result && (
            <div
              className={`p-4 rounded-lg ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <pre className="text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
