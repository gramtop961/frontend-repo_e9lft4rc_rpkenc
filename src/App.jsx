import { useState } from "react";
import Header from "./components/Header";
import ContentInput from "./components/ContentInput";
import AnalysisResults from "./components/AnalysisResults";
import HowItWorks from "./components/HowItWorks";

function App() {
  const [text, setText] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-blue-50">
      <div className="px-4 md:px-6">
        <Header />
        <ContentInput onAnalyze={(t) => setText(t)} />
        <AnalysisResults text={text} />
        <HowItWorks />
        <footer className="w-full max-w-5xl mx-auto py-10 text-center text-sm text-gray-500">
          Creato per aiutarti a creare contenuti che meritano di essere condivisi.
        </footer>
      </div>
    </div>
  );
}

export default App;
