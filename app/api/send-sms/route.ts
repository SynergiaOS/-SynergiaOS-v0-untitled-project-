import { type NextRequest, NextResponse } from "next/server"
import { SMSService } from "@/lib/sms-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, message, type } = body

    if (!to || !message) {
      return NextResponse.json({ error: "Brak wymaganych pól: to, message" }, { status: 400 })
    }

    const result = await SMSService.sendSMS({ to, message, type })

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result,
        message: "SMS wysłany pomyślnie",
      })
    } else {
      return NextResponse.json({ error: result.message, details: result.error }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Błąd API send-sms:", error)
    return NextResponse.json({ error: "Wewnętrzny błąd serwera", details: error.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "SMS API działa poprawnie",
    endpoints: {
      POST: "/api/send-sms - wysyła SMS",
      body: {
        to: "numer telefonu (+48...)",
        message: "treść wiadomości",
        type: "booking|reminder|confirmation|general",
      },
    },
  })
}
