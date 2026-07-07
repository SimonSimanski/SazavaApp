"use client";

import { useState, useEffect } from "react";
import { Download, X, Share } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Check if user dismissed it previously
    if (localStorage.getItem("pwa-prompt-dismissed") === "true") return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Show prompt after 3 seconds if not standalone
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 3000);

    // Handle standard PWA install prompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Browser didn't fire the event (maybe already installed, maybe not supported, or fired too early)
      setShowManualInstructions(true);
      return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-primary-container border-4 border-on-surface text-on-primary-container p-4 rounded-xl shadow-[4px_4px_0px_0px_#1f1c0b] relative flex gap-3 items-start rotate-1">
        <button 
          onClick={handleDismiss}
          className="absolute -top-3 -right-3 bg-surface text-on-surface border-2 border-on-surface rounded-full p-1 hover:bg-surface-dim transition-colors shadow-[2px_2px_0px_0px_#1f1c0b] active:translate-y-px active:shadow-none"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="bg-primary text-on-primary p-2 rounded-lg shrink-0 border-2 border-on-surface shadow-inner -rotate-3 mt-1">
          <Download className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h4 className="font-headline-sm text-headline-sm mb-1 text-primary">Aplikace do mobilu</h4>
          
          {isIos ? (
            <p className="font-body-md text-sm mb-2 text-on-surface">
              Klepni na ikonu sdílení <Share className="w-4 h-4 inline text-primary" /> dole a vyber <strong>Přidat na plochu</strong>.
            </p>
          ) : showManualInstructions ? (
            <p className="font-body-md text-sm mb-3 text-on-surface font-bold">
              Klikni nahoře na menu prohlížeče (tři tečky) a zvol "Přidat na domovskou obrazovku" nebo "Instalovat aplikaci".
            </p>
          ) : (
            <p className="font-body-md text-sm mb-3 text-on-surface">
              Nainstaluj si Prdomet rovnou na plochu pro okamžitý přístup!
            </p>
          )}

          {!isIos && !showManualInstructions && (
            <button 
              onClick={handleInstallClick}
              className="bg-tertiary-fixed text-on-tertiary-fixed font-label-mono px-4 py-2 rounded-lg text-sm uppercase tracking-wider hover:bg-tertiary-fixed-dim transition-colors border-2 border-on-surface shadow-[2px_2px_0px_0px_#1f1c0b] active:translate-y-px active:shadow-none"
            >
              Nainstalovat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
