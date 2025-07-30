import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: "Brak numeru telefonu" }, { status: 400 })
    }

    // Formatuj numer telefonu
    let formattedPhone = phoneNumber.replace(/[^\d+]/g, "")
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+48" + formattedPhone
    }

    // Wyślij kod weryfikacyjny przez Twilio Verify
    const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID!).verifications.create({
      to: formattedPhone,
      channel: "sms",
    })

    return NextResponse.json({
      success: true,
      message: "Kod weryfikacyjny wysłany",
      sid: verification.sid,
      to: formattedPhone,
    })
  } catch (error: any) {
    console.error("Błąd weryfikacji numeru:", error)

    return NextResponse.json(
      {
        error: "Błąd wysyłania kodu weryfikacyjnego",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
