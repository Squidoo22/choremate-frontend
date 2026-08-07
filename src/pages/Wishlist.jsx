import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Plus, CheckCircle2, Gift, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useHousehold } from "../context/HouseholdContext";
import {
  listWishlist,
  createWishlistItem,
  toggleWishlistItem,
} from "../api/wishlist";

export default function Wishlist() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { householdId, members } = useHousehold();
  const currentMemberId = user?.id || members[0]?.userId || "";

  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(20);

  async function load() {
    if (!householdId) return;
    const { data } = await listWishlist(householdId);
    setItems(data);
  }

  useEffect(() => {
    load();
  }, [householdId]);

  const creatorOf = (id) => members.find((m) => m.userId === id);

  async function handleToggle(item) {
    await toggleWishlistItem(item.id);
    load();
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await createWishlistItem(householdId, {
      title: title.trim(),
      description: description.trim(),
      creatorId: currentMemberId,
      points: Number(points) || 20,
    });
    setShowModal(false);
    setTitle("");
    setDescription("");
    setPoints(20);
    load();
  }

  return (
    <div className="max-w-4xl w-full mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Gift className="w-3.5 h-3.5" />
            <span>{t("wishlist_page.badge")}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{t("wishlist_page.title")}</h2>
          <p className="text-xs text-rose-100 max-w-lg">{t("wishlist_page.desc")}</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-white text-rose-700 font-bold text-xs rounded-xl shadow-xs hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t("wishlist_page.add")}</span>
        </button>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const creator = creatorOf(item.creatorId);
            const isCompleted = item.status === "DONE";
            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-4 shadow-xs transition-all flex flex-col justify-between ${
                  isCompleted
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-rose-200 hover:border-rose-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>Wishlist</span>
                    </span>

                    <button
                      onClick={() => handleToggle(item)}
                      className="text-stone-400 hover:text-emerald-600 transition-colors bg-transparent p-0"
                      title={isCompleted ? t("wishlist_page.mark_undone") : t("wishlist_page.mark_done")}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-stone-300 hover:text-emerald-500" />
                      )}
                    </button>
                  </div>

                  <h3
                    className={`text-base font-bold text-stone-900 ${
                      isCompleted ? "line-through text-stone-400" : ""
                    }`}
                  >
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2 text-xs text-stone-500">
                  <div className="flex items-center gap-1">
                    <span>{t("wishlist_page.added_by")}</span>
                    <span className="font-semibold text-stone-800">
                      {creator?.avatar} {creator?.name}
                    </span>
                  </div>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 whitespace-nowrap">
                    {t("wishlist_page.points", { pts: item.points })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-stone-200 rounded-3xl p-12 text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <h3 className="text-base font-bold text-stone-900">{t("wishlist_page.empty_title")}</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            {t("wishlist_page.empty_sub")}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-2xs"
          >
            {t("wishlist_page.empty_cta")}
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-stone-200 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Gift className="w-5 h-5 text-rose-600" />
                <span>{t("wishlist_page.modal_title")}</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-stone-400 hover:text-stone-700 bg-transparent p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t("wishlist_page.field_title")}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("wishlist_page.title_placeholder")}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t("wishlist_page.field_desc")}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("wishlist_page.desc_placeholder")}
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t("wishlist_page.field_points")}
                </label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  step="5"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-28 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-400"
                />
              </div>

              <div className="pt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-medium"
                >
                  {t("wishlist_page.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-2xs disabled:opacity-50"
                >
                  {t("wishlist_page.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
