// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const body = await req.json()

    const prompt = body.prompt || ""
    const messages = body.messages || []

    const apiKey = Deno.env.get("GROQ_API_KEY")

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is missing")
    }

    const fullMessages =
      messages.length > 0 &&
      messages[messages.length - 1]?.role === "user"
        ? messages
        : [...messages, { role: "user", content: prompt }]

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Ты — Askyinde AI Assistant. Твоя экспертиза ограничена только авиацией. Ты отвечаешь на вопросы о рейсах, типах самолетов, правилах провоза багажа и истории авиации. Если пользователь спрашивает о чем угодно другом, вежливо ответь: Извините, я специализируюсь только на авиационной тематике.",
            },
            ...fullMessages,
          ],
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API error")
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "Нет ответа от модели"

    let title = null

    if (messages.length === 0) {
      const titleRes = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              {
                role: "user",
                content: `Придумай краткий заголовок темы (7-12 слов): ${prompt}`,
              },
            ],
          }),
        }
      )

      const titleData = await titleRes.json()

      title =
        titleData.choices?.[0]?.message?.content || "New Chat"
    }

    return new Response(
      JSON.stringify({ reply, title }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})