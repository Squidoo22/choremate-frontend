const REPLIES = {
  uk: {
    split:
      "Спробуйте поділити чесно: той, хто менше завантажений цього тижня, бере цю справу. А наступного разу — навпаки. Так навантаження вирівнюється без сварок.",
    credit:
      "Ідея Боргу Довіри: замість докору — приємний жест. Наприклад, «готує вечерю при свічках» або «робить каву в ліжко». Випишіть його у вкладці «Борг Довіри» — це весело й без образ.",
    talk:
      "Скажіть спокійно й без «ти завжди…». Наприклад: «Я помітив(-ла), що сміття не винесли. Можемо домовитись, хто це робить по днях?» Фокус на завданні, а не на звинуваченні.",
    distribute:
      "Справедливий розподіл: розділіть справи за днями й чергуйте важкі задачі (прибирання, закупи). Дрібні щоденні — по черзі.",
    default:
      "Я допоможу з побутом без сварок: справедливо розподілити справи, підказати ідею Боргу Довіри чи як спокійно про це поговорити. Що саме турбує?",
  },
  en: {
    split:
      "Try splitting it fairly: whoever is less loaded this week takes this chore. Next time — swap. That balances the load without arguments.",
    credit:
      "Trust Debt idea: instead of blame, a nice gesture — e.g. “cooks a candlelit dinner” or “brings coffee to bed”. Issue it in the “Trust Debt” tab — playful and blame-free.",
    talk:
      "Say it calmly, without “you always…”. For example: “I noticed the trash wasn't taken out. Can we agree who does it on which days?” Focus on the task, not the blame.",
    distribute:
      "Fair split: divide chores by day and rotate the tough ones (cleaning, groceries). Small daily tasks — take turns.",
    default:
      "I help keep the household calm: split chores fairly, suggest a Trust Debt idea, or how to talk about it without a fight. What's on your mind?",
  },
};

function classify(text) {
  const t = (text || "").toLowerCase();
  if (/суперечк|сварк|посуд|хто має|хто повинен|argu|quarrel|dish|who should/.test(t)) return "split";
  if (/борг|кредит|довір|жест|подарунок|загладити|debt|credit|trust|gesture|make up/.test(t)) return "credit";
  if (/сказати|поговорити|образ|докор|talk|say|communicat|remind/.test(t)) return "talk";
  if (/розподіл|навантаж|справедлив|distribut|workload|fair|balance/.test(t)) return "distribute";
  return "default";
}

function dataHint(intent, ctx, en) {
  if (!ctx) return "";
  const tasks = ctx.tasks || {};

  if (intent === "credit") {
    if (ctx.debts && ctx.debts.length) {
      const d = ctx.debts[0];
      return en
        ? `Right now ${d.debtor} owes ${d.creditor}: “${d.description}”.`
        : `Зараз активний борг: ${d.debtor} винен ${d.creditor} — «${d.description}».`;
    }
    return en
      ? "There are no active debts right now — you can issue one next time a task is missed."
      : "Активних боргів зараз немає — можете виписати новий, коли хтось прострочить задачу.";
  }

  if (intent === "split" || intent === "distribute") {
    const done = tasks.doneByName || {};
    const names = (ctx.members || []).map((m) => m.name);
    if (names.length > 1) {
      const sorted = [...names].sort((a, b) => (done[b] || 0) - (done[a] || 0));
      const top = sorted[0];
      const low = sorted[sorted.length - 1];
      return en
        ? `In your household ${top} has done the most lately and ${low} the least — start by shifting a task to ${low}.`
        : `У вашій сім'ї найбільше зробив ${top}, найменше — ${low}. Почніть із того, щоб передати справу ${low}.`;
    }
  }

  if (intent === "default") {
    return en
      ? `Right now: ${tasks.active || 0} active tasks, ${tasks.overdue || 0} overdue.`
      : `Зараз: ${tasks.active || 0} активних задач, ${tasks.overdue || 0} прострочених.`;
  }

  return "";
}

export function mockAssistantReply(messages, lang, context) {
  const en = lang?.startsWith("en");
  const dict = REPLIES[en ? "en" : "uk"];
  const last = messages[messages.length - 1]?.content || "";
  const intent = classify(last);
  const hint = dataHint(intent, context, en);
  const text = hint ? `${dict[intent]} ${hint}` : dict[intent];
  return new Promise((resolve) => setTimeout(() => resolve({ text }), 500));
}
