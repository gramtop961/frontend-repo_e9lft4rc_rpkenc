import { useMemo, useState } from "react";
import { BarChart2, Target, Lightbulb, Copy, CheckCircle2 } from "lucide-react";

function scoreTextQuality(text) {
  const len = text.trim().length;
  const hasNumbers = /\d/.test(text);
  const hasSecondPerson = /(tu|voi|you)\b/i.test(text);
  const hasCTA = /(commenta|scrivi|manda|clicca|salva|condividi|dimmi|link in bio|cta)/i.test(text);
  const hasSpecificity = /(in \d+ giorni|in \d+h|step|checklist|template|framework|swipe|carousel)/i.test(text);

  const hook = Math.min(
    100,
    Math.round(
      (hasNumbers ? 20 : 0) + (hasSecondPerson ? 30 : 10) + (hasCTA ? 20 : 0) + (hasSpecificity ? 30 : 10)
    )
  );
  const clarity = Math.min(100, Math.round(40 + Math.min(60, 120 - Math.abs(120 - len / 5))));
  const specificity = Math.min(100, Math.round((hasSpecificity ? 70 : 30) + (hasNumbers ? 15 : 0)));
  const shareability = Math.min(100, Math.round((hasCTA ? 50 : 25) + (len > 120 ? 15 : 5)));

  return { hook, clarity, specificity, shareability };
}

function analyzeImages(images = []) {
  const count = images.length;
  if (!count)
    return { count: 0, aspectConsistency: 0, tips: ["Aggiungi almeno 3–6 slide per un carosello efficace."] };

  const metas = images.map((f) => ({
    sizeKB: Math.round(f.size / 1024),
    name: f.name.toLowerCase(),
  }));

  const isStoryLike = metas.some((m) => m.name.includes("1080x1920") || m.name.includes("9x16"));
  const isSquareLike = metas.some((m) => m.name.includes("1080x1080") || m.name.includes("1x1"));
  const aspectConsistency = isStoryLike && isSquareLike ? 40 : 85;

  const sizeOk = metas.every((m) => m.sizeKB >= 100 && m.sizeKB <= 3000);

  const tips = [];
  if (count < 3) tips.push("Usa 5–8 slide per aumentare il tempo di permanenza e salvataggi.");
  if (aspectConsistency < 60) tips.push("Mantieni un formato coerente (1080x1350 o 1080x1080) per tutto il carosello.");
  if (!sizeOk) tips.push("Ottimizza il peso delle immagini per evitare compressioni aggressive.");
  tips.push("Prima slide = hook grande e leggibile. Ultima slide = CTA chiara.");

  return { count, aspectConsistency, tips };
}

