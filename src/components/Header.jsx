import { Sparkles, Camera } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full py-10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-white/80 bg-white/5">
          <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
          <span>IG Growth Assistant</span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          Analizza didascalie e caroselli. Ottimizza gli hook per la tua nicchia.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-white/70 max-w-3xl">
          Incolla il testo, carica le slide e ricevi suggerimenti immediati su hook, chiarezza, contrasto visivo, e riscritture pronte per la pubblicazione.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-500/10 text-indigo-200 px-3 py-2 text-sm">
          <Camera className="h-4 w-4" />
          Supporto a caroselli multi–slide con analisi base del contrasto e del rapporto d’aspetto.
        </div>
      </div>
    </header>
  );
}
