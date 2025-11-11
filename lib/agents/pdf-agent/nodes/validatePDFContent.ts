import { generateText } from 'ai';
import { getSelectedModelServer } from '@/lib/llm_model';
import { PdfAgentNode, PdfAgentStateType } from '../graph';

export const validateContent = async (
  state: PdfAgentStateType
): Promise<PdfAgentStateType> => {
  try {
    const model = await getSelectedModelServer();
    const { text: validationText, usage } = await generateText({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Does this PDF contain a job offer related to software development? Answer only with "yes" or "no".`,
            },
            {
              type: 'file',
              data: state.fileBuffer as Buffer,
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
      tokenUsage: {
        ...state.tokenUsage,
        inputTokens:
          (state.tokenUsage?.inputTokens || 0) + (usage.inputTokens || 0),
        outputTokens:
          (state.tokenUsage?.outputTokens || 0) + (usage.outputTokens || 0),
      },
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
