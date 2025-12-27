"use client";

import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export function CartDrawer({ slug }: { slug: string }) {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
      <h3 className="font-bold mb-2">Carrinho</h3>

      {items.map((item) => (
        <div key={item.id} className="flex justify-between mb-2 text-sm">
          <span>{item.name}</span>

          <div className="flex gap-2 items-center">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              -
            </button>

            <span>{item.quantity}</span>

            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              +
            </button>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between font-bold mt-2">
        <span>Total</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>

      <Link
        href={`/l/${slug}/checkout`}
        className="block mt-3 text-center bg-indigo-600 text-white py-2 rounded"
      >
        Finalizar pedido
      </Link>
    </div>
  );
}
