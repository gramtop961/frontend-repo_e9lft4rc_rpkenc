import { Lightbulb, Target, MessageSquare } from "lucide-react";

export default function HowItWorks() {
  const items = [
    {
      icon: Lightbulb,
      title: "Analisi intelligente",
      desc: "Valutiamo hook, chiarezza, specificità e shareability del tuo testo per i formati Instagram.",
    },
    {
      icon: Target,
      title: "Suggerimenti immediati",
      desc: "Ricevi consigli pratici e una versione riscritta, pronta per Reels o Carousel.",
    },
    {
      icon: MessageSquare,
      title: "CTA che convertono",
      desc: "Chiudi con inviti all'azione chiari per aumentare salvataggi e condivisioni.",
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto py-10">
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <div key={i} className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-5">
            <it.icon className="h-6 w-6 text-fuchsia-600" />
            <h3 className="mt-3 font-semibold text-gray-900">{it.title}</h3>
            <p className="mt-1 text-gray-600 text-sm leading-relaxed">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
