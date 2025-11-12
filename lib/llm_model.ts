import { google } from '@ai-sdk/google';
import { DEFAULT_LLM_MODEL_NAME } from './constants';

const geminiAvailableModels = [
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
];

export type LLM_MODEL =
  | 'gemini-2.5-flash-lite'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-pro';

export const getSelectedModelServer = async () => {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const storedModel =
    (cookieStore.get('selectedModel')?.value as LLM_MODEL) || undefined;
  const selectedModel = storedModel ?? DEFAULT_LLM_MODEL_NAME;

  // Validate if the selected model is in the available models
  if (geminiAvailableModels.includes(selectedModel)) {
    return google(selectedModel);
  }

  return google(DEFAULT_LLM_MODEL_NAME);
};

export function getSelectedModelClient() {
  if (typeof document === 'undefined') return DEFAULT_LLM_MODEL_NAME;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('selectedModel='))
    ?.split('=')[1] as LLM_MODEL;
  return match ?? DEFAULT_LLM_MODEL_NAME;
}

export const modelCost = {
  'gemini-2.5-flash-lite': { input: 0.1 / 1_000_000, output: 0.4 / 1_000_000 },
  'gemini-2.5-flash': { input: 0.3 / 1_000_000, output: 2.5 / 1_000_000 },
  'gemini-2.5-pro': { input: 1.25 / 1_000_000, output: 10 / 1_000_000 },
};
