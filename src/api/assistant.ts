import { USE_MOCKS } from "../config";
import { mockAssistantReply } from "../mocks/assistant";

export async function sendAssistantMessage(messages, lang, context) {
  if (USE_MOCKS) {
    return mockAssistantReply(messages, lang, context);
  }
  // Реальний Claude через serverless-функцію; якщо вона недоступна
  // (немає ANTHROPIC_API_KEY на сервері, помилка, офлайн) — тихо падаємо на мок,
  // щоб застосунок працював навіть без ключа.
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, lang, context }),
    });
    if (!res.ok) throw new Error("assistant_unavailable");
    const data = await res.json();
    if (!data || !data.text) throw new Error("assistant_empty");
    return data;
  } catch {
    return mockAssistantReply(messages, lang, context);
  }
}
