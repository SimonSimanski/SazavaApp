"use client";

// Sdílený pirát – používá ho jak notifikační nudge (PirateNudge),
// tak vyskakovací fakt o prdech (FartFactPirate), ať jsou vizuálně konzistentní.
export default function PirateAvatar({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={`pirate-bob ${className}`} style={{ transformOrigin: "bottom center" }}>
      <div style={{ transform: flip ? "scaleX(-1)" : undefined, filter: "drop-shadow(2px 3px 0 rgba(0,0,0,0.35))" }}>
        <svg width="72" height="96" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* krk/rameno */}
          <rect x="24" y="78" width="26" height="18" rx="6" fill="#8a5a2b" />
          {/* obličej */}
          <circle cx="37" cy="50" r="26" fill="#f2c79a" stroke="#3a2c1a" strokeWidth="2.5" />
          {/* vousy */}
          <path d="M14 52 a23 23 0 0 0 46 0 v6 a23 23 0 0 1 -46 0 z" fill="#4a3524" opacity="0.85" />
          {/* šátek */}
          <path d="M9 34 q28 -22 56 0 q-28 -10 -56 0 z" fill="#c1121f" stroke="#3a2c1a" strokeWidth="2.5" />
          <path d="M9 34 q28 -14 56 0 l0 5 q-28 -12 -56 0 z" fill="#e63946" />
          {/* uzel + cípy šátku vlevo */}
          <circle cx="10" cy="36" r="5" fill="#c1121f" stroke="#3a2c1a" strokeWidth="2" />
          <path d="M6 38 l-6 10 l7 -3 z" fill="#c1121f" stroke="#3a2c1a" strokeWidth="1.5" />
          <path d="M8 40 l-3 12 l6 -5 z" fill="#e63946" stroke="#3a2c1a" strokeWidth="1.5" />
          {/* puntíky na šátku */}
          <circle cx="30" cy="27" r="2" fill="#fff" opacity="0.85" />
          <circle cx="44" cy="25" r="2" fill="#fff" opacity="0.85" />
          <circle cx="52" cy="30" r="1.6" fill="#fff" opacity="0.85" />
          {/* obočí */}
          <path d="M40 42 q7 -4 13 1" stroke="#3a2c1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* zdravé oko */}
          <circle cx="46" cy="49" r="4.5" fill="#fff" stroke="#3a2c1a" strokeWidth="1.5" />
          <circle cx="47" cy="49" r="2.2" fill="#2b2b2b" />
          {/* páska přes oko */}
          <path d="M20 40 l40 12" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="28" cy="48" rx="7" ry="8" fill="#1a1a1a" />
          {/* úsměv se zubem */}
          <path d="M30 62 q9 9 20 2" stroke="#3a2c1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="36" y="63" width="4" height="4" rx="1" fill="#fff" stroke="#3a2c1a" strokeWidth="1" />
          {/* náušnice */}
          <circle cx="61" cy="58" r="3.5" fill="none" stroke="#f4c430" strokeWidth="2.5" />
        </svg>
      </div>
    </div>
  );
}
