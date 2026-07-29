import { useState } from "react";
import { useTranslation } from "react-i18next";

// Селектор сім'ї (пігулка + дропдаун перемикання) та вибір поточного
// учасника («Ви як»), як у дизайні.
export default function HouseholdBar({
  household,
  households = [],
  members = [],
  currentUserId,
  onSelectHousehold,
  onOpenCreate,
  onSelectMember,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  function pick(id) {
    setOpen(false);
    onSelectHousehold?.(id);
  }

  return (
    <section className="household-bar">
      <div className="household-bar__row">
        <span className="household-bar__label">{t("household.family")}</span>

        <div className="household-select">
          <button
            type="button"
            className="household-pill"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
          >
            <span className="household-pill__icon" aria-hidden="true">
              👥
            </span>
            <span className="household-pill__name">
              {household?.name} {household?.emoji}
            </span>
            <span className={`household-pill__chevron ${open ? "is-open" : ""}`} aria-hidden="true">
              ⌄
            </span>
          </button>

          {open && (
            <>
              <div className="household-dropdown__overlay" onClick={() => setOpen(false)} />
              <div className="household-dropdown" role="menu">
                {households.map((h) => {
                  const active = h.id === household?.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      className={`household-dropdown__item ${active ? "is-active" : ""}`}
                      onClick={() => pick(h.id)}
                      role="menuitemradio"
                      aria-checked={active}
                    >
                      <span className="household-dropdown__dot" aria-hidden="true" />
                      <span className="household-dropdown__name">
                        {h.name} {h.emoji}
                      </span>
                    </button>
                  );
                })}

                <div className="household-dropdown__sep" />

                <button
                  type="button"
                  className="household-dropdown__create"
                  onClick={() => {
                    setOpen(false);
                    onOpenCreate?.();
                  }}
                >
                  {t("household.create_or_join")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="household-bar__label household-bar__label--block">{t("household.you_as")}</p>
      <div className="member-grid">
        {members.map((m) => {
          const selected = m.userId === currentUserId;
          return (
            <button
              key={m.userId}
              type="button"
              className={`member-chip ${selected ? "member-chip--selected" : ""}`}
              onClick={() => onSelectMember?.(m.userId)}
              aria-pressed={selected}
            >
              <span className="member-chip__avatar" aria-hidden="true">
                {m.avatar}
              </span>
              <span className="member-chip__name">{m.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
