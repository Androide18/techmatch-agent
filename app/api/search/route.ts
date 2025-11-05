import { google } from '@ai-sdk/google';
import { generateEmbedding } from './embedding';
import { buildMatchingProfilesContext, fetchMatchingProfiles } from './utils';
import { generateObject } from 'ai';
import { profileSchema } from './schema';

const CHAT_MODEL = 'gemini-2.5-flash-lite';

export async function POST(req: Request) {
  const message = await req.json();

  try {
    const queryEmbedding = await generateEmbedding({ query: message });

    const matchingProfiles = await fetchMatchingProfiles({
      embedding: queryEmbedding,
    });

    const context = buildMatchingProfilesContext(matchingProfiles);

    // Use generateObject to structure the data
    const result = await generateObject({
      model: google(CHAT_MODEL),
      output: 'array',
      schema: profileSchema,
      prompt: `
        Analiza los siguientes perfiles de desarrolladores y estructura la información en el formato solicitado.

        Requerimiento del usuario: "${message}"

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

    return Response.json(result.object);
  } catch (error) {
    console.error('Error in search API:', error);
    return new Response('Error processing search', { status: 500 });
  }
}
