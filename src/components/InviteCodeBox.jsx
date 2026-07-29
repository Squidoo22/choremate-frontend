import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function InviteCodeBox({ inviteLink }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="invite-code-box">
      <p>{t("onboarding.invite_hint")}</p>
      <div className="invite-link-row">
        <code>{inviteLink}</code>
        <button onClick={handleCopy}>{copied ? t("onboarding.copied") : t("onboarding.copy")}</button>
      </div>
    </div>
  );
}
