export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { createTrelloCard } from "@/lib/trello";

export async function POST(req: Request) {
  const body = await req.json();

  const message = body.message;

  await createTrelloCard({
    name: `Pedido - ${body.customer}`,
    desc: message,
    listId: process.env.TRELLO_LIST_ID!,
  });

  return NextResponse.json({ ok: true });
}
