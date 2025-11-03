import { google } from '@ai-sdk/google';
import { embed, generateObject } from 'ai';
import { sql } from '@/lib/db';
import { z } from 'zod';

const EMBEDDING_MODEL = 'text-embedding-004';
const CHAT_MODEL = 'gemini-2.5-flash';

// Schema for structured profile output
const profileSchema = z.object({
  profiles: z.array(
    z.object({
      fullName: z.string().describe('Nombre completo del desarrollador'),
      jobTitle: z.string().describe('Puesto o cargo'),
      seniority: z.string().describe('Nivel de seniority'),
      area: z.string().describe('Área o departamento'),
      skills: z
        .array(z.string())
        .describe('Lista de habilidades técnicas principales'),
      contractType: z
        .array(z.string())
        .describe('Tipos de contrato disponibles'),
      location: z.string().describe('Ubicación'),
      office: z.string().describe('Oficina'),
      email: z.string().describe('Email de contacto'),
      profilePictureUrl: z
        .string()
        .optional()
        .describe('URL de la foto de perfil'),
      similarityScore: z.string().describe('Porcentaje de similitud'),
      summary: z
        .string()
        .describe(
          'Resumen breve del perfil profesional y por qué encaja con el requerimiento'
        ),
    })
  ),
});

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    // Generate embedding for the query
    const { embedding: queryEmbedding } = await embed({
      model: google.textEmbeddingModel(EMBEDDING_MODEL),
      value: message,
    });

    // Search for similar profiles using vector similarity
    const similarProfiles = await sql`
      SELECT
        record_id,
        content,
        metadata,
        1 - (embedding <=> ${JSON.stringify(queryEmbedding)}) as similarity
      FROM employee_profiles_techmatch
      ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}
      LIMIT 5
    `;

    // Build context for AI to parse
    const profilesContext = similarProfiles
      .map((profile: any, index: number) => {
        const metadata =
          typeof profile.metadata === 'string'
            ? JSON.parse(profile.metadata)
            : profile.metadata;
        const similarityScore = (profile.similarity * 100).toFixed(1);

        return `
Profile ${index + 1}:
${profile.content}
Additional Metadata:
- Email: ${metadata.email || 'N/A'}
- Location: ${metadata.location || 'N/A'}
- Office: ${metadata.office || 'N/A'}
- Profile Picture URL: ${metadata.profile_picture_url || 'N/A'}
- Similarity Score: ${similarityScore}%
---`;
      })
      .join('\n');

    // Use generateObject to structure the data
    const result = await generateObject({
      model: google(CHAT_MODEL),
      schema: profileSchema,
      prompt: `Analiza los siguientes perfiles de desarrolladores y estructura la información en el formato solicitado.

Requerimiento del usuario: "${message}"

Perfiles encontrados:
${profilesContext}

Instrucciones:
- Extrae toda la información estructurada de cada perfil
- Parsea las habilidades técnicas en un array limpio
- Incluye el similarity score de cada perfil
- Genera un resumen breve (2-3 oraciones) explicando por qué este perfil encaja con el requerimiento del usuario
- Mantén los datos exactos sin inventar información`,
    });

    return Response.json(result.object);
  } catch (error) {
    console.error('Error in search API:', error);
    return new Response('Error processing search', { status: 500 });
  }
}
