import { generateText } from 'ai';
import { getSelectedModelServer } from '@/lib/llm_model';
import { HRAgentStateType, HRAgentNode } from '../graph';

export const validateTextInput = async (
  state: HRAgentStateType
): Promise<HRAgentStateType> => {
  if (!state.input || typeof state.input !== 'string') {
    return {
      error: {
        reason: 'Text input is either missing or not a string.',
        step: HRAgentNode.ValidateTextInput,
      },
    };
  }

  const model = await getSelectedModelServer();

  const { text } = await generateText({
    model,
    prompt: `You are validating user text input. The input must be referring to a software developer job description.
If the input is valid, respond ONLY with "yes". If the input is invalid, respond with a brief reason why is not valid.

User Input: "${state.input}"`,
  });

  const isValid = text.toLowerCase().includes('yes');

  if (!isValid) {
    return {
      validation: { isValid: false },
      error: {
        step: HRAgentNode.ValidateTextInput,
        reason: text.trim(),
      },
    };
  }

  return {
    validation: { isValid: true },
  };
};
