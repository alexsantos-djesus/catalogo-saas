"use client";

import { useCart } from "@/hooks/useCart";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

type AddToCartButtonProps = {
  product: Product;
  color?: string;
};

export function AddToCartButton({ product, color }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem(product)}
      className="w-full text-sm font-medium py-2 rounded-md text-white transition"
      style={{ backgroundColor: color ?? "#4f46e5" }}
    >
      Adicionar ao carrinho
    </button>
  );
}
