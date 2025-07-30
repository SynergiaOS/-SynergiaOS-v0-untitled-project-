"use server"

import { SMSService } from "@/lib/sms-service"

export interface BookingData {
  name: string
  email: string
  phone: string
  date: string
  time: string
  service: string
  message?: string
}

export async function submitBooking(data: BookingData) {
  try {
    // Here you would typically save to database
    console.log("Booking submitted:", data)

    // Send SMS confirmation
    const smsResult = await SMSService.sendSMS({
      to: data.phone,
      message: SMSService.createBookingConfirmation(data.name, data.date, data.time),
      type: "booking",
    })

    if (smsResult.success) {
      return {
        success: true,
        message: "Rezerwacja została potwierdzona. SMS wysłany.",
        smsId: smsResult.messageId,
      }
    } else {
      return {
        success: true,
        message: "Rezerwacja została potwierdzona, ale SMS nie został wysłany.",
        warning: smsResult.error,
      }
    }
  } catch (error) {
    console.error("Booking error:", error)
    return {
      success: false,
      message: "Wystąpił błąd podczas rezerwacji. Spróbuj ponownie.",
    }
  }
}

export async function sendBookingReminder(data: BookingData) {
  try {
    const smsResult = await SMSService.sendSMS({
      to: data.phone,
      message: SMSService.createBookingReminder(data.name, data.date, data.time),
      type: "reminder",
    })

    return {
      success: smsResult.success,
      message: smsResult.success ? "Przypomnienie wysłane" : "Błąd wysyłania przypomnienia",
      error: smsResult.error,
    }
  } catch (error) {
    console.error("Reminder error:", error)
    return {
      success: false,
      message: "Błąd wysyłania przypomnienia",
    }
  }
}
