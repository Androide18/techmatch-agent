import { pdfAgent } from '@/lib/agents/pdf-agent/graph';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const agentResult = await pdfAgent.invoke({ formData });

    // Check if there was an error during processing
    if (agentResult.error) {
      return Response.json(
        {
          error: 'PDF processing failed',
          details: agentResult.error.reason,
          step: agentResult.error.step,
        },
        { status: 400 }
      );
    }

    // Return the generated prompt
    return Response.json({
      prompt: agentResult.generatedPrompt,
    });
  } catch (error) {
    console.error('Error in process-pdf API:', error);
    return Response.json(
      {
        error: 'Error processing PDF',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
