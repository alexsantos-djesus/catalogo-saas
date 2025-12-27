"use client";

import { useCart } from "@/hooks/useCart";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(product)}
      className="mt-2 bg-indigo-600 text-white text-sm py-1.5 rounded hover:bg-indigo-700"
    >
      Adicionar ao carrinho
    </button>
  );
}
