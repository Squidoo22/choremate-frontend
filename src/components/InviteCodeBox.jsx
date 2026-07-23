import { useState } from "react";

export default function InviteCodeBox({ inviteLink }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="invite-code-box">
      <p>Запросіть партнера цим посиланням:</p>
      <div className="invite-link-row">
        <code>{inviteLink}</code>
        <button onClick={handleCopy}>{copied ? "Скопійовано ✓" : "Копіювати посилання"}</button>
      </div>
    </div>
  );
}
