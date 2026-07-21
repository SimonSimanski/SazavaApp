"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Play, RotateCcw, Trophy, Heart } from "lucide-react";
import { saveGameScore } from "@/app/actions";

type Status = "idle" | "playing" | "over";

interface Poop {
  x: number;
  y: number;
  r: number;
  vy: number;
  checked: boolean; // už jsme u ústí záchodu vyhodnotili chycení?
}

interface GameClientProps {
  initialBest: number;
  dbReady: boolean;
}

const MAX_LIVES = 3;

export default function GameClient({ initialBest, dbReady }: GameClientProps) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable herní stav (mimo React render kvůli výkonu)
  const poopsRef = useRef<Poop[]>([]);
  const toiletRef = useRef({ x: 0, targetX: 0, y: 0, w: 64 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const startTimeRef = useRef(0);
  const spawnAccRef = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(MAX_LIVES);
  const runningRef = useRef(false);

  // HUD stav
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [best, setBest] = useState(initialBest);
  const [saving, setSaving] = useState(false);

  // --- Velikost plátna ---
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;

    sizeRef.current = { w, h };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Umístění záchodu
    const t = toiletRef.current;
    t.w = Math.max(48, Math.min(80, w * 0.16));
    t.y = h - t.w - 8;
    if (t.x === 0) {
      t.x = w / 2;
      t.targetX = w / 2;
    }
    t.x = Math.max(t.w / 2, Math.min(w - t.w / 2, t.x));
    t.targetX = Math.max(t.w / 2, Math.min(w - t.w / 2, t.targetX));
  }, []);

  useEffect(() => {
    resize();
    const ro = new ResizeObserver(() => resize());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", resize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  // --- Ovládání (dotyk / myš) ---
  const pointerToTarget = useCallback((clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const t = toiletRef.current;
    t.targetX = Math.max(t.w / 2, Math.min(sizeRef.current.w - t.w / 2, x));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointer = (e: PointerEvent) => {
      pointerToTarget(e.clientX);
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        pointerToTarget(e.touches[0].clientX);
        e.preventDefault();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      const t = toiletRef.current;
      const step = t.w;
      if (e.key === "ArrowLeft") t.targetX = Math.max(t.w / 2, t.targetX - step);
      if (e.key === "ArrowRight")
        t.targetX = Math.min(sizeRef.current.w - t.w / 2, t.targetX + step);
    };

    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerdown", onPointer);
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [pointerToTarget]);

  // --- Kreslení ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    const t = toiletRef.current;

    ctx.clearRect(0, 0, w, h);

    // Naznačit "hladinu" ústí záchodu
    const catchY = t.y + t.w * 0.35;
    ctx.strokeStyle = "rgba(87,67,0,0.12)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(0, catchY);
    ctx.lineTo(w, catchY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Bobky
    for (const p of poopsRef.current) {
      ctx.font = `${p.r * 2}px serif`;
      ctx.fillText("💩", p.x, p.y);
    }

    // Záchod
    ctx.font = `${t.w}px serif`;
    ctx.fillText("🚽", t.x, t.y + t.w / 2);
  }, []);

  const stopLoop = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const endGame = useCallback(async () => {
    if (!runningRef.current) return;
    stopLoop();
    const finalScore = scoreRef.current;
    setStatus("over");
    draw();

    if (finalScore > best) setBest(finalScore);

    // Uložit skóre (mimo klasický prdník) – jen když má smysl a DB je připravená
    if (dbReady && finalScore > 0) {
      setSaving(true);
      try {
        await saveGameScore(finalScore);
        router.refresh(); // aktualizovat žebříček na stránce
      } catch (e) {
        console.error("Nepodařilo se uložit skóre hry", e);
      } finally {
        setSaving(false);
      }
    }
  }, [best, dbReady, draw, router, stopLoop]);

  // --- Herní smyčka ---
  const loop = useCallback(
    (ts: number) => {
      if (!runningRef.current) return;
      const { w, h } = sizeRef.current;
      const t = toiletRef.current;

      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000 || 0);
      lastTsRef.current = ts;

      const elapsed = (ts - startTimeRef.current) / 1000;

      // Obtížnost roste s časem
      const baseSpeed = Math.min(640, 165 + elapsed * 15);
      const spawnInterval = Math.max(360, 1150 - elapsed * 42); // ms

      // Plynulý pohyb záchodu k cíli
      t.x += (t.targetX - t.x) * Math.min(1, dt * 16);

      // Spawn nových bobků
      spawnAccRef.current += dt * 1000;
      if (spawnAccRef.current >= spawnInterval) {
        spawnAccRef.current = 0;
        const r = 16 + Math.random() * 8;
        poopsRef.current.push({
          x: r + Math.random() * (w - r * 2),
          y: -r,
          r,
          vy: baseSpeed * (0.85 + Math.random() * 0.35),
          checked: false,
        });
      }

      const catchY = t.y + t.w * 0.35;
      let missedThisFrame = 0;
      let caughtThisFrame = 0;

      const survivors: Poop[] = [];
      for (const p of poopsRef.current) {
        p.y += p.vy * dt;

        // Vyhodnocení chycení v okamžiku, kdy střed dosáhne ústí
        if (!p.checked && p.y >= catchY) {
          p.checked = true;
          const half = t.w / 2;
          if (p.x >= t.x - half && p.x <= t.x + half) {
            caughtThisFrame++;
            continue; // chyceno – zmizí
          }
        }

        // Propadlo pod obrazovku = minus život
        if (p.y - p.r > h) {
          missedThisFrame++;
          continue;
        }
        survivors.push(p);
      }
      poopsRef.current = survivors;

      if (caughtThisFrame > 0) {
        scoreRef.current += caughtThisFrame;
        setScore(scoreRef.current);
      }
      if (missedThisFrame > 0) {
        livesRef.current = Math.max(0, livesRef.current - missedThisFrame);
        setLives(livesRef.current);
      }

      draw();

      if (livesRef.current <= 0) {
        endGame();
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [draw, endGame]
  );

  const startGame = useCallback(() => {
    resize();
    poopsRef.current = [];
    scoreRef.current = 0;
    livesRef.current = MAX_LIVES;
    spawnAccRef.current = 0;
    setScore(0);
    setLives(MAX_LIVES);
    setStatus("playing");

    const t = toiletRef.current;
    t.x = sizeRef.current.w / 2;
    t.targetX = sizeRef.current.w / 2;

    runningRef.current = true;
    lastTsRef.current = performance.now();
    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, resize]);

  // Úklid při odchodu ze stránky
  useEffect(() => stopLoop, [stopLoop]);

  return (
    <div className="flex flex-col gap-4">
      {/* HUD */}
      <div className="flex items-center justify-between bg-surface-container-high border-4 border-on-surface rounded-xl px-4 py-3 hard-shadow rotate-[-1deg]">
        <div className="flex flex-col">
          <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">
            Skóre
          </span>
          <span className="font-headline-md text-headline-md text-on-surface">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">
            Životy
          </span>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${
                  i < lives ? "text-error" : "text-outline-variant"
                }`}
                fill={i < lives ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">
            Rekord
          </span>
          <span className="font-headline-sm text-headline-sm text-primary flex items-center gap-1">
            <Trophy className="w-4 h-4" /> {best}
          </span>
        </div>
      </div>

      {/* Herní plocha */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl border-4 border-on-surface hard-shadow-lg overflow-hidden bg-gradient-to-b from-[#dff0ff] to-[#bfe0f5] touch-none select-none"
        style={{ height: "60vh", maxHeight: 560, minHeight: 380 }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Overlay: start / konec */}
        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 p-6 text-center">
            {status === "idle" ? (
              <>
                <div className="text-5xl">💩🚽</div>
                <h3 className="font-display-lg text-display-lg text-white uppercase drop-shadow">
                  Chytej bobky!
                </h3>
                <p className="font-body-md text-body-md text-white/90 max-w-xs">
                  Posouvej záchod a chytej padající bobky. Když ti utečou{" "}
                  <b>{MAX_LIVES}</b>, je konec. A pozor – padá to čím dál rychleji!
                </p>
                <button
                  onClick={startGame}
                  className="mt-2 flex items-center gap-2 bg-tertiary-fixed text-on-surface font-headline-sm text-headline-sm px-6 py-3 rounded-xl border-4 border-on-surface hard-shadow active:translate-y-[2px] active:shadow-none transition-all uppercase"
                >
                  <Play className="w-5 h-5" fill="currentColor" /> Hrát
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl">🏴‍☠️</div>
                <h3 className="font-display-lg text-display-lg text-white uppercase drop-shadow">
                  Konec hry
                </h3>
                <p className="font-headline-md text-headline-md text-white">
                  Skóre: {score}
                </p>
                {score >= best && score > 0 && (
                  <p className="font-label-mono text-label-mono text-tertiary-fixed uppercase">
                    🎉 Nový rekord!
                  </p>
                )}
                {saving && (
                  <p className="font-label-mono text-label-mono text-white/80 uppercase">
                    Ukládám skóre…
                  </p>
                )}
                {!dbReady && (
                  <p className="font-label-mono text-label-mono text-white/80 max-w-xs">
                    (Skóre se neuloží – chybí tabulka game_scores v databázi.)
                  </p>
                )}
                <button
                  onClick={startGame}
                  className="mt-2 flex items-center gap-2 bg-tertiary-fixed text-on-surface font-headline-sm text-headline-sm px-6 py-3 rounded-xl border-4 border-on-surface hard-shadow active:translate-y-[2px] active:shadow-none transition-all uppercase"
                >
                  <RotateCcw className="w-5 h-5" /> Hrát znovu
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-center font-label-mono text-label-mono text-on-surface-variant">
        Ovládání: táhni prstem / myší (nebo šipky ←→)
      </p>
    </div>
  );
}
