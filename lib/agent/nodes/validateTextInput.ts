import { generateText } from 'ai';
import { AgentStateType, AgentNode } from '../graph';
import { getSelectedModel } from '@/lib/llm_model';

export const validateTextInput = async (
  state: AgentStateType
): Promise<AgentStateType> => {
  if (!state.userInput || typeof state.userInput !== 'string') {
    return {
      error: {
        reason: 'Text input is either missing or not a string.',
        step: AgentNode.ValidateTextInput,
      },
    };
  }

  const { text } = await generateText({
    model: getSelectedModel(),
    prompt: `You are validating user text input. The input must be referring to a software developer job description.
If the input is valid, respond ONLY with "yes". If the input is invalid, respond with a brief reason why is not valid.

User Input: "${state.userInput}"`,
  });

  const isValid = text.toLowerCase().includes('yes');

  if (!isValid) {
    return {
      inputValidation: { isValid: false },
      error: {
        step: AgentNode.ValidateTextInput,
        reason: text.trim(),
      },
    };
  }

  return {
    inputValidation: { isValid: true },
  };
};
