"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
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
      <div className="shrink-0 -mr-2 pirate-bob" style={{ filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.35))" }}>
        <svg width="72" height="96" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* krk/rameno */}
          <rect x="24" y="78" width="26" height="18" rx="6" fill="#8a5a2b" />
          {/* obličej */}
          <circle cx="37" cy="50" r="26" fill="#f2c79a" stroke="#3a2c1a" strokeWidth="2.5" />
          {/* vousy */}
          <path d="M14 52 a23 23 0 0 0 46 0 v6 a23 23 0 0 1 -46 0 z" fill="#4a3524" opacity="0.85" />
          {/* šátek */}
          <path d="M9 34 q28 -22 56 0 q-28 -10 -56 0 z" fill="#c1121f" stroke="#3a2c1a" strokeWidth="2.5" />
          <path d="M9 34 q28 -14 56 0 l0 5 q-28 -12 -56 0 z" fill="#e63946" />
          {/* uzel + cípy šátku vlevo */}
          <circle cx="10" cy="36" r="5" fill="#c1121f" stroke="#3a2c1a" strokeWidth="2" />
          <path d="M6 38 l-6 10 l7 -3 z" fill="#c1121f" stroke="#3a2c1a" strokeWidth="1.5" />
          <path d="M8 40 l-3 12 l6 -5 z" fill="#e63946" stroke="#3a2c1a" strokeWidth="1.5" />
          {/* puntíky na šátku */}
          <circle cx="30" cy="27" r="2" fill="#fff" opacity="0.85" />
          <circle cx="44" cy="25" r="2" fill="#fff" opacity="0.85" />
          <circle cx="52" cy="30" r="1.6" fill="#fff" opacity="0.85" />
          {/* obočí */}
          <path d="M40 42 q7 -4 13 1" stroke="#3a2c1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* zdravé oko */}
          <circle cx="46" cy="49" r="4.5" fill="#fff" stroke="#3a2c1a" strokeWidth="1.5" />
          <circle cx="47" cy="49" r="2.2" fill="#2b2b2b" />
          {/* páska přes oko */}
          <path d="M20 40 l40 12" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="28" cy="48" rx="7" ry="8" fill="#1a1a1a" />
          {/* úsměv se zubem */}
          <path d="M30 62 q9 9 20 2" stroke="#3a2c1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="36" y="63" width="4" height="4" rx="1" fill="#fff" stroke="#3a2c1a" strokeWidth="1" />
          {/* náušnice */}
          <circle cx="61" cy="58" r="3.5" fill="none" stroke="#f4c430" strokeWidth="2.5" />
        </svg>
      </div>

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

      <style>{`
        @keyframes pirateBob {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-4px) rotate(1deg); }
        }
        .pirate-bob { animation: pirateBob 2.8s ease-in-out infinite; transform-origin: bottom center; }
      `}</style>
    </div>
  );
}
