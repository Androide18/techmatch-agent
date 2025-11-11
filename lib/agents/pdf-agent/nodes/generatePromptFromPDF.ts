import { generateText } from 'ai';
import { getSelectedModel } from '@/lib/llm_model';
import { PdfAgentNode, PdfAgentStateType } from '../graph';

export const generatePromptFromPDF = async ({
  fileBuffer,
}: {
  fileBuffer: Buffer;
}): Promise<PdfAgentStateType> => {
  try {
    const { text: generatedPrompt } = await generateText({
      model: getSelectedModel(),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Read the attached job description PDF and summarize it in Spanish, in the style of: "Necesito desarrollador experto en React y Tailwind".`,
            },
            {
              type: 'file',
              data: fileBuffer,
              mediaType: 'application/pdf',
            },
          ],
        },
      ],
    });

    const input = generatedPrompt.trim();

    return { generatedPrompt: input };
  } catch (error) {
    return {
      error: {
        reason: `Failed to generate prompt from PDF: ${
          (error as Error).message
        }`,
        step: PdfAgentNode.GenerateUserPromptFromPDF,
      },
    };
  }
};
