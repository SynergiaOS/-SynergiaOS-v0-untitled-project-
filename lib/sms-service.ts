import twilio from "twilio"

export interface SMSOptions {
  to: string
  message: string
  type?: "booking" | "reminder" | "confirmation" | "general"
}

export interface SMSResult {
  success: boolean
  messageId?: string
  to?: string
  error?: string
  message?: string
}

export class SMSService {
  private static client: twilio.Twilio | null = null

  private static getClient() {
    if (!this.client) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID
      const authToken = process.env.TWILIO_AUTH_TOKEN

      if (!accountSid || !authToken) {
        throw new Error("Twilio credentials not configured")
      }

      this.client = twilio(accountSid, authToken)
    }
    return this.client
  }

  static async sendSMS(options: SMSOptions): Promise<SMSResult> {
    try {
      const client = this.getClient()
      const fromNumber = process.env.TWILIO_PHONE_NUMBER

      if (!fromNumber) {
        return {
          success: false,
          error: "Twilio phone number not configured",
        }
      }

      // Ensure Polish number format
      let toNumber = options.to
      if (toNumber.startsWith("48") && !toNumber.startsWith("+48")) {
        toNumber = "+" + toNumber
      } else if (!toNumber.startsWith("+")) {
        toNumber = "+48" + toNumber.replace(/^0/, "")
      }

      const message = await client.messages.create({
        body: options.message,
        from: fromNumber,
        to: toNumber,
      })

      return {
        success: true,
        messageId: message.sid,
        to: toNumber,
        message: "SMS sent successfully",
      }
    } catch (error: any) {
      console.error("SMS sending error:", error)
      return {
        success: false,
        error: error.message || "Failed to send SMS",
      }
    }
  }

  static createBookingConfirmation(clientName: string, date: string, time: string): string {
    return `Dzień dobry ${clientName}! Potwierdzamy rezerwację wizyty w EduHustawka na ${date} o ${time}. W razie pytań: 123-456-789. Dziękujemy!`
  }

  static createBookingReminder(clientName: string, date: string, time: string): string {
    return `Przypominamy ${clientName} o wizycie jutro ${date} o ${time} w EduHustawka. Adres: ul. Przykładowa 1. Do zobaczenia!`
  }

  static createContactConfirmation(clientName: string): string {
    return `Dzień dobry ${clientName}! Otrzymaliśmy Twoją wiadomość przez formularz kontaktowy. Odpowiemy w ciągu 24h. EduHustawka`
  }
}
