"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { ImageUpload } from "@/components/ui/ImageUpload";

export default function PersonalizacaoPage() {
  const { slug } = useParams<{ slug: string }>();

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [highlightText, setHighlightText] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadLogo(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLogoUrl(data.url);
  }

  async function save() {
    if (!slug) return;

    setLoading(true);

    await fetch(`/api/stores/${slug}/customization`, {
      method: "PATCH",
      body: JSON.stringify({
        logoUrl,
        primaryColor,
        highlightText,
      }),
    });

    setLoading(false);
    alert("Personalização salva!");
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Personalização</h1>

      {/* LOGO */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Logo</label>
        <ImageUpload
          label="Logo da loja"
          imageUrl={logoUrl}
          onUpload={uploadLogo}
        />

        {logoUrl && (
          <img src={logoUrl} className="w-20 h-20 object-cover rounded" />
        )}
      </div>

      {/* COR */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Cor principal</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
      </div>

      {/* TEXTO */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Texto de destaque</label>
        <textarea
          className="input"
          value={highlightText}
          onChange={(e) => setHighlightText(e.target.value)}
          placeholder="Ex: Entregamos em toda a cidade"
        />
      </div>

      <button onClick={save} disabled={loading} className="btn-primary w-full">
        Salvar
      </button>
    </div>
  );
}
