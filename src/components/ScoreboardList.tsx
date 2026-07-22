import { Wind, ListOrdered, Biohazard } from "lucide-react";

export interface ScoreboardItem {
  rank: number;
  username: string;
  count: number;
  todayCount: number;
  isCurrentUser: boolean;
  initials: string;
  _userId?: string;
  isOverloaded?: boolean;
}

interface ScoreboardListProps {
  items: ScoreboardItem[];
}

// Zobrazení počtu prdů s easter eggy:
//  - 69  → cedulka "Nice"
//  - 420 → z čísla se kouří
function FartCountValue({ count }: { count: number }) {
  if (count === 69) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="font-label-mono text-[9px] leading-none uppercase bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-1 rounded-full border-2 border-on-surface shadow-[1px_1px_0px_0px_rgba(50,18,0,1)] -rotate-6 whitespace-nowrap">
          Nice
        </span>
        <span>{count}</span>
      </span>
    );
  }

  if (count === 420) {
    return (
      <span className="relative inline-block leading-none">
        <span className="fart-smoke-puff" style={{ left: "25%", animationDelay: "0s" }} aria-hidden="true" />
        <span className="fart-smoke-puff" style={{ left: "50%", animationDelay: "0.8s" }} aria-hidden="true" />
        <span className="fart-smoke-puff" style={{ left: "72%", animationDelay: "1.4s" }} aria-hidden="true" />
        {count}
      </span>
    );
  }

  return <>{count}</>;
}

// Dnešní počet v závorce – dědí barvu textu řádku (funguje na světlém i tmavém pozadí)
function TodayBadge({ count }: { count: number }) {
  return (
    <span className="font-label-mono text-[11px] opacity-60 ml-0.5" title="Dnes">
      ({count})
    </span>
  );
}

// Výchozí řádek (styl pro rank 4+), znovupoužitý i pro rozbalený seznam zbylých pirátů
export function ScoreboardRow({ item }: { item: ScoreboardItem }) {
  return (
    <div className="bg-surface-container border-2 border-dashed border-outline-variant shadow-[2px_2px_0px_0px_rgba(115,121,111,0.5)] rounded-lg p-3 flex items-center justify-between relative z-0" style={{ transform: "rotate(-0.2deg)" }}>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 flex items-center justify-center font-body-md text-body-md text-outline">
          {item.rank}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center font-body-md text-body-md text-on-primary-container shadow-inner">
            {item.initials}
          </div>
          <span className="font-body-md text-body-md text-on-surface">{item.username}</span>
          {item.isOverloaded && <span title="Tenhle pirát to přehání! (>34 prdů/den)"><Biohazard className="w-4 h-4 text-error animate-pulse" /></span>}
        </div>
      </div>
      <div className="flex items-center gap-1 font-body-md text-body-md text-on-surface">
        <FartCountValue count={item.count} /> <Wind className="w-4 h-4" /> <TodayBadge count={item.todayCount} />
      </div>
    </div>
  );
}

