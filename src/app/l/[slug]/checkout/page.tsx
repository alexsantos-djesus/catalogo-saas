"use client";

import { useCart } from "@/hooks/useCart";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const { items, total, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [storeWhatsapp, setStoreWhatsapp] = useState<string | null>(null);

  // 🔹 Buscar WhatsApp da loja
  useEffect(() => {
    if (!slug) return;

    fetch(`/api/public/stores/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setStoreWhatsapp(data.whatsappNumber);
      });
  }, [slug]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carrinho vazio.</p>
      </div>
    );
  }

  function generateMessage() {
    let message = `🛒 *Novo pedido*\n\n`;
    message += `👤 Cliente: ${name}\n`;
    message += `📱 WhatsApp: ${phone}\n\n`;
    message += `📦 *Itens do pedido:*\n`;

    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} — R$ ${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });

    message += `\n💰 *Total:* R$ ${total.toFixed(2)}\n`;

    if (notes) {
      message += `\n📝 Observações:\n${notes}\n`;
    }

    return encodeURIComponent(message);
  }

  function handleFinish() {
    if (!storeWhatsapp) return;

    const text = generateMessage();
    const url = `https://wa.me/${storeWhatsapp}?text=${text}`;

    clearCart();
    window.location.href = url;
  }

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Finalizar Pedido</h1>

      {/* Dados do cliente */}
      <div className="space-y-3">
        <input
          placeholder="Seu nome"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="WhatsApp (ex: 11999999999)"
          className="input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          placeholder="Observações (opcional)"
          className="input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Resumo */}
      <div className="border rounded p-4 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.quantity}x {item.name}
            </span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div className="font-bold flex justify-between pt-2 border-t">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleFinish}
        disabled={!name || !phone || !storeWhatsapp}
        className="btn-primary w-full"
      >
        Enviar pedido pelo WhatsApp
      </button>
    </div>
  );
}
