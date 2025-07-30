import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

export async function POST(request: NextRequest) {
  try {
    if (!accountSid || !authToken) {
      return NextResponse.json({ error: "Twilio credentials not configured" }, { status: 500 })
    }

    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    const client = twilio(accountSid, authToken)

    // Add phone number to verified caller IDs
    const validationRequest = await client.validationRequests.create({
      phoneNumber: phoneNumber,
      method: "sms", // or 'call'
    })

    return NextResponse.json({
      success: true,
      validationCode: validationRequest.validationCode,
      message: "Verification SMS sent. Please check your phone.",
    })
  } catch (error) {
    console.error("Phone verification error:", error)
    return NextResponse.json({ error: "Failed to verify phone number" }, { status: 500 })
  }
}
