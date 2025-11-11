import { generateText } from 'ai';
import { AgentNode, AgentStateType } from '../graph';
import { getSelectedModel } from '@/lib/llm_model';

export const generatePromptFromPDF = async ({
  fileBuffer,
}: {
  fileBuffer: Buffer;
}): Promise<AgentStateType> => {
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

    const userInput = generatedPrompt.trim();

    return { userInput: userInput };
  } catch (error) {
    return {
      error: {
        reason: `Failed to generate prompt from PDF: ${
          (error as Error).message
        }`,
        step: AgentNode.GenerateUserPromptFromPDF,
      },
    };
  }
};
