"use client";

import { useState } from "react";
import { Anchor, LogOut, X } from "lucide-react";
import { logout } from "@/app/auth/actions";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hover:rotate-1 transition-transform active:scale-95 duration-100 p-2 rounded-full bg-surface-container-low hard-shadow border-2 border-on-surface-variant"
      >
        <Anchor className="w-6 h-6 text-on-surface" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pr-edge-margin pt-20 pointer-events-none">
          {/* Backdrop for closing */}
          <div 
            className="fixed inset-0 bg-black/20 pointer-events-auto transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Swinging menu */}
          <div className="animate-swing pointer-events-auto bg-surface-container-highest border-4 border-on-surface hard-shadow-lg p-6 flex flex-col items-center gap-6 relative z-10 w-64 wood-texture rounded-2xl">
            {/* The rope */}
            <div className="absolute -top-64 left-1/2 -translate-x-1/2 w-1.5 h-64 bg-on-surface-variant border-x-2 border-on-surface z-[-1]"></div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-on-surface bg-surface-container rounded-full border-2 border-on-surface hard-shadow active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-headline-sm text-headline-sm text-on-surface text-center uppercase tracking-tight mt-2">Tvoje Kajuta</h3>
            
            <button 
              onClick={() => logout()}
              className="w-full bg-error-container text-on-error-container border-2 border-on-surface py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#ffb4ab] transition-colors hard-shadow font-label-mono text-label-mono uppercase active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              Odhlásit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
