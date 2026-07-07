import { Anchor, Key, Skull, BadgeIcon } from "lucide-react";
import { signup } from "@/app/auth/actions";
import Link from "next/link";

export default async function RegisterPage(props: { searchParams: Promise<{ error: string }> }) {
  const searchParams = await props.searchParams;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-edge-margin relative overflow-x-hidden">
      <main className="w-full max-w-md flex flex-col gap-stack-gap z-10">
        
        <header className="flex items-center justify-center gap-unit mb-8 relative">
          <Skull className="w-10 h-10 text-primary" fill="currentColor" />
          <h1 className="font-display-lg text-display-lg text-primary uppercase tracking-tighter">
            SÁZAVIK
          </h1>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 border-b-4 border-primary/20"></div>
        </header>

        <div className="bg-surface-container border-2 border-secondary shadow-[4px_4px_0px_0px_#934b19] rounded-xl p-section-padding rotate-1 relative">
          {/* Pin decoration */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-secondary rounded-full shadow-sm border-2 border-on-background flex items-center justify-center">
            <div className="w-2 h-2 bg-on-secondary-container rounded-full"></div>
          </div>
          
          <h2 className="font-headline-md text-headline-md text-center text-on-surface mb-8 -rotate-2">
            Staň se součástí posádky!
          </h2>

          {searchParams.error && (
            <p className="text-error bg-error-container p-3 font-label-mono text-center rounded mb-4 border-2 border-error">
              {searchParams.error}
            </p>
          )}

          <form action={signup} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-mono text-label-mono text-secondary flex items-center gap-2" htmlFor="username">
                <BadgeIcon className="w-5 h-5" />
                Jméno piráta
              </label>
              <input 
                className="bg-transparent border-0 border-b-4 border-dashed border-secondary focus:border-primary focus:border-solid rounded-none outline-none w-full py-2 font-label-mono text-body-lg text-on-surface" 
                id="username" 
                name="username" 
                placeholder="Např. Černovous..." 
                required 
                type="text"
              />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label className="font-label-mono text-label-mono text-secondary flex items-center gap-2" htmlFor="password">
                <Key className="w-5 h-5" />
                Heslo k pokladu
              </label>
              <input 
                className="bg-transparent border-0 border-b-4 border-dashed border-secondary focus:border-primary focus:border-solid rounded-none outline-none w-full py-2 font-label-mono text-body-lg text-on-surface" 
                id="password" 
                name="password" 
                placeholder="Tajné slovo..." 
                required 
                type="password"
              />
            </div>

            <button 
              className="bg-tertiary-fixed border-4 border-dashed border-on-background shadow-[6px_6px_0px_0px_#1f1c0b] active:shadow-[4px_4px_0px_0px_#1f1c0b] active:translate-x-1 active:translate-y-1 transition-all mt-8 w-full py-4 rounded-xl flex items-center justify-center gap-3 group" 
              type="submit"
            >
              <Anchor className="w-6 h-6 text-on-background group-hover:rotate-12 transition-transform" fill="currentColor" />
              <span className="font-headline-sm text-headline-sm text-on-background uppercase tracking-wider">
                Vstoupit do služeb
              </span>
            </button>
          </form>
        </div>

        <div className="mt-8 text-center -rotate-1">
          <Link href="/login" className="font-label-mono text-label-mono text-secondary hover:text-primary transition-colors underline decoration-2 underline-offset-4 decoration-dashed">
            Už jsem na palubě? Přihlásit se
          </Link>
        </div>
      </main>
    </div>
  );
}
