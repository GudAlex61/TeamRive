const submissionTimes = new Map<string, number[]>()
const emailSubmissions = new Map<string, number[]>()

export async function POST(request: Request) {
  try {
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const now = Date.now()

    const formData = await request.json()
    const userEmail = formData.email?.toLowerCase().trim()

    // Rate limiting: max 3 submissions per hour per IP
    const userSubmissions = submissionTimes.get(clientIP) || []
    const recentSubmissions = userSubmissions.filter((time) => now - time < 60 * 60 * 1000) // 1 hour

    if (recentSubmissions.length >= 3) {
      return Response.json(
        {
          error: "Превышен лимит заявок",
          message:
            "С вашего IP-адреса было отправлено максимальное количество заявок (3 в час). Это сделано для защиты от спама. Наш менеджер обязательно свяжется с вами по уже отправленным заявкам. Если у вас срочный вопрос, попробуйте позже или свяжитесь с нами по телефону.",
        },
        { status: 429 },
      )
    }

    if (userEmail) {
      const emailSubmissionTimes = emailSubmissions.get(userEmail) || []
      const recentEmailSubmissions = emailSubmissionTimes.filter((time) => now - time < 30 * 60 * 1000) // 30 minutes

      if (recentEmailSubmissions.length >= 2) {
        return Response.json(
          {
            error: "Заявка уже принята",
            message:
              "Вы уже отправляли заявку с этого email адреса в течение последних 30 минут. Ваша заявка принята и находится в обработке. Наш менеджер обязательно свяжется с вами в ближайшее время для уточнения всех деталей бронирования.",
          },
          { status: 429 },
        )
      }

      const veryRecentSubmissions = emailSubmissionTimes.filter((time) => now - time < 5 * 60 * 1000) // 5 minutes
      if (veryRecentSubmissions.length >= 1) {
        return Response.json(
          {
            error: "Заявка уже отправлена",
            message:
              "Ваша заявка была успешно отправлена менее 5 минут назад и уже обрабатывается. Повторная отправка не требуется. Наш менеджер свяжется с вами в течение рабочего дня для подтверждения всех деталей.",
          },
          { status: 429 },
        )
      }

      // Update email submission times
      recentEmailSubmissions.push(now)
      emailSubmissions.set(userEmail, recentEmailSubmissions)
    }

    // Update IP submission times
    recentSubmissions.push(now)
    submissionTimes.set(clientIP, recentSubmissions)

    console.log("[v0] Received form data:", formData)

    const sheetsData = {
      name: formData.name || "",
      email: formData.email || "",
      phone: formData.phone || "",
      base: formData.base || "",
      dates: formData.dates || "",
      participants: formData.participants || "",
      sport: formData.sport || "",
      additional: formData.message || formData.additional || "", // Handle both field names
    }

    console.log("[v0] Sending to Google Sheets:", sheetsData)

    const webhookUrl =
      "https://script.google.com/macros/s/AKfycbw-sQhQEMZwmZhZsOXbV0ToYMXzaTIzqEzIqHHWR69Z7QJe9wO2ymAE48zbx3wuO-1s/exec"

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; TeamRive/1.0)",
      },
      body: JSON.stringify(sheetsData),
      redirect: "follow",
      mode: "cors",
    })

    console.log("[v0] Google Sheets response status:", response.status)
    console.log("[v0] Google Sheets response headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("[v0] Google Sheets response body:", responseText)

    if (response.status === 302 || response.status === 301) {
      console.log("[v0] Received redirect from Google Apps Script, treating as success")
      return Response.json({ success: true })
    }

    if (response.status >= 200 && response.status < 400) {
      try {
        const responseData = JSON.parse(responseText)
        if (responseData.success !== false) {
          return Response.json({ success: true })
        }
      } catch (parseError) {
        if (response.ok) {
          if (responseText.includes("Moved Temporarily") || responseText.includes("redirect")) {
            console.log("[v0] HTML redirect response detected, treating as success")
            return Response.json({ success: true })
          }
          return Response.json({ success: true })
        }
      }
    }

    throw new Error(`Google Sheets responded with status ${response.status}: ${responseText}`)
  } catch (error) {
    console.error("[v0] Error saving booking:", error)
    return Response.json(
      {
        error: "Failed to save booking",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
