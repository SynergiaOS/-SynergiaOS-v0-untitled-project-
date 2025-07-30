import twilio from "twilio"

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)

export interface SMSMessage {
  to: string
  message: string
  type?: "booking" | "reminder" | "confirmation" | "general"
}

export class SMSService {
  private static formatPhoneNumber(phone: string): string {
    // Usuń wszystkie znaki oprócz cyfr i znaku +
    let cleaned = phone.replace(/[^\d+]/g, "")

    // Jeśli numer zaczyna się od 48, dodaj +
    if (cleaned.startsWith("48") && !cleaned.startsWith("+48")) {
      cleaned = "+" + cleaned
    }

    // Jeśli numer nie ma kodu kraju, dodaj +48
    if (!cleaned.startsWith("+")) {
      cleaned = "+48" + cleaned
    }

    return cleaned
  }

  static async sendSMS({ to, message, type = "general" }: SMSMessage) {
    try {
      const formattedPhone = this.formatPhoneNumber(to)

      console.log(`Wysyłanie SMS do: ${formattedPhone}`)
      console.log(`Wiadomość: ${message}`)

      const result = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: formattedPhone,
      })

      console.log(`SMS wysłany pomyślnie. SID: ${result.sid}`)

      return {
        success: true,
        sid: result.sid,
        to: formattedPhone,
        message: "SMS wysłany pomyślnie",
      }
    } catch (error: any) {
      console.error("Błąd wysyłania SMS:", error)

      return {
        success: false,
        error: error.message,
        message: "Błąd wysyłania SMS",
      }
    }
  }

  static async sendBookingConfirmation(
    to: string,
    bookingDetails: {
      date: string
      time: string
      service: string
      confirmationId: string
    },
  ) {
    const message = `Potwierdzenie rezerwacji w EduHustawka:
📅 Data: ${bookingDetails.date}
🕐 Godzina: ${bookingDetails.time}
🎯 Usługa: ${bookingDetails.service}
📋 Nr rezerwacji: ${bookingDetails.confirmationId}

Dziękujemy za zaufanie!
Tel: ${process.env.TWILIO_PHONE_NUMBER}`

    return this.sendSMS({ to, message, type: "booking" })
  }

  static async sendReminder(
    to: string,
    reminderDetails: {
      date: string
      time: string
      service: string
    },
  ) {
    const message = `Przypomnienie o wizycie w EduHustawka:
📅 Jutro: ${reminderDetails.date}
🕐 Godzina: ${reminderDetails.time}
🎯 Usługa: ${reminderDetails.service}

Czekamy na Ciebie!
Adres: ul. Przykładowa 1, Warszawa`

    return this.sendSMS({ to, message, type: "reminder" })
  }
}
