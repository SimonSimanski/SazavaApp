"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import PirateAvatar from "@/components/PirateAvatar";

interface FartFactPirateProps {
  fact: string;
  onClose: () => void;
}

// Pirát vykoukne z pravé strany a vyhrkne náhodný fakt o prdech.
// Sám po pár vteřinách zmizí, ať nepřekáží.
export default function FartFactPirate({ fact, onClose }: FartFactPirateProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, [fact, onClose]);

  return (
    <div className="fixed bottom-24 right-2 z-40 flex flex-row-reverse items-end max-w-[340px] animate-in slide-in-from-right-16 fade-in duration-500 pointer-events-none">
      {/* Pirát vykukující zprava (zrcadlově, ať kouká na bublinu) */}
      <PirateAvatar flip className="shrink-0 -ml-2 pointer-events-auto" />

      {/* Bublina */}
      <div className="relative bg-surface-container-high wood-texture border-4 border-on-surface rounded-2xl rounded-br-none p-3 pl-8 hard-shadow rotate-[1deg] pointer-events-auto">
        <button
          onClick={onClose}
          aria-label="Zavřít"
          className="absolute top-1 left-1 p-1 rounded-full bg-surface border-2 border-on-surface hover:bg-surface-dim"
        >
          <X className="w-3.5 h-3.5 text-on-surface" />
        </button>
        <p className="font-label-mono text-[10px] uppercase text-on-surface-variant mb-1 tracking-wider">
          Věděl jsi, že… 🏴‍☠️
        </p>
        <p className="font-body-md text-sm text-on-surface leading-snug">{fact}</p>
      </div>
    </div>
  );
}
