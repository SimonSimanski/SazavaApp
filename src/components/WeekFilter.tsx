"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function WeekFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const week = searchParams.get("week") || "all";

  const setFilter = (val: string) => {
    router.push(`/scoreboard?week=${val}`);
  };

  return (
    <div className="flex bg-surface-container-high rounded-xl p-1 border-2 border-outline mx-auto w-fit shadow-[2px_2px_0px_0px_rgba(115,121,111,0.5)] mb-4 rotate-[-1deg]">
      <button
        onClick={() => setFilter("1")}
        className={`px-4 py-2 font-label-mono text-[14px] uppercase rounded-lg transition-colors ${
          week === "1" ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-dim"
        }`}
      >
        Týden 1
      </button>
      <button
        onClick={() => setFilter("2")}
        className={`px-4 py-2 font-label-mono text-[14px] uppercase rounded-lg transition-colors ${
          week === "2" ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-dim"
        }`}
      >
        Týden 2
      </button>
      <button
        onClick={() => setFilter("all")}
        className={`px-4 py-2 font-label-mono text-[14px] uppercase rounded-lg transition-colors ${
          week === "all" ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-dim"
        }`}
      >
        Vše
      </button>
    </div>
  );
}
