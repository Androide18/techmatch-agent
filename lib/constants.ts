import { LLM_MODEL } from './llm_model';

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_MIME_TYPES = ['application/pdf'];

export const DEFAULT_LLM_MODEL_NAME = 'gemini-2.5-flash-lite' as LLM_MODEL;

export const SIMILARITY_THRESHOLD = 0.7;
