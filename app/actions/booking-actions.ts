"use server"

import { SMSService } from "@/lib/sms-service"

export async function createBooking(formData: FormData) {
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const service = formData.get("service") as string
  const notes = formData.get("notes") as string

  try {
    // Generuj ID rezerwacji
    const confirmationId = `EDU${Date.now().toString().slice(-6)}`

    // Wyślij SMS potwierdzający
    const smsResult = await SMSService.sendBookingConfirmation(phone, {
      date,
      time,
      service,
      confirmationId,
    })

    if (!smsResult.success) {
      console.error("Błąd wysyłania SMS:", smsResult.error)
    }

    // Tutaj możesz dodać zapis do bazy danych
    console.log("Nowa rezerwacja:", {
      name,
      phone,
      email,
      date,
      time,
      service,
      notes,
      confirmationId,
      smsStatus: smsResult.success ? "sent" : "failed",
    })

    return {
      success: true,
      message: "Rezerwacja została utworzona pomyślnie!",
      confirmationId,
      smsStatus: smsResult.success,
    }
  } catch (error: any) {
    console.error("Błąd tworzenia rezerwacji:", error)
    return {
      success: false,
      message: "Wystąpił błąd podczas tworzenia rezerwacji",
    }
  }
}

export async function sendTestSMS(phone: string, message: string) {
  try {
    const result = await SMSService.sendSMS({ to: phone, message, type: "general" })
    return result
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
