export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string; id: string }>;
  }
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
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

  if (!product || product.store.owner.email !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      isActive: !product.isActive,
    },
  });

  return NextResponse.json(updated);
}
