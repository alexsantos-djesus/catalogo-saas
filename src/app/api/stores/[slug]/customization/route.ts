export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStoreOwner } from "@/lib/require-store-owner";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const store = await requireStoreOwner(slug);
  if (!store) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const updatedStore = await prisma.store.update({
    where: { id: store.id },
    data: {
      logoUrl: body.logoUrl ?? store.logoUrl,
      primaryColor: body.primaryColor ?? store.primaryColor,
      highlightText: body.highlightText ?? store.highlightText,
    },
  });

  return NextResponse.json(updatedStore);
}
