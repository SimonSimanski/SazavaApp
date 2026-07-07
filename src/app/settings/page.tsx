import { Backpack } from "lucide-react";

export default function Settings() {
  return (
    <section className="flex flex-col gap-6 rotate-1 mt-4">
      <div className="bg-surface-container-low wood-texture rounded-xl p-6 hard-shadow-lg flex flex-col items-center border-4 border-on-surface">
        <Backpack className="w-16 h-16 text-secondary mb-4" fill="currentColor" />
        <h2 className="font-display-lg text-display-lg text-on-surface uppercase text-center">Další</h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">
          Nastavení a statistiky budou dostupné později.
        </p>
      </div>
    </section>
  );
}
