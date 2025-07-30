import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    if (!accountSid || !authToken) {
      return NextResponse.json({ error: "Twilio not configured" }, { status: 500 })
    }

    const client = twilio(accountSid, authToken)

    // Format phone number for Poland
    let formattedNumber = phoneNumber
    if (formattedNumber.startsWith("48") && !formattedNumber.startsWith("+48")) {
      formattedNumber = "+" + formattedNumber
    } else if (!formattedNumber.startsWith("+")) {
      formattedNumber = "+48" + formattedNumber.replace(/^0/, "")
    }

    // Add to verified caller IDs (for trial accounts)
    const validationRequest = await client.validationRequests.create({
      phoneNumber: formattedNumber,
    })

    return NextResponse.json({
      success: true,
      validationCode: validationRequest.validationCode,
      message: "Verification code sent",
    })
  } catch (error: any) {
    console.error("Phone verification error:", error)
    return NextResponse.json(
      {
        error: "Verification failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
