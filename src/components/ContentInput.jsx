import { useState } from "react";
import { Upload, ClipboardPaste } from "lucide-react";

export default function ContentInput({ onAnalyze }) {
  const [text, setText] = useState("");

  const handlePaste = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      if (clip) setText(clip);
    } catch (e) {
      // Ignore clipboard errors silently
    }
  };

  const handleSample = () => {
    const sample = "Scopri 5 abitudini semplici che ti faranno risparmiare 300€ al mese. La numero 4 nessuno te la dice.";
    setText(sample);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-4 md:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Incolla qui la tua didascalia o script..."
            className="flex-1 min-h-[140px] w-full resize-y rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex gap-2">
            <button
              onClick={handlePaste}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
            >
              <ClipboardPaste className="h-4 w-4" /> Incolla
            </button>
            <button
              onClick={handleSample}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
            >
              Usa esempio
            </button>
          </div>
          <button
            onClick={() => onAnalyze(text)}
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white text-sm font-semibold"
          >
            <Upload className="h-4 w-4" /> Analizza contenuto
          </button>
        </div>
      </div>
    </div>
  );
}