export default function ScoreboardList({ items }: ScoreboardListProps) {
  return (
    <section className="flex flex-col gap-stack-gap">
      <div className="flex items-end justify-between gap-2 px-2">
        <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
          <ListOrdered className="w-6 h-6" />
          Tabulka Prdů
        </h3>
        <span className="font-label-mono text-[11px] text-on-surface-variant text-right leading-tight shrink-0 pb-1">
          celkem <span className="opacity-60">(dnes)</span>
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          if (item.isCurrentUser) {
            // Rank Current User (Highlighted)
            return (
              <div key={item.username} className="bg-primary-container border-2 border-primary shadow-[3px_3px_0px_0px_rgba(23,53,20,1)] rounded-lg p-3 flex items-center justify-between relative z-0" style={{ transform: "rotate(0.2deg)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center font-body-md text-body-md text-on-primary-container">
                    {item.rank}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-body-md text-body-md text-on-primary-fixed shadow-inner">
                      {item.initials}
                    </div>
                    <span className="font-body-md text-body-md text-on-primary-container font-bold">Ty (Já)</span>
                    {item.isOverloaded && <span title="Tenhle pirát to přehání! (>34 prdů/den)"><Biohazard className="w-5 h-5 text-error animate-pulse" /></span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-body-md text-body-md text-on-primary-container font-bold">
                  <FartCountValue count={item.count} /> <Wind className="w-4 h-4" /> <TodayBadge count={item.todayCount} />
                </div>
              </div>
            );
          }

          if (item.rank === 1) {
            // Rank 1
            return (
              <div key={item.username} className="wood-plank rounded-lg p-3 flex items-center justify-between relative z-10 hover:rotate-0 transition-transform duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-tertiary-container rounded-full flex items-center justify-center font-headline-md text-headline-md text-on-tertiary-container border-2 border-on-secondary-container shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                    1
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-headline-sm text-headline-sm text-on-primary shadow-inner">
                      {item.initials}
                    </div>
                    <span className="font-body-lg text-body-lg font-bold">{item.username}</span>
                    {item.isOverloaded && <span title="Tenhle pirát to přehání! (>34 prdů/den)"><Biohazard className="w-5 h-5 text-error animate-pulse" /></span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-headline-sm text-headline-sm text-tertiary-container">
                  <FartCountValue count={item.count} /> <Wind className="w-5 h-5" /> <TodayBadge count={item.todayCount} />
                </div>
              </div>
            );
          }

          if (item.rank === 2) {
            // Rank 2
            return (
              <div key={item.username} className="bg-surface-container-high border-2 border-outline shadow-[3px_3px_0px_0px_rgba(115,121,111,1)] rounded-lg p-3 flex items-center justify-between relative z-0 hover:rotate-1 transition-transform duration-200" style={{ transform: "rotate(-0.5deg)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center font-headline-sm text-headline-sm text-on-surface-variant border-2 border-outline">
                    2
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center font-headline-sm text-headline-sm text-on-secondary-container shadow-inner">
                      {item.initials}
                    </div>
                    <span className="font-body-lg text-body-lg text-on-surface font-bold burned-text">{item.username}</span>
                    {item.isOverloaded && <span title="Tenhle pirát to přehání! (>34 prdů/den)"><Biohazard className="w-5 h-5 text-error animate-pulse" /></span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-headline-sm text-headline-sm text-on-surface">
                  <FartCountValue count={item.count} /> <Wind className="w-5 h-5" /> <TodayBadge count={item.todayCount} />
                </div>
              </div>
            );
          }

          if (item.rank === 3) {
            // Rank 3
            return (
              <div key={item.username} className="bg-surface-container border-2 border-outline shadow-[3px_3px_0px_0px_rgba(115,121,111,1)] rounded-lg p-3 flex items-center justify-between relative z-0 hover:rotate-1 transition-transform duration-200" style={{ transform: "rotate(0.8deg)" }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-variant rounded-full flex items-center justify-center font-headline-sm text-headline-sm text-on-surface-variant border-2 border-outline">
                    3
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center font-headline-sm text-headline-sm text-on-tertiary shadow-inner">
                      {item.initials}
                    </div>
                    <span className="font-body-lg text-body-lg text-on-surface font-bold burned-text">{item.username}</span>
                    {item.isOverloaded && <span title="Tenhle pirát to přehání! (>34 prdů/den)"><Biohazard className="w-5 h-5 text-error animate-pulse" /></span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-headline-sm text-headline-sm text-on-surface">
                  <FartCountValue count={item.count} /> <Wind className="w-5 h-5" /> <TodayBadge count={item.todayCount} />
                </div>
              </div>
            );
          }

          // Rank 4+
          return <ScoreboardRow key={item.username} item={item} />;
        })}
      </div>
    </section>
  );
}
