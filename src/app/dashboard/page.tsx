import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

/**
 * Tipo local da Store (somente o que a tela usa)
 * NÃO depende do Prisma Client
 * NÃO quebra no build
 */
type Store = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const stores: Store[] = await prisma.store.findMany({
    where: {
      owner: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Minhas Lojas</h1>

        <Link
          href="/dashboard/nova-loja"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Nova Loja
        </Link>
      </div>

      {stores.length === 0 ? (
        <p className="text-gray-500">Você ainda não criou nenhuma loja.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {stores.map((store) => (
            <div key={store.id} className="border rounded p-4 space-y-2">
              <h2 className="font-semibold">{store.name}</h2>
              <p className="text-sm text-gray-500">/l/{store.slug}</p>

              <Link
                href={`/dashboard/loja/${store.slug}`}
                className="text-indigo-600 text-sm"
              >
                Acessar dashboard
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
