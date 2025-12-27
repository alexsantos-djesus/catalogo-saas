"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ImageUpload } from "@/components/ui/ImageUpload";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  isActive: boolean;
};

export default function ProdutosPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // ✅ ESTADO DA IMAGEM
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // ======================
  // LOAD PRODUCTS
  // ======================
  async function loadProducts() {
    if (!slug) return;

    const res = await fetch(`/api/stores/${slug}/products`);
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, [slug]);

  // ======================
  // UPLOAD IMAGE
  // ======================
  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setImageUrl(data.url);
  }

  // ======================
  // CREATE / UPDATE
  // ======================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!slug) return;

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      price: formData.get("price"),
      description: formData.get("description"),
      category: formData.get("category"),
      imageUrl,
    };

    if (editing) {
      await fetch(`/api/products/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setEditing(null);
    } else {
      await fetch(`/api/stores/${slug}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    setLoading(false);
    setImageUrl(null);
    (e.target as HTMLFormElement).reset();
    loadProducts();
  }

  // ======================
  // DELETE
  // ======================
  async function deleteProduct(id: string) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    await fetch(`/api/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  // ======================
  // TOGGLE ACTIVE
  // ======================
  async function toggleProduct(id: string) {
    await fetch(`/api/products/${id}/toggle`, { method: "PATCH" });
    loadProducts();
  }

  // ======================
  // EDIT MODE
  // ======================
  function startEditing(product: Product) {
    setEditing(product);
    setImageUrl(product.imageUrl || null);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Produtos</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input
          name="name"
          placeholder="Nome"
          className="input"
          defaultValue={editing?.name}
          required
        />

        <input
          name="price"
          placeholder="Preço"
          className="input"
          defaultValue={editing?.price}
          required
        />

        {/* CATEGORIA */}
        <select
          name="category"
          className="input"
          defaultValue={editing?.category || ""}
          required
        >
          <option value="" disabled>
            Selecione a categoria
          </option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </select>

        {/* UPLOAD DE IMAGEM */}
        <ImageUpload
          label="Imagem do produto"
          imageUrl={imageUrl}
          onUpload={(file) => uploadImage(file)}
        />

        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="w-24 h-24 object-cover rounded"
          />
        )}

        <textarea
          name="description"
          placeholder="Descrição"
          className="input"
          defaultValue={editing?.description}
        />

        <button disabled={loading} className="btn-primary w-full">
          {editing ? "Salvar alterações" : "Adicionar produto"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setImageUrl(null);
            }}
            className="text-sm text-gray-500 w-full"
          >
            Cancelar edição
          </button>
        )}
      </form>

      {/* LISTA */}
      <div className="space-y-4">
        {products.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhum produto cadastrado ainda.
          </p>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 flex justify-between"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-gray-500">
                R$ {product.price.toFixed(2)}
              </p>
              {product.category && (
                <p className="text-xs text-gray-400">{product.category}</p>
              )}
            </div>

            <div className="flex gap-2 text-sm">
              <button onClick={() => startEditing(product)}>Editar</button>

              <button onClick={() => toggleProduct(product.id)}>
                {product.isActive ? "Desativar" : "Ativar"}
              </button>

              <button
                onClick={() => deleteProduct(product.id)}
                className="text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
