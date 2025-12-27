"use client";

import { useRef } from "react";

type Props = {
  label: string;
  imageUrl?: string | null;
  onUpload: (file: File) => void;
};

export function ImageUpload({ label, imageUrl, onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onUpload(e.target.files[0]);
          }
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed rounded-lg p-4 text-sm text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition"
      >
        {imageUrl ? "Trocar imagem" : "Selecionar imagem"}
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="w-24 h-24 object-cover rounded border"
        />
      )}
    </div>
  );
}
