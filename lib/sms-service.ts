import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error("Twilio credentials are not configured")
}

const client = twilio(accountSid, authToken)

export interface SMSMessage {
  to: string
  message: string
  type?: "booking" | "reminder" | "confirmation" | "general"
}

export class SMSService {
  static async sendSMS({ to, message, type = "general" }: SMSMessage) {
    try {
      // Normalize phone number - add +48 if it's a Polish number without country code
      const normalizedPhone = this.normalizePhoneNumber(to)

      const result = await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: normalizedPhone,
      })

      console.log(`SMS sent successfully: ${result.sid}`)
      return {
        success: true,
        messageId: result.sid,
        to: normalizedPhone,
        type,
      }
    } catch (error) {
      console.error("SMS sending failed:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        to,
        type,
      }
    }
  }

  static normalizePhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "")

    // If it starts with 48, add +
    if (digits.startsWith("48") && digits.length === 11) {
      return `+${digits}`
    }

    // If it's a 9-digit Polish number, add +48
    if (digits.length === 9) {
      return `+48${digits}`
    }

    // If it already has +, return as is
    if (phone.startsWith("+")) {
      return phone
    }

    // Default: add + to the beginning
    return `+${digits}`
  }

  static createBookingConfirmation(clientName: string, date: string, time: string): string {
    return `Dzień dobry ${clientName}! Potwierdzamy rezerwację wizyty w EduHustawka na ${date} o ${time}. W razie pytań prosimy o kontakt. Dziękujemy!`
  }

  static createBookingReminder(clientName: string, date: string, time: string): string {
    return `Przypominamy ${clientName} o wizycie jutro (${date}) o ${time} w EduHustawka. Adres: ul. Przykładowa 1. Do zobaczenia!`
  }

  static createContactConfirmation(clientName: string): string {
    return `Dzień dobry ${clientName}! Otrzymaliśmy Twoją wiadomość przez formularz kontaktowy. Odpowiemy w ciągu 24h. EduHustawka`
  }
}
