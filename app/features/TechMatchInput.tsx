"use client";

import { useState } from "react";
import InputBase from "@/app/components/Input";
import { Button } from "../components/Button";

interface Result {
  id: number;
  name: string;
  skills: string[];
}

export default function TechMatchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  console.log("Results:", results);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto bg-bg p-6 rounded-[var(--radius)] shadow-[0_0_10px_var(--color-light-blue-shadow)]">
      <InputBase
        label="Escribe tu requerimiento"
        placeholder='Ej: "Necesito un backend con NestJS y AWS"'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full bg-[image:var(--color-left-to-right-gradient)] text-white hover:opacity-90"
      >
        {loading ? "Buscando..." : "Enviar"}
      </Button>
    </div>
  );
}
