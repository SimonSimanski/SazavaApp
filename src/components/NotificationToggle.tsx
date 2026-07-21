"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { subscribeToPush, unsubscribeFromPush } from "@/app/actions";

// VAPID public key base64url -> Uint8Array (pro applicationServerKey)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type State = "loading" | "unsupported" | "no-sw" | "denied" | "off" | "on";

export default function NotificationToggle() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window) ||
        !("Notification" in window)
      ) {
        setState("unsupported");
        return;
      }

      if (Notification.permission === "denied") {
        setState("denied");
        return;
      }

      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        // Service worker běží jen v produkci / nainstalované aplikaci
        setState("no-sw");
        return;
      }

      const sub = await reg.pushManager.getSubscription();
      setState(sub ? "on" : "off");
    };

    init().catch((e) => {
      console.error(e);
      setState("off");
    });
  }, []);

  const enable = async () => {
    setBusy(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "off");
        return;
      }

      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        setState("no-sw");
        return;
      }

      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapid) {
        setError("Chybí veřejný VAPID klíč.");
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
      });

      await subscribeToPush(sub.toJSON() as any);
      setState("on");
    } catch (e) {
      console.error("Zapnutí notifikací selhalo", e);
      setError("Zapnutí notifikací se nepodařilo.");
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    setError(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        const endpoint = sub.endpoint;
        await sub.unsubscribe();
        await unsubscribeFromPush(endpoint);
      }
      setState("off");
    } catch (e) {
      console.error("Vypnutí notifikací selhalo", e);
      setError("Vypnutí notifikací se nepodařilo.");
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") {
    return (
      <div className="bg-surface-container-high border-2 border-outline rounded-xl p-4 flex items-center gap-3">
        <Bell className="w-6 h-6 text-on-surface-variant shrink-0 animate-pulse" />
        <p className="font-body-md text-sm text-on-surface-variant">Načítám…</p>
      </div>
    );
  }

  if (state === "unsupported") {
    return (
      <div className="bg-surface-container-high border-2 border-outline rounded-xl p-4 flex items-start gap-3">
        <BellOff className="w-6 h-6 text-on-surface-variant shrink-0 mt-0.5" />
        <p className="font-body-md text-sm text-on-surface-variant">
          Tvůj prohlížeč notifikace nepodporuje.
        </p>
      </div>
    );
  }

  if (state === "no-sw") {
    return (
      <div className="bg-surface-container-high border-2 border-outline rounded-xl p-4 flex items-start gap-3">
        <BellOff className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-body-md text-sm text-on-surface font-bold mb-1">
            Nejdřív nainstaluj aplikaci
          </p>
          <p className="font-body-md text-sm text-on-surface-variant">
            Upozornění fungují jen v nainstalované appce (na iPhonu přidej na plochu).
          </p>
        </div>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="bg-error-container border-2 border-error rounded-xl p-4 flex items-start gap-3">
        <BellOff className="w-6 h-6 text-error shrink-0 mt-0.5" />
        <div>
          <p className="font-body-md text-sm text-on-error-container font-bold mb-1">
            Notifikace jsou zablokované
          </p>
          <p className="font-body-md text-sm text-on-error-container">
            Povol je v nastavení prohlížeče / aplikace pro tuhle stránku.
          </p>
        </div>
      </div>
    );
  }

  if (state === "on") {
    return (
      <div className="flex flex-col gap-2">
        <div className="bg-primary-container border-2 border-primary rounded-xl p-4 flex items-center gap-3">
          <BellRing className="w-6 h-6 text-primary shrink-0" />
          <p className="font-body-md text-sm text-on-primary-container">
            ✅ Upozornění na Velkou akci jsou zapnutá!
          </p>
        </div>
        <button
          onClick={disable}
          disabled={busy}
          className="w-full bg-surface-container-high border-2 border-outline rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-surface-dim transition-colors disabled:opacity-50 font-label-mono text-label-mono uppercase text-on-surface"
        >
          <BellOff className="w-5 h-5" /> {busy ? "Vypínám…" : "Vypnout upozornění"}
        </button>
        {error && <p className="text-error text-sm text-center">{error}</p>}
      </div>
    );
  }

  // state === "off"
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={enable}
        disabled={busy}
        className="w-full bg-tertiary-fixed text-on-tertiary-fixed font-headline-sm py-4 px-6 border-4 border-dashed border-on-background rounded-xl shadow-[4px_4px_0px_0px_#1f1c0b] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_#1f1c0b] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
      >
        <Bell className="w-6 h-6" />
        {busy ? "Zapínám…" : "Zapnout upozornění"}
      </button>
      <p className="font-body-md text-sm text-on-surface-variant text-center px-2">
        Dostaneš upozornění, když někdo zaznamená Velkou akci. 💩
      </p>
      {error && <p className="text-error text-sm text-center">{error}</p>}
    </div>
  );
}
