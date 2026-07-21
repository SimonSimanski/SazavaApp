import { Backpack, Gamepad2, ChevronRight } from "lucide-react";
import Link from "next/link";
import InstallButton from "@/components/InstallButton";
import NotificationToggle from "@/components/NotificationToggle";

export default function Settings() {
  return (
    <section className="flex flex-col gap-6 mt-4">
      <div className="bg-surface-container-low wood-texture rounded-xl p-6 hard-shadow-lg flex flex-col items-center border-4 border-on-surface rotate-1">
        <Backpack className="w-16 h-16 text-secondary mb-4" fill="currentColor" />
        <h2 className="font-display-lg text-display-lg text-on-surface uppercase text-center">Další</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">
          Nastavení a statistiky budou dostupné později.
        </p>
      </div>

      <div className="rotate-1">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-3 px-1">🎮 Minihra</h3>
        <Link
          href="/game"
          className="w-full bg-tertiary-fixed wood-texture rounded-2xl border-4 border-on-surface hard-shadow-lg p-5 flex items-center justify-between hover:-rotate-1 transition-transform active:scale-95 duration-100"
        >
          <div className="flex items-center gap-4">
            <div className="bg-surface rounded-full p-3 border-2 border-on-surface hard-shadow flex items-center justify-center">
              <Gamepad2 className="w-8 h-8 text-secondary" />
            </div>
            <div className="flex flex-col text-left">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Chytej bobky</h2>
              <p className="font-label-mono text-label-mono text-on-surface-variant mt-1 uppercase">
                Chytej padající 💩 do záchodu
              </p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-on-surface shrink-0" />
        </Link>
      </div>

      <div className="rotate-1">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-3 px-1">🔔 Upozornění</h3>
        <NotificationToggle />
      </div>

      <div className="-rotate-1">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-3 px-1">📲 Aplikace</h3>
        <InstallButton />
      </div>
    </section>
  );
}
