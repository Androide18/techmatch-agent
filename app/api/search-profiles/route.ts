import { hrAgent } from '@/lib/agents/hr-agent/graph';
import { streamObject } from 'ai';
import { getSelectedModelServer } from '@/lib/llm_model';
import { profileSchema } from './schema';

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    const agentResult = await hrAgent.invoke({ input });

    if (agentResult.error) {
      return Response.json(
        { error: 'Agent processing error', details: agentResult.error },
        { status: 500 }
      );
    }

    const model = await getSelectedModelServer();

    // Now stream the response directly using AI SDK
    const stream = streamObject({
      model,
      output: 'array',
      schema: profileSchema,
      temperature: 0,
      prompt: `Estructura la información de los siguientes perfiles de desarrolladores en formato JSON.

Perfiles encontrados:
${agentResult.context}

Reglas para estructurar la información:
- Solo puedes usar los perfiles que se encuentran en la lista anterior.
- No puede inventar información de los perfiles si no está en la lista.
- Describe cada perfil de manera concisa y clara, utilizando las habilidades y experiencia que se detallan en la lista anterior.
- Devuelve un array de objetos JSON.
- Cada objeto representa un perfil de desarrollador.
- Si no hay perfiles, devuelve un array vacío: [].
`,
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
