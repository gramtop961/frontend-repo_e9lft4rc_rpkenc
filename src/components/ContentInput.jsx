import { useEffect, useRef, useState } from "react";
import { Clipboard, ImagePlus, UploadCloud, Wand2, X, Hash, Keyboard } from "lucide-react";

export default function ContentInput({ onAnalyze }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handlePaste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (t) setText(t);
    } catch (e) {
      console.warn("Clipboard blocked", e);
    }
  };

  const handleFiles = (files) => {
    const list = Array.from(files || [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 10);
    setImages(list);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAnalyze = () => {
    onAnalyze({ text, images });
  };

  const removeAt = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const sample = `HOOK: 7 idee di Reel che ti portano clienti in 24h\n\nSlide 1: Evita questi 3 errori\nSlide 2: Sii iper-specifico\nCTA: Scrivi "IDEA" e ti mando la lista`;

  const canAnalyze = text.trim().length > 0 || images.length > 0;

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "enter") {
        if (canAnalyze) handleAnalyze();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canAnalyze, text, images]);

  const charCount = text.length;

  return (
    <section className="max-w-5xl mx-auto px-6 -mt-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white/90">Testo</h3>
            <div className="flex gap-2">
              <button onClick={() => setText(sample)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30">
                <Wand2 className="h-3.5 w-3.5" /> Sample
              </button>
              <button onClick={handlePaste} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15">
                <Clipboard className="h-3.5 w-3.5" /> Incolla
              </button>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Incolla la didascalia o il copione del Reel..."
              className="w-full h-48 bg-transparent border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <div className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 inline-flex items-center gap-1">
              <Hash className="h-3 w-3" /> {charCount}
            </div>
          </div>
          <p className="mt-2 text-[11px] text-white/50 inline-flex items-center gap-1">
            <Keyboard className="h-3 w-3" /> Shortcut: Ctrl/Cmd+Enter per analizzare
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white/90">Carosello (immagini)</h3>
            <div className="text-xs text-white/60">{images.length}/10</div>
            <button onClick={() => inputRef.current?.click()} className="ml-auto inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15">
              <UploadCloud className="h-3.5 w-3.5" /> Carica
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            className={`border border-dashed rounded-lg p-4 text-white/60 text-sm flex flex-col items-center justify-center gap-2 min-h-[160px] transition-colors ${
              dragOver ? "border-indigo-400 bg-indigo-500/10" : "border-white/15"
            }`}
          >
            <ImagePlus className="h-5 w-5" />
            Trascina fino a 10 immagini oppure clicca su Carica.
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 w-full mt-3">
                {images.map((img, i) => (
                  <Preview key={i} file={img} idx={i} onRemove={() => removeAt(i)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${
            canAnalyze ? "bg-indigo-500 hover:bg-indigo-600" : "bg-white/10 text-white/40 cursor-not-allowed"
          }`}
        >
          Analizza
        </button>
      </div>
    </section>
  );
}

function Preview({ file, idx, onRemove }) {
  const [src, setSrc] = useState("");
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      setMeta({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative group">
      {src && (
        <img
          src={src}
          alt={`slide-${idx + 1}`}
          className="w-full h-20 object-cover rounded border border-white/10"
        />
      )}
      {meta && (
        <div className="absolute bottom-1 left-1 text-[10px] px-1 py-0.5 bg-black/60 rounded text-white/80">
          {meta.w}×{meta.h}
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 hover:bg-black text-white rounded-full p-1"
        aria-label="Rimuovi immagine"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
