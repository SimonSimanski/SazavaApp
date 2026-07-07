"use client";

import { Compass, Trophy, Backpack } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Záznam", icon: Compass },
    { href: "/scoreboard", label: "Žebříček", icon: Trophy },
    { href: "/settings", label: "Další", icon: Backpack },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 border-t-4 border-on-secondary-container shadow-[0_-4px_0px_0px_rgba(117,52,1,1)] flex justify-around items-center px-4 pb-4 pt-2 bg-surface-container-high dark:bg-surface-container-highest md:hidden">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex flex-col items-center justify-center p-2 hover:bg-surface-container-highest transition-all group",
              isActive
                ? "bg-secondary-container text-on-secondary-container rounded-xl border-2 border-dashed border-on-secondary-fixed-variant scale-110 -translate-y-2 hover:rotate-1 active:translate-y-1"
                : "text-on-surface-variant hover:rotate-1 active:translate-y-1"
            )}
          >
            <Icon
              className={clsx(
                "w-6 h-6 mb-1 transition-transform",
                isActive
                  ? "text-primary dark:text-primary-fixed group-hover:rotate-12"
                  : "group-hover:-rotate-12"
              )}
              fill={isActive ? "currentColor" : "none"}
            />
            <span
              className={clsx(
                "font-label-mono text-label-mono",
                isActive && "text-primary dark:text-primary-fixed"
              )}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
