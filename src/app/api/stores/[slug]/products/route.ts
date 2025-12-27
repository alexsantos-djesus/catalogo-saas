export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStoreOwner } from "@/lib/require-store-owner";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const store = await requireStoreOwner(slug);
  if (!store) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const store = await requireStoreOwner(slug);
    if (!store) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    console.log("BODY RECEBIDO:", body);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: Number(body.price),
        description: body.description,
        imageUrl: body.imageUrl,
        category: body.category,
        storeId: store.id,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("ERRO AO CRIAR PRODUTO:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
