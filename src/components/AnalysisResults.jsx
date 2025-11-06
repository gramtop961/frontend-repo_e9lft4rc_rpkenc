import { useMemo } from "react";
import { Star, Share2, Timer, ListChecks } from "lucide-react";

function ScoreBar({ label, score, color }) {
  const width = Math.min(100, Math.max(0, Math.round(score * 100)));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span className="font-semibold text-gray-800">{width}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalysisResults({ text }) {
  const analysis = useMemo(() => analyzeText(text), [text]);

  if (!text?.trim()) return null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 text-fuchsia-700 font-semibold">
            <Star className="h-4 w-4" /> Punteggi principali
          </div>
          <div className="space-y-3">
            <ScoreBar label="Hook iniziale" score={analysis.hookScore} color="bg-fuchsia-500" />
            <ScoreBar label="Chiarezza" score={analysis.clarityScore} color="bg-blue-500" />
            <ScoreBar label="Specificità" score={analysis.specificityScore} color="bg-emerald-500" />
            <ScoreBar label="Shareability" score={analysis.shareScore} color="bg-orange-500" />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3 text-fuchsia-700 font-semibold">
            <Share2 className="h-4 w-4" /> Suggerimenti rapidi
          </div>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {analysis.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3 text-fuchsia-700 font-semibold">
          <ListChecks className="h-4 w-4" /> Versione riscritta (più virale)
        </div>
        <p className="text-gray-800 leading-relaxed whitespace-pre-line">{analysis.rewrite}</p>
      </div>

      <div className="bg-white/60 backdrop-blur border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="h-4 w-4" />
          Analisi locale basata su euristiche semplici. Per insight avanzati, collega un modello nel backend.
        </div>
        <p>
          Suggerimento: usa frasi corte, numeri specifici, CTA chiara e struttura a elenco per carousels.
        </p>
      </div>
    </div>
  );
}

function analyzeText(text) {
  const t = text.trim();
  const sentences = t.split(/[.!?\n]+/).filter(Boolean);
  const words = t.split(/\s+/).filter(Boolean);
  const length = words.length;

  const hasNumber = /\b\d+[.,]?\d*\b/.test(t);
  const hasYou = /(tu|te|ti|voi|your|you)/i.test(t);
  const hasCTA = /(seguimi|salva|condividi|iscriviti|link in bio|commenta|scrivimi|dm|scorri|swipe|share|save)/i.test(t);
  const hasHook = /(nessuno te lo dice|se|3 cose|errore|trucco|non fare|ecco|come|perch[eé]|prima|dopo|in \d+|in meno di|scopri)/i.test(t.slice(0, 120));

  const hookScore = scoreNorm(hasHook ? 0.8 : 0.35 + Math.min(0.45, length / 200));
  const clarityScore = scoreNorm(1 - Math.min(0.6, avgSentenceLength(words, sentences) / 28));
  const specificityScore = scoreNorm((hasNumber ? 0.5 : 0.2) + Math.min(0.5, uniqueRatio(words)));
  const shareScore = scoreNorm((hasCTA ? 0.4 : 0.2) + (hasYou ? 0.2 : 0) + (hasHook ? 0.2 : 0));

  const tips = [];
  if (!hasHook) tips.push("Apri con un hook forte: numero specifico, promessa chiara o curiosità.");
  if (!hasNumber) tips.push("Aggiungi numeri o percentuali: aumentano credibilità e memoria.");
  if (avgSentenceLength(words, sentences) > 22) tips.push("Accorcia le frasi per migliorare la leggibilità nei Reels.");
  if (!hasCTA) tips.push("Chiudi con una CTA esplicita: 'Salva e condividi con un amico'.");
  if (!hasYou) tips.push("Parla direttamente alla persona: usa 'tu' o 'ti'.");
  if (tips.length === 0) tips.push("Ottimo lavoro! Raffina il ritmo con una pausa dopo l'hook e usa emoji mirate.");

  const rewrite = rewriteText(t);

  return { hookScore, clarityScore, specificityScore, shareScore, tips, rewrite };
}

function avgSentenceLength(words, sentences) {
  if (sentences.length === 0) return words.length;
  return words.length / sentences.length;
}

function uniqueRatio(words) {
  const set = new Set(words.map((w) => w.toLowerCase()))
  return set.size / Math.max(1, words.length);
}

function scoreNorm(x) {
  return Math.max(0, Math.min(1, x));
}

function rewriteText(text) {
  // Simple rewrite: punchy hook + bullets + CTA
  const base = text.replace(/\s+/g, " ").trim();
  const keyBenefit = base.match(/(risparmi|guadagni|impari|eviti|scopri|cresci|vendite|clienti)/i)?.[0] ?? "risultati concreti";

  const bullets = extractBullets(base);
  const bulletBlock = bullets.length
    ? bullets.map((b, i) => `• ${b}`).join("\n")
    : [
        "• Step 1: azione semplice e chiara",
        "• Step 2: esempio concreto",
        "• Step 3: risultato misurabile",
      ].join("\n");

  return (
    `Hook: In 30 secondi ti mostro come ottenere ${keyBenefit} — senza trucchi.` +
    "\n\n" +
    bulletBlock +
    "\n\n" +
    "Se ti è utile: salva il post e condividilo a chi sta lavorando su questo."
  );
}

function extractBullets(text) {
  const m = text.match(/(?:\d+\)|\-\s|•\s)([^\n]+)/g);
  if (!m) return [];
  return m.map((s) => s.replace(/^(\d+\)|\-|•)\s*/, "").trim()).slice(0, 5);
}
