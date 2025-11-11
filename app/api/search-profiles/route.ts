import { agent } from '@/lib/agent/graph';
import { streamObject } from 'ai';
import { getSelectedModel } from '@/lib/llm_model';
import { profileSchema } from './schema';

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();

    // Run LangGraph agent to completion (validation, embedding, retrieval, context building)
    const agentResult = await agent.invoke({ userInput });

    if (agentResult.error) {
      return Response.json(
        { error: 'Agent processing error', details: agentResult.error },
        { status: 500 }
      );
    }

    // Now stream the response directly using AI SDK
    const stream = streamObject({
      model: getSelectedModel(),
      output: 'array',
      schema: profileSchema,
      temperature: 0,
      prompt: `Estructura la información de los siguientes perfiles de desarrolladores en formato JSON.

Requerimiento del usuario: "${agentResult.userInput}"

Perfiles encontrados:
${agentResult.context}

IMPORTANTE:
- Devuelve SOLO los perfiles que sean relevantes para el requerimiento
- Ordena los perfiles por relevancia (más relevante primero)
- El campo "similarityScore" debe reflejar el porcentaje de coincidencia con el requerimiento
- El campo "summary" debe explicar POR QUÉ este perfil encaja con el requerimiento específico del usuario`,
    });

    // Return the stream in the format expected by useObject
    return stream.toTextStreamResponse();
  } catch (error) {
    console.error('Error in search API:', error);
    return new Response(
      JSON.stringify({
        error: 'Error processing search request',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
