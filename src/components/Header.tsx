import { Anchor, Skull } from "lucide-react";
import UserMenu from "./UserMenu";

export default function Header() {
  return (
    <header className="w-full top-0 border-b-4 border-secondary-container shadow-[4px_4px_0px_0px_rgba(117,52,1,1)] flex items-center justify-between px-edge-margin h-20 bg-surface-variant dark:bg-surface-container-highest z-40 sticky">
      <div className="flex items-center gap-2">
        <Anchor className="w-9 h-9 text-primary dark:text-primary-fixed-dim" fill="currentColor" />
        <h1 className="font-display-lg text-display-lg text-on-surface-variant uppercase tracking-tight m-0 pt-2 leading-none">
          SÁZAVIK
        </h1>
        <Skull className="w-6 h-6 text-secondary opacity-80" />
      </div>
      <UserMenu />
    </header>
  );
}
