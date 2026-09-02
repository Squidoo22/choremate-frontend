import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check } from "lucide-react";

export default function InviteCodeBox({ inviteLink }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-stone-500">{t("onboarding.invite_hint")}</p>
      <div className="flex items-center gap-2 rounded-xl border border-solid border-stone-200 bg-stone-50 p-2">
        <code className="flex-1 min-w-0 truncate text-xs text-stone-700 px-1">{inviteLink}</code>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? t("onboarding.copied") : t("onboarding.copy")}
        </button>
      </div>
    </div>
  );
}
