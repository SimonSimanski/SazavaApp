"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ScoreboardRow } from "@/components/ScoreboardList";
import type { ScoreboardItem } from "@/components/ScoreboardList";

interface ShowAllScoreboardProps {
  restItems: ScoreboardItem[];
}

export default function ShowAllScoreboard({ restItems }: ShowAllScoreboardProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (restItems.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="mx-auto flex items-center gap-2 px-4 py-2 font-label-mono text-[14px] uppercase rounded-lg bg-surface-container-high border-2 border-outline shadow-[2px_2px_0px_0px_rgba(115,121,111,0.5)] text-on-surface hover:bg-surface-dim transition-colors"
      >
        {isOpen ? "Skrýt zbytek pirátů" : `Zobrazit zbytek pirátů (${restItems.length})`}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3">
          {restItems.map((item) => (
            <ScoreboardRow key={item.username} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
