import { google } from "@ai-sdk/google";
import { generateEmbedding } from "./embedding";
import { buildMatchingProfilesContext, fetchMatchingProfiles } from "./utils";
import { streamObject } from "ai";
import { profileSchema } from "./schema";

const CHAT_MODEL = "gemini-2.5-flash-lite";

export async function POST(req: Request) {
  try {
    const message = await req.json();
    const userQuery =
      typeof message === "string" ? message : message.input || "";

    if (!userQuery || typeof userQuery !== "string") {
      return new Response("Invalid input", { status: 400 });
    }

    const queryEmbedding = await generateEmbedding({ query: userQuery });

    const matchingProfiles = await fetchMatchingProfiles({
      embedding: queryEmbedding,
    });

    const context = buildMatchingProfilesContext(matchingProfiles);

    // Use generateObject to structure the data
    const result = await streamObject({
      model: google(CHAT_MODEL),
      output: "array",
      schema: profileSchema,
      temperature: 0,
      prompt: `
        Estructura la información de los siguientes perfiles de desarrolladores en el formato solicitado.

        Requerimiento del usuario: "${userQuery}"

        Perfiles encontrados:
        ${context}

        Instrucciones:
        - Extrae toda la información estructurada de cada perfil
        - Parsea las habilidades técnicas en un array limpio
        - Incluye el similarity score de cada perfil
        - Genera un resumen breve (2-3 oraciones) explicando por qué este perfil encaja con el requerimiento del usuario
        - Mantén los datos exactos sin inventar información
        - Si no hay perfiles que coincidan, devuelve un array vacío
      `,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in search API:", error);
    return new Response("Error processing search", { status: 500 });
  }
}
