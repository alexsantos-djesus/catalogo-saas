export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

const { prisma } = await import("@/lib/prisma");
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ ok: true });
}
