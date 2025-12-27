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
  const [loadingStore, setLoadingStore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Buscar WhatsApp da loja (API pública)
  useEffect(() => {
    if (!slug) return;

    async function loadStore() {
      try {
        setLoadingStore(true);
        setError(null);

        const res = await fetch(`/api/public/stores/${slug}`);

        if (!res.ok) {
          throw new Error("Loja não encontrada");
        }

        const data = await res.json();

        if (!data?.whatsappNumber) {
          throw new Error("WhatsApp da loja não configurado");
        }

        setStoreWhatsapp(data.whatsappNumber);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os dados da loja.");
        setStoreWhatsapp(null);
      } finally {
        setLoadingStore(false);
      }
    }

    loadStore();
  }, [slug]);

  // 🛒 Carrinho vazio
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carrinho vazio.</p>
      </div>
    );
  }

  // ⏳ Carregando dados da loja
  if (loadingStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando checkout...</p>
      </div>
    );
  }

  // ❌ Erro ao carregar loja
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
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

  async function handleFinish() {
    if (!storeWhatsapp) return;

    const url = `https://wa.me/${storeWhatsapp}?text=${generateMessage()}`;

    // 🔥 FUTURO: aqui entra Trello / salvar pedido
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
        className="btn-primary w-full disabled:opacity-50"
      >
        Enviar pedido pelo WhatsApp
      </button>
    </div>
  );
}
