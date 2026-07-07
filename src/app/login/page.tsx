import { Anchor, Key, Skull, Explore } from "lucide-react";
import { login } from "@/app/auth/actions";
import Link from "next/link";

export default async function LoginPage(props: { searchParams: Promise<{ error: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="bg-background text-on-background min-h-screen relative flex items-center justify-center overflow-x-hidden selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      {/* Texture Background Image - inherited from globals.css on body */}
      
      <main className="relative z-10 w-full max-w-md px-edge-margin py-section-padding flex flex-col items-center">
        {/* Header / Logo Area */}
        <div className="mb-10 flex flex-col items-center justify-center transform -rotate-2">
          <Skull className="w-16 h-16 text-primary mb-2" fill="currentColor" />
          <h1 className="font-display-lg text-display-lg text-primary uppercase tracking-tighter drop-shadow-[3px_3px_0px_#acd0a1]">
            SÁZAVIK
          </h1>
        </div>

        {/* Greeting Card / "Wooden Plank" */}
        <div className="bg-surface-container-high border-4 border-on-surface rounded-xl rounded-tr-3xl p-section-padding w-full mb-8 shadow-[6px_6px_0px_0px_#1f1c0b] transform rotate-1 relative">
          {/* Decorative pin */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-secondary shadow-inner flex items-center justify-center border-2 border-on-background">
            <div className="w-2 h-2 rounded-full bg-on-background/50"></div>
          </div>
          
          <h2 className="font-headline-md text-headline-md text-center text-on-surface mb-6">
            Vítej na palubě, piráte!
          </h2>

          {searchParams.error && (
            <p className="text-error bg-error-container p-3 font-label-mono text-center rounded mb-4 border-2 border-error">
              {searchParams.error}
            </p>
          )}

          {/* Form */}
          <form action={login} className="flex flex-col gap-stack-gap w-full">
            {/* Username Input */}
            <div className="flex flex-col group relative">
              <label className="font-label-mono text-label-mono text-on-surface-variant mb-1 flex items-center gap-2" htmlFor="email">
                <Anchor className="w-4 h-4" />
                Jméno piráta
              </label>
              <input 
                className="bg-transparent border-b-4 border-on-background rounded-sm px-2 py-3 font-label-mono text-label-mono text-primary outline-none focus:border-tertiary transition-colors w-full placeholder:text-outline-variant placeholder:font-body-md" 
                id="email" 
                name="email" 
                placeholder="Tvůj slavný pseudonym..." 
                required 
                type="text" 
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col group relative mt-4">
              <label className="font-label-mono text-label-mono text-on-surface-variant mb-1 flex items-center gap-2" htmlFor="password">
                <Key className="w-4 h-4" />
                Heslo k pokladu
              </label>
              <input 
                className="bg-transparent border-b-4 border-on-background rounded-sm px-2 py-3 font-label-mono text-label-mono text-primary outline-none focus:border-tertiary transition-colors w-full placeholder:text-outline-variant placeholder:font-body-md tracking-widest" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type="password" 
              />
            </div>

            {/* Primary Action Button */}
            <button 
              className="mt-8 bg-tertiary-fixed text-on-tertiary-fixed font-headline-sm text-headline-sm py-4 px-6 border-4 border-dashed border-on-background rounded-xl shadow-[4px_4px_0px_0px_#1f1c0b] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0px_0px_#1f1c0b] transition-all active:bg-tertiary-fixed-dim relative overflow-hidden group" 
              type="submit"
            >
              <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Vstoupit na loď
                {/* <Explore is not a valid lucide icon, mapping to Compass */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-compass"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/></svg>
              </span>
            </button>
          </form>
        </div>

        {/* Secondary Link */}
        <div className="mt-4 transform rotate-1">
          <Link href="/register" className="font-label-mono text-label-mono text-secondary hover:text-primary transition-colors underline decoration-2 underline-offset-4 decoration-secondary/50 hover:decoration-primary flex items-center gap-2 bg-surface-container px-4 py-2 rounded border-2 border-transparent hover:border-outline-variant">
            Ještě nemám loď? Registrovat se
          </Link>
        </div>
      </main>
    </div>
  );
}
