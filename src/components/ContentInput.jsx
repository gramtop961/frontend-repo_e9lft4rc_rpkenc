import { useRef, useState } from "react";
import { Clipboard, ImagePlus, UploadCloud, Wand2 } from "lucide-react";

export default function ContentInput({ onAnalyze }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
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
    handleFiles(e.dataTransfer.files);
  };

  const handleAnalyze = () => {
    onAnalyze({ text, images });
  };

  const sample = `HOOK: 7 idee di Reel che ti portano clienti in 24h\n\nSlide 1: Evita questi 3 errori\nSlide 2: Sii iper-specifico\nCTA: Scrivi \"IDEA\" e ti mando la lista`;

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
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Incolla la didascalia o il copione del Reel..."
            className="w-full h-40 bg-transparent border border-white/10 rounded-lg p-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-white/90">Carosello (immagini)</h3>
            <button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/15">
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
            onDragOver={(e) => e.preventDefault()}
            className="border border-dashed border-white/15 rounded-lg p-4 text-white/60 text-sm flex flex-col items-center justify-center gap-2 min-h-[160px]"
          >
            <ImagePlus className="h-5 w-5" />
            Trascina fino a 10 immagini oppure clicca su Carica.
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 w-full mt-3">
                {images.map((img, i) => (
                  <Preview key={i} file={img} idx={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button onClick={handleAnalyze} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600">
          Analizza
        </button>
      </div>
    </section>
  );
}

function Preview({ file, idx }) {
  const [src, setSrc] = useState("");
  const [meta, setMeta] = useState(null);

  // Create a local URL and read intrinsic size once
  useState(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    const img = new Image();
    img.onload = () => {
      setMeta({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = url;
  }, []);

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
    </div>
  );
}
