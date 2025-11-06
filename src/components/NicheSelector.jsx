import { useState } from "react";
import { Target } from "lucide-react";

export default function NicheSelector({ value, onChange }) {
  const [niche, setNiche] = useState(value || "creator");

  const options = [
    { key: "creator", label: "Creator/Content" },
    { key: "marketing", label: "Marketing" },
    { key: "fitness", label: "Fitness" },
    { key: "finanza", label: "Finanza" },
  ];

  const set = (k) => {
    setNiche(k);
    onChange?.(k);
  };

  return (
    <section className="max-w-5xl mx-auto px-6 mt-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 mb-3 text-white/90">
          <Target className="h-4 w-4" />
          <h3 className="text-sm font-medium">Seleziona nicchia</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => set(o.key)}
              className={`px-3 py-1.5 rounded-md text-sm border ${
                niche === o.key
                  ? "bg-indigo-500 text-white border-transparent"
                  : "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
