const { prisma } = await import("@/lib/prisma");
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CatalogoClient } from "./CatalogoClient";

export const dynamic = "force-dynamic";

/* =========================
   TIPOS LOCAIS (OBRIGATÓRIO)
   ========================= */

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: string | null;
};

type StoreWithProducts = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  logoUrl: string | null;
  primaryColor: string | null;
  highlightText: string | null;
  products: Product[];
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CatalogoPublicoPage({ params }: PageProps) {
  const { slug } = await params;

  /* =========================
     QUERY COM SELECT (CRÍTICO)
     ========================= */

  const store: StoreWithProducts | null = await prisma.store.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
      logoUrl: true,
      primaryColor: true,
      highlightText: true,
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
          category: true,
        },
      },
    },
  });

  if (!store || !store.isActive) {
    notFound();
  }

  const primaryColor = store.primaryColor || "#4f46e5";

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* HEADER */}
      <header
        className="sticky top-0 z-10 border-b"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4 text-white">
          {store.logoUrl && (
            <img
              src={store.logoUrl}
              alt={store.name}
              className="w-11 h-11 rounded-md bg-white object-cover"
            />
          )}

          <div>
            <h1 className="text-xl font-semibold leading-tight">
              {store.name}
            </h1>
            {store.highlightText && (
              <p className="text-sm opacity-90">{store.highlightText}</p>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-6xl mx-auto px-4 py-8 pb-40">
        {store.products.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhum produto disponível no momento.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {store.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col overflow-hidden"
              >
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                )}

                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-medium text-sm text-gray-800 line-clamp-2">
                    {product.name}
                  </h2>

                  {product.category && (
                    <span className="text-xs text-gray-400 mt-1">
                      {product.category}
                    </span>
                  )}

                  <p
                    className="font-semibold text-base mt-3"
                    style={{ color: primaryColor }}
                  >
                    R$ {product.price.toFixed(2)}
                  </p>

                  <div className="mt-auto pt-4">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl ?? undefined,
                      }}
                      color={primaryColor}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CARRINHO */}
      <CatalogoClient slug={slug} />
    </div>
  );
}
