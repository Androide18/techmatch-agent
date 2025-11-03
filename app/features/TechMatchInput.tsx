"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="requirement-input">Escribe tu requerimiento</Label>
        <Input
          id="requirement-input"
          placeholder='Ej: "Necesito un backend con NestJS y AWS"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full sirius-gradient text-white hover:opacity-90"
      >
        {loading ? "Buscando..." : "Enviar"}
      </Button>
    </div>
  );
}
