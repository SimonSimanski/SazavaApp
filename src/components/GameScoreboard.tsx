import { Trophy, Crown } from "lucide-react";

export interface GameScoreItem {
  rank: number;
  username: string;
  initials: string;
  score: number;
  isCurrentUser: boolean;
}

interface GameScoreboardProps {
  items: GameScoreItem[];
}

export default function GameScoreboard({ items }: GameScoreboardProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 px-2">
        <Trophy className="w-6 h-6" />
        Síň slávy – Chytej bobky
      </h3>

      {items.length === 0 ? (
        <div className="bg-surface-container border-2 border-dashed border-outline-variant rounded-lg p-4 text-center font-body-md text-body-md text-on-surface-variant">
          Zatím nikdo nehrál. Buď první pirát! 🏴‍☠️
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const highlight = item.isCurrentUser;
            const isFirst = item.rank === 1;
            return (
              <div
                key={item.username + item.rank}
                className={`rounded-lg p-3 flex items-center justify-between relative border-2 ${
                  highlight
                    ? "bg-primary-container border-primary shadow-[3px_3px_0px_0px_rgba(23,53,20,1)]"
                    : isFirst
                    ? "wood-plank border-on-secondary-container shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]"
                    : "bg-surface-container border-outline shadow-[2px_2px_0px_0px_rgba(115,121,111,0.5)]"
                }`}
                style={{ transform: `rotate(${item.rank % 2 === 0 ? -0.4 : 0.4}deg)` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-headline-sm text-headline-sm border-2 ${
                      isFirst
                        ? "bg-tertiary-container text-on-tertiary-container border-on-secondary-container"
                        : "bg-surface-variant text-on-surface-variant border-outline"
                    }`}
                  >
                    {isFirst ? <Crown className="w-5 h-5" fill="currentColor" /> : item.rank}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center font-body-md text-body-md text-on-primary-container shadow-inner">
                      {item.initials}
                    </div>
                    <span
                      className={`font-body-md text-body-md ${
                        highlight ? "text-on-primary-container font-bold" : "text-on-surface"
                      }`}
                    >
                      {highlight ? "Ty (Já)" : item.username}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 font-headline-sm text-headline-sm ${
                    highlight ? "text-on-primary-container font-bold" : "text-on-surface"
                  }`}
                >
                  {item.score} 💩
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
