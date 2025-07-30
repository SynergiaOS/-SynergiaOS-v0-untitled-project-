"use server"

import { SMSService } from "@/lib/sms-service"

export interface BookingData {
  clientName: string
  phone: string
  email: string
  date: string
  time: string
  service: string
  notes?: string
}

export async function createBooking(data: BookingData) {
  try {
    // Here you would typically save to database
    // For now, we'll just send SMS confirmation

    const smsResult = await SMSService.sendSMS({
      to: data.phone,
      message: SMSService.createBookingConfirmation(data.clientName, data.date, data.time),
      type: "booking",
    })

    if (smsResult.success) {
      return {
        success: true,
        message: "Rezerwacja została potwierdzona. SMS wysłany.",
        bookingId: `BOOK-${Date.now()}`,
        smsId: smsResult.messageId,
      }
    } else {
      return {
        success: false,
        message: "Rezerwacja zapisana, ale SMS nie został wysłany.",
        error: smsResult.error,
      }
    }
  } catch (error) {
    console.error("Booking creation error:", error)
    return {
      success: false,
      message: "Wystąpił błąd podczas tworzenia rezerwacji.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function sendBookingReminder(data: BookingData) {
  try {
    const smsResult = await SMSService.sendSMS({
      to: data.phone,
      message: SMSService.createBookingReminder(data.clientName, data.date, data.time),
      type: "reminder",
    })

    return {
      success: smsResult.success,
      message: smsResult.success ? "Przypomnienie wysłane pomyślnie" : "Błąd wysyłania przypomnienia",
      error: smsResult.error,
    }
  } catch (error) {
    console.error("Reminder sending error:", error)
    return {
      success: false,
      message: "Wystąpił błąd podczas wysyłania przypomnienia.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
