export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
const { prisma } = await import("@/lib/prisma");
import { getSessionUser } from "@/lib/get-session-user";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      store: {
        include: {
          owner: true,
        },
      },
    },
  });

  if (!product || product.store.owner.email !== user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      price: Number(body.price),
      description: body.description,
      imageUrl: body.imageUrl,
      category: body.category,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      store: {
        include: {
          owner: true,
        },
      },
    },
  });

  if (!product || product.store.owner.email !== user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.product.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
