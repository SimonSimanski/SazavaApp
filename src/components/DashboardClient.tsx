"use client";

import { useState, useRef } from "react";
import { Wind, Recycle, Cloud, VolumeX, Bomb, Droplets, Clock, X, Skull, Ghost, History } from "lucide-react";
import { logFart, logPoop, undoEvent } from "@/app/actions";

export type LogEvent = {
  id: string;
  type: 'fart' | 'poop';
  createdAt: string;
  intensity?: string;
  bristolScale?: number;
};

interface DashboardClientProps {
  initialFartCount: number;
  initialPoopCount: number;
  campStatusText?: string;
  initialLatestEvents?: LogEvent[];
}

export default function DashboardClient({ initialFartCount, initialPoopCount, campStatusText, initialLatestEvents = [] }: DashboardClientProps) {
  const [poopDrawerVisible, setPoopDrawerVisible] = useState(false);
  const [fartCount, setFartCount] = useState(initialFartCount);
  const [poopCount, setPoopCount] = useState(initialPoopCount);
  const [latestEvents, setLatestEvents] = useState<LogEvent[]>(initialLatestEvents);
  const [ghosts, setGhosts] = useState<{ id: number; top: number; delay: number; scale: number; duration: number }[]>([]);
  const ghostIdCounter = useRef(0);

  const playFartSound = async (type: "tichacek" | "delobuch") => {
    if (type === "tichacek") {
      const newGhosts = Array.from({ length: 7 }).map(() => ({
        id: ghostIdCounter.current++,
        top: 5 + Math.random() * 80, // 5% to 85%
        delay: Math.random() * 0.8, // 0 to 0.8s delay
        scale: 0.4 + Math.random() * 0.8, // 0.4x to 1.2x size
        duration: 3 + Math.random() * 2.5 // 3s to 5.5s duration
      }));
      
      setGhosts(prev => [...prev, ...newGhosts]);
      
      setTimeout(() => {
        const idsToRemove = newGhosts.map(g => g.id);
        setGhosts(prev => prev.filter(g => !idsToRemove.includes(g.id)));
      }, 7000); // wait max duration + delay to clean up
    } else {
      // Web Audio API
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.8);
      filter.type = "lowpass";
      filter.frequency.value = 800;
      filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.8);
      gainNode.gain.setValueAtTime(1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 600;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(ctx.currentTime);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
    }
    
    // Optimistically update UI immediately
    const tempId = `temp-${Date.now()}`;
    const newEvent: LogEvent = {
      id: tempId,
      type: 'fart',
      createdAt: new Date().toISOString(),
      intensity: type === 'tichacek' ? 'low' : 'nuclear',
    };
    setFartCount(prev => prev + 1);
    setLatestEvents(prev => [newEvent, ...prev].slice(0, 50));

    // Fire server action in the background
    logFart(type).then((result) => {
      // Replace temp ID with real ID from database
      setLatestEvents(prev => prev.map(e => e.id === tempId ? { ...e, id: result.id, createdAt: result.createdAt } : e));
    }).catch(e => {
      console.error("Failed to log fart", e);
      // Rollback on error
      setFartCount(prev => Math.max(0, prev - 1));
      setLatestEvents(prev => prev.filter(e => e.id !== tempId));
    });
  };

  const handlePoopSubmit = async (bristol: number) => {
    setPoopDrawerVisible(false);
    
    // Optimistically update UI immediately
    const tempId = `temp-${Date.now()}`;
    const newEvent: LogEvent = {
      id: tempId,
      type: 'poop',
      createdAt: new Date().toISOString(),
      bristolScale: bristol,
    };
    setPoopCount(prev => prev + 1);
    setLatestEvents(prev => [newEvent, ...prev].slice(0, 50));

    // Fire server action in the background
    logPoop(bristol).then((result) => {
      setLatestEvents(prev => prev.map(e => e.id === tempId ? { ...e, id: result.id, createdAt: result.createdAt } : e));
    }).catch(e => {
      console.error("Failed to log poop", e);
      setPoopCount(prev => Math.max(0, prev - 1));
      setLatestEvents(prev => prev.filter(e => e.id !== tempId));
    });
  }

  const handleUndo = async (event: LogEvent) => {
    // Optimistic remove
    setLatestEvents(prev => prev.filter(e => e.id !== event.id));
    
    // Optimistically decrement count if it was from today
    const isToday = new Date(event.createdAt).toDateString() === new Date().toDateString();
    if (isToday) {
      if (event.type === 'fart') setFartCount(c => Math.max(0, c - 1));
      else setPoopCount(c => Math.max(0, c - 1));
    }

    try {
      await undoEvent(event.id, event.type);
    } catch (e) {
      console.error("Failed to undo event", e);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatGhost {
          0% { transform: translateX(-10vw) translateY(0) scale(0.8) rotate(-10deg); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateX(50vw) translateY(-20px) scale(1) rotate(5deg); }
          90% { opacity: 0.8; }
          100% { transform: translateX(110vw) translateY(10px) scale(0.8) rotate(-5deg); opacity: 0; }
        }
        .ghost-animation {
          animation: floatGhost 4s ease-in-out both;
        }
      `}} />
      
      {ghosts.map(g => (
        <div 
          key={g.id} 
          className="fixed pointer-events-none z-[100] ghost-animation drop-shadow-md text-on-surface"
          style={{ 
            top: `${g.top}%`, 
            left: 0,
            animationDelay: `${g.delay}s`,
            animationDuration: `${g.duration}s`
          }}
        >
          <div style={{ transform: `scale(${g.scale})` }}>
            <Ghost className="w-16 h-16 opacity-70" />
          </div>
        </div>
      ))}

      {campStatusText && (
        <div className="text-center mt-2 mb-4 bg-tertiary-container text-on-tertiary-container rounded-lg px-4 py-2 mx-auto inline-block font-label-mono text-label-mono uppercase border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] rotate-1">
          {campStatusText}
        </div>
      )}
      <section className="flex flex-col items-center rotate-1">
        <div className={`patch-border rounded-xl p-4 hard-shadow-lg flex items-center gap-4 border-4 border-on-surface relative transition-colors ${fartCount > 14 ? 'bg-error-container border-error' : 'bg-surface-container-low'}`}>
          <div className={`flex flex-col items-center border-r-2 border-dashed border-outline-variant pr-4 ${fartCount > 14 ? 'animate-pulse' : ''}`}>
            <Wind className={`w-8 h-8 ${fartCount > 14 ? 'text-error' : 'text-secondary'}`} fill="currentColor" />
            <span className={`font-headline-sm text-headline-sm mt-1 ${fartCount > 14 ? 'text-error font-bold' : 'text-on-surface'}`}>{fartCount}</span>
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Prdů</span>
          </div>
          <div className="flex flex-col items-center pl-2">
            <Recycle className={`w-8 h-8 ${fartCount > 14 ? 'text-on-surface-variant' : 'text-tertiary'}`} />
            <span className={`font-headline-sm text-headline-sm mt-1 ${fartCount > 14 ? 'text-on-surface' : 'text-on-surface'}`}>{poopCount}</span>
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Hovínko</span>
          </div>
          <div className={`absolute -top-3 -right-3 font-label-mono text-label-mono px-2 py-1 rounded-full hard-shadow rotate-12 border-2 border-on-surface ${fartCount > 14 ? 'bg-error text-on-error' : 'bg-tertiary-fixed text-on-error'}`}>
            Dnes
          </div>
        </div>

        {fartCount > 14 && (
          <div className="mt-4 bg-error-container text-on-error-container p-3 rounded-xl border-2 border-error shadow-[3px_3px_0px_0px_rgba(186,26,26,0.6)] rotate-[-2deg] flex items-center gap-3 w-full max-w-[300px] animate-in slide-in-from-top-2">
            <Skull className="w-8 h-8 text-error shrink-0" />
            <div className="flex flex-col text-left">
              <span className="font-bold font-label-mono uppercase text-sm">Kritická hranice!</span>
              <span className="text-xs mt-1">Kámo brzdi, nebo zasmradíš celej tábor!</span>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6 -rotate-1 mt-4 relative z-10">
        <div className="relative w-full flex flex-col gap-3">
          <button
            onClick={() => playFartSound("delobuch")}
            className="w-full bg-tertiary-fixed wood-texture rounded-2xl border-4 border-on-surface hard-shadow-lg p-6 flex flex-col items-center justify-center hover:rotate-1 transition-transform active:scale-95 duration-100 overflow-hidden relative z-20"
          >
            <Cloud className="w-16 h-16 text-on-surface mb-2" fill="currentColor" />
            <h2 className="font-headline-md text-headline-md text-on-surface text-center">Zaznamenat prd</h2>
            <p className="font-label-mono text-label-mono text-on-surface-variant mt-2 uppercase">Pořádná pecka (Dělobuch)</p>
          </button>
          
          <button 
            onClick={() => playFartSound("tichacek")}
            className="w-full bg-surface-container-highest rounded-xl border-2 border-on-surface p-3 flex items-center justify-center gap-2 hover:bg-surface-dim transition-colors hard-shadow active:scale-95 duration-100"
          >
            <VolumeX className="w-5 h-5 text-on-surface-variant" />
            <span className="font-label-mono text-label-mono text-on-surface">Pšššt, byl to jen Ticháček...</span>
          </button>
        </div>

        <button 
          onClick={() => setPoopDrawerVisible(true)}
          className="w-full bg-secondary-container wood-texture rounded-2xl border-4 border-on-surface hard-shadow-lg p-6 flex items-center justify-between hover:-rotate-1 transition-transform active:scale-95 duration-100"
        >
          <div className="flex flex-col text-left">
            <h2 className="font-headline-sm text-headline-sm text-on-secondary-container">Návštěva WC</h2>
            <p className="font-label-mono text-label-mono text-on-secondary-container opacity-80 mt-1 uppercase">Velká akce</p>
          </div>
          <div className="bg-surface rounded-full p-4 border-2 border-on-surface hard-shadow flex items-center justify-center">
            <Droplets className="w-10 h-10 text-secondary" fill="currentColor" />
          </div>
        </button>
      </section>

      {/* Poop Drawer Overlay */}
      {poopDrawerVisible && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-edge-margin pb-20">
            <div className="w-full max-w-md bg-surface-container-high wood-texture border-4 border-on-surface rounded-t-3xl p-6 hard-shadow-lg animate-in slide-in-from-bottom-10 fade-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline-md text-headline-md text-on-surface">Jak to šlo?</h3>
                    <button onClick={() => setPoopDrawerVisible(false)} className="p-2 bg-surface rounded-full border-2 border-on-surface hover:bg-surface-dim">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    {[
                        { val: 1, label: "Mini bobík" },
                        { val: 2, label: "Hrudkovitý klobásek" },
                        { val: 3, label: "Klasický jezevčík" },
                        { val: 4, label: "Hladké torpédo" },
                        { val: 5, label: "Hrabě Kákula (největší)" }
                    ].map((item) => (
                        <button 
                            key={item.val}
                            onClick={() => handlePoopSubmit(item.val)}
                            className="bg-surface hover:bg-surface-dim border-2 border-on-surface p-4 rounded-xl flex items-center justify-between group active:scale-95 transition-transform"
                        >
                            <span className="font-label-mono text-label-mono bg-secondary-container text-on-secondary-container w-8 h-8 rounded-full flex items-center justify-center border-2 border-on-surface group-hover:rotate-12 transition-transform">
                                {item.val}
                            </span>
                            <span className="font-body-lg text-body-lg text-on-surface flex-1 text-left ml-4">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      <section className="mt-8 bg-surface-container border-4 border-on-surface rounded-lg p-4 hard-shadow rotate-1 cork-texture relative z-0">
        <h3 className="font-headline-sm text-headline-sm text-on-surface border-b-2 border-dashed border-outline pb-2 mb-4">
          Poslední úlovek
        </h3>
        
        {latestEvents.length > 0 ? (
          latestEvents.slice(0, 1).map((event) => {
            const isFart = event.type === 'fart';
            const timeString = new Date(event.createdAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
            
            let detailText = '';
            if (isFart) {
              detailText = event.intensity === 'low' ? 'Ticháček' : 'Dělobuch';
            } else {
              detailText = `Velikost: Bristol ${event.bristolScale}`;
            }

            return (
              <div key={event.id} className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-4 bg-surface p-3 rounded-lg border-2 border-on-surface shadow-sm">
                  <div className={`p-2 rounded-full border-2 border-on-surface ${isFart ? 'bg-secondary-container' : 'bg-tertiary-container'}`}>
                    {isFart ? (
                      <Wind className="w-6 h-6 text-on-secondary-container" fill="currentColor" />
                    ) : (
                      <Droplets className="w-6 h-6 text-on-tertiary-container" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-headline-sm text-on-surface">{isFart ? 'Prd' : 'Velká akce'}</p>
                    <p className="font-label-mono text-xs text-on-surface-variant uppercase">{timeString} • {detailText}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUndo(event)}
                  className="w-full flex items-center justify-center gap-2 bg-error text-on-error py-3 px-4 rounded-lg border-2 border-on-surface hard-shadow active:translate-y-[2px] active:shadow-none transition-all font-label-mono uppercase tracking-wider text-sm hover:bg-[#ff4444]"
                >
                  <History className="w-5 h-5" /> Zatlačit zpátky
                </button>
              </div>
            )
          })
        ) : (
          <div className="flex items-center gap-4 bg-surface p-3 rounded border-2 border-on-surface">
            <Clock className="w-6 h-6 text-on-surface-variant" />
            <div>
              <p className="font-body-lg text-body-lg text-on-surface">Zatím nic nezaznamenáno</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
