import { Wind, ListOrdered, Biohazard } from "lucide-react";

export interface ScoreboardItem {
  rank: number;
  username: string;
  count: number;
  isCurrentUser: boolean;
  initials: string;
  _userId?: string;
  isOverloaded?: boolean;
}

interface ScoreboardListProps {
  items: ScoreboardItem[];
}

export default function ScoreboardList({ items }: ScoreboardListProps) {
  return (
    <section className="flex flex-col gap-stack-gap">
      <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2 px-2">
        <ListOrdered className="w-6 h-6" />
        Tabulka Prdů
      </h3>
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
                    {item.isOverloaded && <span title="Tenhle pirát to přehání! (>14 prdů/den)"><Biohazard className="w-5 h-5 text-error animate-pulse" /></span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-body-md text-body-md text-on-primary-container font-bold">
                  {item.count} <Wind className="w-4 h-4" />
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
                    {item.isOverloaded && <span title="Tenhle pirát to přehání! (>14 prdů/den)"><Biohazard className="w-5 h-5 text-error animate-pulse" /></span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-headline-sm text-headline-sm text-tertiary-container">
                  {item.count} <Wind className="w-5 h-5" />
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
                    {item.isOverloaded && <span title="Tenhle pirát to přehání! (>14 prdů/den)"><Biohazard className="w-5 h-5 text-error animate-pulse" /></span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-headline-sm text-headline-sm text-on-surface">
                  {item.count} <Wind className="w-5 h-5" />
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
                    {item.isOverloaded && <span title="Tenhle pirát to přehání! (>14 prdů/den)"><Biohazard className="w-5 h-5 text-error animate-pulse" /></span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 font-headline-sm text-headline-sm text-on-surface">
                  {item.count} <Wind className="w-5 h-5" />
                </div>
              </div>
            );
          }

          // Rank 4+
          return (
            <div key={item.username} className="bg-surface-container border-2 border-dashed border-outline-variant shadow-[2px_2px_0px_0px_rgba(115,121,111,0.5)] rounded-lg p-3 flex items-center justify-between relative z-0" style={{ transform: "rotate(-0.2deg)" }}>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center font-body-md text-body-md text-outline">
                  {item.rank}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center font-body-md text-body-md text-on-primary-container shadow-inner">
                    {item.initials}
                  </div>
                  <span className="font-body-md text-body-md text-on-surface">{item.username}</span>
                  {item.isOverloaded && <span title="Tenhle pirát to přehání! (>14 prdů/den)"><Biohazard className="w-4 h-4 text-error animate-pulse" /></span>}
                </div>
              </div>
              <div className="flex items-center gap-1 font-body-md text-body-md text-on-surface">
                {item.count} <Wind className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