function suggestHooks(text, niche) {
  const base = [
    "Il trucco che nessuno ti dice per...",
    "3 errori che ti stanno costando...",
    "Fai questo per raddoppiare...",
    "La checklist che uso per...",
    "Smetti di fare X. Prova questo invece.",
  ];

  const map = {
    marketing: [
      "7 hook che trasformano curiosi in clienti",
      "La formula AIDA per Reels che vendono",
      "Come scrivere CTA che fanno cliccare",
    ],
    fitness: [
      "Allenati 20' così e bruci il doppio",
      "3 errori che bloccano i tuoi progressi",
      "Meal prep semplice: schema in 5 step",
    ],
    finanza: [
      "Il metodo in 3 buste per risparmiare",
      "Come investire 200€ al mese senza ansia",
      "Evita queste trappole con le carte di credito",
    ],
    creator: [
      "Hook copiabili per far salvare i tuoi post",
      "Template di carousel ad alto retention",
      "Trasforma un'idea in 5 post in 10'",
    ],
  };

  const bank = [...base, ...(map[niche] || map.creator)];

  const kw = text.toLowerCase();
  const ranked = bank
    .map((h) => ({
      h,
      score:
        (kw.includes("errore") && h.includes("errori") ? 2 : 0) +
        (kw.includes("cta") && h.toLowerCase().includes("cta") ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.h);

  return Array.from(new Set(ranked)).slice(0, 6);
}

function generateSlidePlan(niche, text, imagesCount) {
  const baseLen = Math.max(5, Math.min(8, imagesCount || 7));
  const ideasByNiche = {
    marketing: [
      "Prova sociale (numeri/risultati)",
      "Mini-caso studio con 3 metriche",
      "Framework (AIDA/PAS) con esempi reali",
      "Errore comune e correzione step-by-step",
      "CTA con lead magnet (checklist/template)",
    ],
    fitness: [
      "Prima/dopo realistico con KPI (ripetizioni/pesi)",
      "Tecnica corretta vs errore più comune",
      "Schema allenamento 20' senza attrezzi",
      "Nutrizione: 3 swap facili a basso costo",
      "CTA con scheda gratuita",
    ],
    finanza: [
      "Budget in 3 buste con percentuali",
      "Interesse composto spiegato con grafico semplice",
      "Checklist anti-debito in 5 step",
      "Allocazione ETF esempio pratico",
      "CTA guida risparmio",
    ],
    creator: [
      "Gancio visivo forte (headline grande)",
      "Angolo controintuitivo con esempio",
      "Schema contenuti 5x5 (format x canale)",
      "Processo: idea → bozza → post",
      "CTA: DM per template",
    ],
  };

  const items = ideasByNiche[niche] || ideasByNiche.creator;
  const plan = [
    "Slide 1: Hook enorme + promessa chiara",
    ...items.slice(0, baseLen - 2).map((it, i) => `Slide ${i + 2}: ${it}`),
    `Slide ${baseLen}: Riepilogo + CTA specifica`,
  ];

  // Estrarre qualche keyword dal testo per personalizzare
  const kw = (text || "").toLowerCase().match(/[a-zà-ù]{4,}/gi) || [];
  const topKw = Array.from(new Set(kw)).slice(0, 5).join(", ");

  return { plan, topKw };
}

function rewriteCaption(text, niche, imagesCount) {
  const lines = text.trim().split(/\n+/).filter(Boolean);
  const rawHook = lines[0] || "Fai questo per raddoppiare i risultati";
  const { plan, topKw } = generateSlidePlan(niche, text, imagesCount);

  const nicheCTA = {
    marketing: "Scrivi 'CHECKLIST' e ti mando il template + un esempio in Notion.",
    fitness: "Commenta 'ALLENAMENTO' e ti invio la scheda + video forma corretta.",
    finanza: "Scrivi 'RISPARMIO' e ricevi la guida + foglio di calcolo.",
    creator: "Commenta 'HOOK' e ti mando 10 idee + template Canva.",
  };

  const angles = {
    marketing: ["costo opportunità", "riduzione attrito", "prova sociale"],
    fitness: ["consistenza > intensità", "progressive overload", "abitudini"],
    finanza: ["interesse composto", "spese invisibili", "allocazione semplice"],
    creator: ["pattern interrupt", "story utility", "documenta non creare"],
  };

  const promiseByNiche = {
    marketing: "più lead qualificati senza aumentare il budget",
    fitness: "migliorare performance e aderenza senza diete estreme",
    finanza: "mettere da parte ogni mese con meno frizione mentale",
    creator: "aumentare salvataggi e tempo di visualizzazione",
  };

  return (
    `HOOK: ${rawHook}\n` +
    `Promessa: ti mostro come ${promiseByNiche[niche] || promiseByNiche.creator}.\n\n` +
    `Perché funziona: focus su ${angles[niche]?.[0]}, ${angles[niche]?.[1]} e ${angles[niche]?.[2]}.\n` +
    (topKw ? `Parole chiave dal tuo testo: ${topKw}.\n\n` : "\n") +
    `Piano slide (${plan.length}):\n- ` + plan.join("\n- ") +
    `\n\nRiscrittura didascalia (compatibile IG):\n` +
    `${rawHook}. In questo post vedrai un processo semplice per ${promiseByNiche[niche] || promiseByNiche.creator}. ` +
    `Evitiamo errori comuni e ti lascio esempi pratici che puoi copiare oggi.\n\n` +
    `Cosa impari in breve:\n` +
    `• Framework facile da applicare\n` +
    `• Esempio reale passo-passo\n` +
    `• Mini-checklist da salvare\n\n` +
    `CTA: ${nicheCTA[niche] || nicheCTA.creator}\n\n` +
    `A/B test rapidi per il gancio (scegline 1):\n` +
    `1) [Numero]+[risultato]: "7 modi per..."\n` +
    `2) Controintuitivo: "Smetti di... fai questo"\n` +
    `3) Tempo/risorsa: "In 10' senza..."\n` +
    `Suggerimento visual: usa 1080×1350, contrasto alto, headline 5–7 parole.`
  ).trim();
}

export default function AnalysisResults({ payload }) {
  const { text = "", images = [], niche = "creator" } = payload || {};

  const textScores = useMemo(() => scoreTextQuality(text), [text]);
  const imgInsights = useMemo(() => analyzeImages(images), [images]);
  const hooks = useMemo(() => suggestHooks(text, niche), [text, niche]);
  const rewritten = useMemo(() => rewriteCaption(text, niche, images.length), [text, niche, images.length]);
  const [copied, setCopied] = useState(false);

  if (!text && (!images || images.length === 0)) {
    return null;
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.warn("Clipboard blocked", e);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 mt-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card title="Punteggi testo" icon={BarChart2}>
            <Scores scores={textScores} />
          </Card>

          <Card title="Suggerimenti hook per la nicchia" icon={Target}>
            <div className="grid sm:grid-cols-2 gap-2">
              {hooks.map((h, i) => (
                <div key={i} className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90">
                  {h}
                </div>
              ))}
            </div>
          </Card>

          <Card title="Riscrittura pronta (argomentata)" icon={Lightbulb}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/60">Ottimizzata per: {niche}</p>
              <button
                onClick={copy}
                className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
                  copied
                    ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-200"
                    : "border-white/10 bg-white/5 hover:bg-white/10 text-white/80"
                }`}
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copiato" : "Copia"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-white/90 leading-relaxed">{rewritten}</pre>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Analisi carosello" icon={BarChart2}>
            <ul className="list-disc pl-5 text-sm text-white/80 space-y-1">
              <li>Slide: {imgInsights.count}</li>
              <li>Coerenza formati: {imgInsights.aspectConsistency}%</li>
              {imgInsights.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 mb-3 text-white/90">
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Scores({ scores }) {
  const items = [
    { k: "Hook", v: scores.hook, c: "bg-pink-500" },
    { k: "Chiarezza", v: scores.clarity, c: "bg-indigo-500" },
    { k: "Specificità", v: scores.specificity, c: "bg-emerald-500" },
    { k: "Shareability", v: scores.shareability, c: "bg-amber-500" },
  ];

  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.k}>
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>{it.k}</span>
            <span>{it.v}%</span>
          </div>
          <div className="h-2 rounded bg-white/10 overflow-hidden">
            <div className={`h-full ${it.c}`} style={{ width: `${it.v}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
