import { type NextRequest, NextResponse } from "next/server"
import { SMSService } from "@/lib/sms-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, message, type, clientName, date, time } = body

    if (!to) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    let finalMessage = message

    // Generate message based on type if not provided
    if (!message && type && clientName) {
      switch (type) {
        case "booking":
          finalMessage = SMSService.createBookingConfirmation(clientName, date, time)
          break
        case "reminder":
          finalMessage = SMSService.createBookingReminder(clientName, date, time)
          break
        case "confirmation":
          finalMessage = SMSService.createContactConfirmation(clientName)
          break
        default:
          finalMessage = "Wiadomość z EduHustawka"
      }
    }

    if (!finalMessage) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const result = await SMSService.sendSMS({
      to,
      message: finalMessage,
      type,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        to: result.to,
        message: finalMessage,
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("SMS API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
