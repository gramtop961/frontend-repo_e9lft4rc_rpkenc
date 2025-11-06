import { useState } from "react";
import Header from "./components/Header";
import ContentInput from "./components/ContentInput";
import AnalysisResults from "./components/AnalysisResults";
import NicheSelector from "./components/NicheSelector";
import HowItWorks from "./components/HowItWorks";

export default function App() {
  const [payload, setPayload] = useState({ text: "", images: [], niche: "creator" });

  const handleAnalyze = ({ text, images }) => {
    setPayload((p) => ({ ...p, text, images }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />

      <main>
        <NicheSelector value={payload.niche} onChange={(n) => setPayload((p) => ({ ...p, niche: n }))} />
        <ContentInput onAnalyze={handleAnalyze} />
        <AnalysisResults payload={payload} />
        <HowItWorks />
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-10 text-xs text-white/50">
        Pro tip: usa un titolo di impatto nella prima slide, mantieni formati coerenti (1080×1350) e chiudi con una CTA specifica per la tua nicchia.
      </footer>
    </div>
  );
}
