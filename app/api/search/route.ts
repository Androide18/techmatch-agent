import { google } from "@ai-sdk/google";
import { generateEmbedding } from "./embedding";
import { buildMatchingProfilesContext, fetchMatchingProfiles } from "./utils";
import { streamObject } from "ai";
import { profileSchema } from "./schema";
import { sql } from "@/lib/db";

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

    // Limit to top 3 most relevant profiles (for testing purposes)
    // ------------------------------------------------------------- //
    const topMatches = matchingProfiles.slice(0, 3);
    // Build context only with the top 3 matches
    const context = buildMatchingProfilesContext(topMatches);
    // ------------------------------------------------------------- //

    //  const context = buildMatchingProfilesContext(matchingProfiles);

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
      onFinish: async (response) => {
        const { inputTokens, outputTokens, reasoningTokens, totalTokens } =
          response.usage;

        // Replace undefined values with 0 (or another default value)
        const safeInputTokens = inputTokens ?? 0;
        const safeOutputTokens = outputTokens ?? 0;
        const safeReasoningTokens = reasoningTokens ?? 0;
        const safeTotalTokens = totalTokens ?? 0;

        // Save token usage in the database
        await sql`
          INSERT INTO token_usage (input_tokens, output_tokens, reasoning_tokens, total_tokens, source)
          VALUES (${safeInputTokens}, ${safeOutputTokens}, ${safeReasoningTokens}, ${safeTotalTokens}, 'matching-profiles-api')
        `;

        console.log("Token usage successfully saved in the database.");
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in search API:", error);
    return new Response("Error processing search", { status: 500 });
  }
}
