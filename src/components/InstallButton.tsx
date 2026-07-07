"use client";

import { Download, Smartphone } from "lucide-react";
import { useInstallPWA } from "./InstallPrompt";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const { canInstall, triggerInstall } = useInstallPWA();
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(standalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(ua));
  }, []);

  const handleClick = async () => {
    if (canInstall) {
      await triggerInstall();
    }
  };

  if (isInstalled) {
    return (
      <div className="bg-primary-container border-2 border-primary rounded-xl p-4 flex items-center gap-3">
        <Smartphone className="w-6 h-6 text-primary shrink-0" />
        <p className="font-body-md text-sm text-on-primary-container">
          ✅ Aplikace je nainstalovaná!
        </p>
      </div>
    );
  }

  if (canInstall) {
    return (
      <button
        onClick={handleClick}
        className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline-sm py-4 px-6 border-4 border-dashed border-on-background rounded-xl shadow-[4px_4px_0px_0px_#1f1c0b] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_#1f1c0b] transition-all active:bg-tertiary-fixed-dim relative overflow-hidden group flex items-center justify-center gap-3"
      >
        <Download className="w-6 h-6" />
        Nainstalovat aplikaci
      </button>
    );
  }

  return (
    <div className="bg-surface-container-high border-2 border-outline rounded-xl p-4 flex items-start gap-3">
      <Download className="w-6 h-6 text-primary shrink-0 mt-0.5" />
      <div>
        <p className="font-body-md text-sm text-on-surface font-bold mb-1">
          Nainstaluj si appku
        </p>
        <p className="font-body-md text-sm text-on-surface-variant">
          {isIos
            ? "Klepni dole na ikonu sdílení a vyber \"Přidat na plochu\"."
            : "Klikni v menu prohlížeče (⋮) nahoře a zvol \"Instalovat aplikaci\" nebo \"Přidat na plochu\"."}
        </p>
      </div>
    </div>
  );
}
