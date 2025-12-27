"use client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PersonalizacaoPage() {
  const { slug } = useParams<{ slug: string }>();

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [highlightText, setHighlightText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 CARREGAR PERSONALIZAÇÃO ATUAL
  useEffect(() => {
    if (!slug) return;

    fetch(`/api/stores/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setLogoUrl(data.logoUrl);
        setPrimaryColor(data.primaryColor || "#4f46e5");
        setHighlightText(data.highlightText || "");
      });
  }, [slug]);

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

  async function saveCustomization() {
    if (!slug) return;

    setLoading(true);

    await fetch(`/api/stores/${slug}/customization`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
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
        <label className="font-medium">Logo da loja</label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              uploadLogo(e.target.files[0]);
            }
          }}
        />

        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            className="w-20 h-20 object-cover rounded"
          />
        )}
      </div>

      {/* COR */}
      <div className="space-y-2">
        <label className="font-medium">Cor principal</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
      </div>

      {/* TEXTO */}
      <div className="space-y-2">
        <label className="font-medium">Texto de destaque</label>
        <textarea
          className="input"
          placeholder="Ex: Entregamos para toda a cidade"
          value={highlightText}
          onChange={(e) => setHighlightText(e.target.value)}
        />
      </div>

      <button
        onClick={saveCustomization}
        disabled={loading}
        className="btn-primary w-full"
      >
        Salvar personalização
      </button>
    </div>
  );
}
