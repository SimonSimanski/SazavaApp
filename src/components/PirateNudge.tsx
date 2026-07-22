"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import PirateAvatar from "@/components/PirateAvatar";
import { getPushState, enablePush } from "@/utils/pushClient";

const SNOOZE_KEY = "pirateNudgeSnoozeUntil";
const SNOOZE_MS = 1000 * 60 * 60 * 24 * 3; // 3 dny

// Stránky, kde piráta nechceme
const HIDE_ON = ["/login", "/register", "/settings"];

export default function PirateNudge() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (HIDE_ON.includes(pathname)) {
      setVisible(false);
      return;
    }

    // Odloženo?
    try {
      const until = Number(localStorage.getItem(SNOOZE_KEY) || 0);
      if (Date.now() < until) return;
    } catch {
      /* localStorage nedostupné – ignorovat */
    }

    getPushState()
      .then((state) => {
        // Ukázat jen když opravdu jde zapnout (SW je, není blokováno, ještě neodebírá)
        if (state === "off") {
          setTimeout(() => setVisible(true), 800);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const snooze = () => {
    try {
      localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const handleEnable = async () => {
    setBusy(true);
    try {
      await enablePush();
    } catch (e) {
      console.error("Zapnutí notifikací z piráta selhalo", e);
    } finally {
      setBusy(false);
      snooze(); // ať už se povedlo nebo ne, dál neotravovat
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-2 z-40 flex items-end gap-0 max-w-[340px] animate-in slide-in-from-left-16 fade-in duration-500">
      {/* Pirát vykukující ze strany */}
      <PirateAvatar className="shrink-0 -mr-2" />

      {/* Bublina */}
      <div className="relative bg-surface-container-high wood-texture border-4 border-on-surface rounded-2xl rounded-bl-none p-3 pr-8 hard-shadow rotate-[-1deg]">
        <button
          onClick={snooze}
          aria-label="Zavřít"
          className="absolute top-1 right-1 p-1 rounded-full bg-surface border-2 border-on-surface hover:bg-surface-dim"
        >
          <X className="w-3.5 h-3.5 text-on-surface" />
        </button>
        <p className="font-body-md text-sm text-on-surface leading-snug">
          Arr, námořníku! 🏴‍☠️ Zapni si <b>zvonec</b>, ať ti neujde žádná <b>Velká akce</b> na palubě!
        </p>
        <button
          onClick={handleEnable}
          disabled={busy}
          className="mt-2 w-full bg-tertiary-fixed text-on-surface font-label-mono text-label-mono uppercase py-2 px-3 rounded-lg border-2 border-on-surface hard-shadow active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-60"
        >
          {busy ? "Zapínám…" : "Zapnout, arr!"}
        </button>
      </div>
    </div>
  );
}
