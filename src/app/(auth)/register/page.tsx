"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Criar conta</h1>

        <input name="name" placeholder="Nome" className="input" required />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="input"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          className="input"
          required
        />

        <button className="btn-primary w-full" disabled={loading}>
          Criar conta
        </button>
      </form>
    </div>
  );
}
