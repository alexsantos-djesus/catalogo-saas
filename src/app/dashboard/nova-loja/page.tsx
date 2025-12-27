"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NovaLojaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/stores", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        whatsappNumber: formData.get("whatsapp"),
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Criar nova loja</h1>

        <input
          name="name"
          placeholder="Nome da loja"
          className="input"
          required
        />

        <input
          name="whatsapp"
          placeholder="WhatsApp (ex: 11999999999)"
          className="input"
          required
        />

        <button disabled={loading} className="btn-primary w-full">
          Criar loja
        </button>
      </form>
    </div>
  );
}
