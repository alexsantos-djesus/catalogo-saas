export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stores = await prisma.store.findMany({
    where: {
      owner: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(stores);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, whatsappNumber } = await req.json();

  // gerar slug base
  let slug = slugify(name);

  // garantir slug único
  let suffix = 1;
  while (
    await prisma.store.findUnique({
      where: { slug },
    })
  ) {
    slug = `${slugify(name)}-${suffix}`;
    suffix++;
  }

  const store = await prisma.store.create({
    data: {
      name,
      slug,
      whatsappNumber,
      owner: {
        connect: { email: session.user.email },
      },
    },
  });

  return NextResponse.json(store);
}
