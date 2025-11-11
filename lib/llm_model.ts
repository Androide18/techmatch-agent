import { google } from '@ai-sdk/google';
import { DEFAULT_LLM_MODEL_NAME } from './constants';

const geminiAvailableModels = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
];

export const getSelectedModel = () => {
  // Get selected model from localStorage or default to constant
  const selectedModel = DEFAULT_LLM_MODEL_NAME;

  // Validate if the selected model is in the available models
  if (geminiAvailableModels.includes(selectedModel)) {
    return google(selectedModel);
  }

  return google(DEFAULT_LLM_MODEL_NAME);
};
