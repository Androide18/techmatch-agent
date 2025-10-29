import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();

  const results = await searchTechMatch(query);

  return NextResponse.json({ results });
}

async function searchTechMatch(query: string) {
  // Mocked search
  return [
    {
      id: 1,
      name: "Desarrollador Backend",
      skills: ["Node.js", "Express", "MongoDB"],
    },
    {
      id: 2,
      name: "Desarrollador Frontend",
      skills: ["React", "TypeScript", "CSS"],
    },
  ];
}
