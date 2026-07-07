"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, X, Share, ArrowDown } from "lucide-react";

// Shared state so the Settings page button can also trigger install
let globalDeferredPrompt: any = null;

export function useInstallPWA() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const check = () => setCanInstall(globalDeferredPrompt !== null);
    check();
    // Re-check periodically (the event can fire after mount)
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerInstall = useCallback(async () => {
    if (!globalDeferredPrompt) return false;
    globalDeferredPrompt.prompt();
    const { outcome } = await globalDeferredPrompt.userChoice;
    globalDeferredPrompt = null;
    setCanInstall(false);
    return outcome === "accepted";
  }, []);

  return { canInstall, triggerInstall };
}

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const { canInstall, triggerInstall } = useInstallPWA();

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Check if user dismissed it recently (expires after 7 days)
    const dismissedAt = localStorage.getItem("pwa-prompt-dismissed-at");
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Show prompt after 2 seconds
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 2000);

    // Handle standard PWA install prompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e;
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (canInstall) {
      const accepted = await triggerInstall();
      if (accepted) {
        setShowPrompt(false);
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed-at", String(Date.now()));
  };

  if (!showPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "6rem",
        left: "1rem",
        right: "1rem",
        zIndex: 9999,
        animation: "installSlideUp 0.4s ease-out both",
      }}
    >
      <style>{`
        @keyframes installSlideUp {
          from {
            opacity: 0;
            transform: translateY(2rem) rotate(1deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(1deg);
          }
        }
      `}</style>
      <div className="bg-primary-container border-4 border-on-surface text-on-primary-container p-4 rounded-xl shadow-[4px_4px_0px_0px_#1f1c0b] relative flex gap-3 items-start">
        <button
          onClick={handleDismiss}
          className="absolute -top-3 -right-3 bg-surface text-on-surface border-2 border-on-surface rounded-full p-1 hover:bg-surface-dim transition-colors shadow-[2px_2px_0px_0px_#1f1c0b] active:translate-y-px active:shadow-none"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-primary text-on-primary p-2 rounded-lg shrink-0 border-2 border-on-surface shadow-inner mt-1">
          <Download className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h4 className="font-headline-sm text-headline-sm mb-1 text-primary">
            Stáhni si appku! 📲
          </h4>

          {isIos ? (
            <div className="flex flex-col gap-2 mt-2">
              <p className="font-body-md text-sm text-on-surface mb-1">
                Jelikož jsi na iPhonu, musíš appku přidat růčo:
              </p>
              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-lg border-2 border-on-surface/20">
                <div className="bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">1</div>
                <p className="text-sm font-label-mono text-on-surface">Klepni dole na sdílení <Share className="w-4 h-4 inline text-primary mx-0.5" /></p>
              </div>
              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-lg border-2 border-on-surface/20">
                <div className="bg-primary text-on-primary w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs shadow-sm">2</div>
                <p className="text-sm font-label-mono text-on-surface">Zvol <strong>Přidat na plochu</strong></p>
              </div>
              <div className="flex justify-center mt-2 text-primary animate-bounce">
                <ArrowDown className="w-6 h-6" />
              </div>
            </div>
          ) : canInstall ? (
            <>
              <p className="font-body-md text-sm mb-3 text-on-surface">
                Nainstaluj si Prdník jako aplikaci přímo na plochu!
              </p>
              <button
                onClick={handleInstallClick}
                className="bg-tertiary-fixed text-on-tertiary-fixed font-label-mono px-4 py-2 rounded-lg text-sm uppercase tracking-wider hover:bg-tertiary-fixed-dim transition-colors border-2 border-on-surface shadow-[2px_2px_0px_0px_#1f1c0b] active:translate-y-px active:shadow-none"
              >
                ⬇️ Nainstalovat
              </button>
            </>
          ) : (
            <p className="font-body-md text-sm mb-2 text-on-surface">
              Klikni v menu prohlížeče (⋮) nahoře a zvol{" "}
              <strong>&quot;Instalovat aplikaci&quot;</strong> nebo{" "}
              <strong>&quot;Přidat na plochu&quot;</strong>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
