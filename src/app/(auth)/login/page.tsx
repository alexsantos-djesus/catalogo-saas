"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!res?.error) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Entrar</h1>

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

        <button className="btn-primary w-full">Entrar</button>
      </form>
    </div>
  );
}
