import { Rocket, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full max-w-5xl mx-auto text-center py-10">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-100 to-blue-100 text-fuchsia-700 text-sm font-medium mb-4">
        <Sparkles className="h-4 w-4" />
        Viral Content Optimizer
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
        Potenzia i tuoi contenuti per Instagram
      </h1>
      <p className="mt-4 text-gray-600 text-lg">
        Incolla una didascalia o uno script: ti daremo feedback immediato e consigli pratici per aumentare hook, chiarezza e shareability.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 text-fuchsia-600 font-semibold">
        <Rocket className="h-5 w-5" />
        Ottimizzato per Reels, Carousel e Stories
      </div>
    </header>
  );
}
