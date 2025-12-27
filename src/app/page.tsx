import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">Catálogo SaaS 🚀</h1>

        <p className="text-gray-600">
          Crie catálogos profissionais para vender seus produtos diretamente
          pelo WhatsApp, sem complicação.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login" className="btn-primary text-center">
            Entrar
          </Link>

          <Link
            href="/register"
            className="border border-gray-300 py-2 px-4 rounded text-center hover:bg-gray-100"
          >
            Criar conta
          </Link>
        </div>

        <p className="text-xs text-gray-400">
          Ideal para quem vende pelo Instagram, WhatsApp ou Link na bio
        </p>
      </div>
    </main>
  );
}
