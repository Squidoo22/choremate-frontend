import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = `You are ChoreMate's "Harmony Assistant" — an assistant for couples, roommates and families sharing household chores without conflict.

Scope strictly to: organizing household chores, fairly splitting the workload, the app's "Trust Credit" feature (a light, playful gesture — cooking dinner, making coffee in bed, picking the movie — instead of blame for a missed task), gamification (points, streaks), and calm, blame-free communication about chores.

Style: warm, concise, practical. Give concrete suggestions — fair splits, Trust Credit ideas, and gentle phrasings. When the current household state is provided below, use it to give specific, personalized advice (name the least-loaded member, the person who owes a credit, etc.). Keep replies short (a few sentences).

You are NOT a therapist or a medical professional. If the user raises a serious relationship, mental-health or safety issue, briefly and kindly suggest they seek professional help, and don't try to counsel them yourself.

Always reply in the user's language (Ukrainian or English), matching the language of their message.`;

function contextBlock(ctx) {
  if (!ctx) return "";
  const members = (ctx.members || [])
    .map((m) => `${m.name} (${m.points} pts, ${m.streak}-day streak)`)
    .join(", ");
  const t = ctx.tasks || {};
  const assigned = Object.entries(t.assignedByName || {})
    .map(([n, c]) => `${n}: ${c}`)
    .join(", ");
  const debts = (ctx.debts || [])
    .map((d) => `${d.debtor} owes ${d.creditor} — "${d.description}"`)
    .join("; ");
  return `

Current household state (use it for specific, personalized advice):
- Household: ${ctx.household || "?"}. You are helping ${ctx.me || "the user"}.
- Members: ${members || "?"}.
- Tasks: ${t.active ?? "?"} active, ${t.overdue ?? "?"} overdue, ${t.done ?? "?"} done. Assigned per member: ${assigned || "none"}.
- Active Trust Credits: ${debts || "none"}.`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "missing_api_key" });
  }

  try {
    const { messages = [], context = null } = req.body || {};
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: SYSTEM + contextBlock(context),
      messages: messages
        .filter((m) => m && m.content)
        .map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content),
        })),
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({ error: "assistant_error", detail: String(err?.message || err) });
  }
}
