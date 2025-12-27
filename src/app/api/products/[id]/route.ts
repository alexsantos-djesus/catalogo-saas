import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { store: { include: { owner: true } } },
  });

  if (!product || product.store.owner.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.product.update({
    where: { id: product.id },
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
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { store: { include: { owner: true } } },
  });

  if (!product || product.store.owner.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.product.delete({
    where: { id: product.id },
  });

  return NextResponse.json({ ok: true });
}
