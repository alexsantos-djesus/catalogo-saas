"use client";

import { CartDrawer } from "@/components/cart/CartDrawer";

type Props = {
  slug: string;
};

export function CatalogoClient({ slug }: Props) {
  return <CartDrawer slug={slug} />;
}
