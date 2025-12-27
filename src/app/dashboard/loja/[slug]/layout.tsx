import Link from "next/link";
import { getStoreBySlug } from "@/lib/get-store-by-slug";
import { redirect } from "next/navigation";

export default async function StoreDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await getStoreBySlug(slug);

  if (!store) {
    redirect("/dashboard");
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/l/${store.slug}`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">{store.name}</h2>

          <a
            href={publicUrl}
            target="_blank"
            className="text-sm text-indigo-600 break-all hover:underline"
          >
            {publicUrl}
          </a>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          <SidebarLink href={`/dashboard/loja/${slug}`} label="Visão geral" />
          <SidebarLink
            href={`/dashboard/loja/${slug}/produtos`}
            label="Produtos"
          />
          <SidebarLink
            href={`/dashboard/loja/${slug}/personalizacao`}
            label="Personalização"
          />
          <SidebarLink
            href={`/dashboard/loja/${slug}/configuracoes`}
            label="Configurações"
          />
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded hover:bg-indigo-50 hover:text-indigo-700 transition"
    >
      {label}
    </Link>
  );
}
