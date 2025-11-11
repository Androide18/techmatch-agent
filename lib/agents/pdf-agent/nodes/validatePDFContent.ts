import { generateText } from 'ai';
import { getSelectedModel } from '@/lib/llm_model';
import { PdfAgentNode, PdfAgentStateType } from '../graph';

export const validateContent = async ({
  fileBuffer,
}: {
  fileBuffer: Buffer;
}): Promise<PdfAgentStateType> => {
  try {
    const { text: validationText } = await generateText({
      model: getSelectedModel(),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `
Does this PDF contain a job offer related to software development?
Answer only with "yes" or "no".
              `,
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

    const validationResult = validationText.trim().toLowerCase();
    const isContentValid = validationResult.startsWith('yes');

    if (!isContentValid) {
      return {
        error: {
          reason:
            'The PDF does not contain a valid software development job offer.',
          step: PdfAgentNode.ValidateContent,
        },
      };
    }

    return {
      validation: { contentValid: true },
    };
  } catch (error) {
    return {
      error: {
        reason: `Content validation failed: ${(error as Error).message}`,
        step: PdfAgentNode.ValidateContent,
      },
    };
  }
};
