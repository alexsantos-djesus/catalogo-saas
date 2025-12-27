import { getStoreBySlug } from "@/lib/get-store-by-slug";
import { redirect } from "next/navigation";

export default async function StoreOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await getStoreBySlug(slug);
  if (!store) redirect("/dashboard");

  return (
    <div className="space-y-6">
      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl font-bold">Visão Geral</h1>
        <p className="text-sm text-gray-500">Informações básicas da sua loja</p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Nome da loja</p>
          <p className="font-semibold">{store.name}</p>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Status</p>
          <span
            className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
              store.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {store.isActive ? "Ativa" : "Inativa"}
          </span>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Slug</p>
          <p className="font-mono text-sm">{store.slug}</p>
        </div>
      </div>

      {/* LINK PÚBLICO */}
      <div className="bg-white border rounded-lg p-4">
        <p className="text-sm text-gray-500 mb-1">Link público do catálogo</p>
        <a
          href={`/l/${store.slug}`}
          target="_blank"
          className="text-indigo-600 break-all"
        >
          {`http://localhost:3000/l/${store.slug}`}
        </a>
      </div>
    </div>
  );
}
