"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

export default function ConfiguracoesPage() {
  const { slug } = useParams<{ slug: string }>();

  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!slug) return;

    setLoading(true);

    await fetch(`/api/stores/${slug}`, {
      method: "PATCH",
      body: JSON.stringify({
        whatsappNumber: whatsapp,
      }),
    });

    setLoading(false);
    alert("Configurações salvas!");
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium">WhatsApp da loja</label>
        <input
          className="input"
          placeholder="5511999999999"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </div>

      <button onClick={save} disabled={loading} className="btn-primary w-full">
        Salvar
      </button>
    </div>
  );
}
