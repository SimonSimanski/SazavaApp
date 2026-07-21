import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import GameClient from "@/components/GameClient";
import GameScoreboard, { GameScoreItem } from "@/components/GameScoreboard";

export const revalidate = 0; // vždy čerstvá data

export default async function GamePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Načíst všechna skóre + profily (tabulka game_scores nemusí ještě existovat)
  const [scoresRes, profilesRes] = await Promise.all([
    supabase.from("game_scores").select("user_id, score"),
    supabase.from("profiles").select("id, username"),
  ]);

  const dbReady = !scoresRes.error;
  const scores = scoresRes.data || [];
  const profiles = profilesRes.data || [];

  // Nejlepší skóre na uživatele
  const bestByUser: Record<string, number> = {};
  for (const s of scores) {
    if (!bestByUser[s.user_id] || s.score > bestByUser[s.user_id]) {
      bestByUser[s.user_id] = s.score;
    }
  }

  const nameById: Record<string, string> = {};
  for (const p of profiles) {
    nameById[p.id] = p.username || "Neznámý Pirát";
  }

  const items: GameScoreItem[] = Object.entries(bestByUser)
    .map(([userId, score]) => {
      const name = nameById[userId] || "Neznámý Pirát";
      return {
        rank: 0,
        username: name,
        initials: name.substring(0, 2).toUpperCase(),
        score,
        isCurrentUser: userId === user.id,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  const myBest = bestByUser[user.id] || 0;

  return (
    <main className="flex flex-col gap-6 mb-24">
      <div className="text-center mt-4 paper-card p-4 rounded-xl -rotate-1 mx-2">
        <h2 className="font-display-lg text-display-lg text-on-surface burned-text flex items-center justify-center gap-2">
          <Gamepad2 className="w-8 h-8 text-tertiary-container" />
          Chytej bobky
          <Gamepad2 className="w-8 h-8 text-tertiary-container" />
        </h2>
        <p className="font-label-mono text-label-mono text-outline mt-2">
          MINIHRA MIMO PRDNÍK
        </p>
      </div>

      <GameClient initialBest={myBest} dbReady={dbReady} />

      <GameScoreboard items={items} />
    </main>
  );
}
