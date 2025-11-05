import { google } from '@ai-sdk/google';
import { embed } from 'ai';

const EMBEDDING_MODEL = 'text-embedding-004';

export const generateEmbedding = async ({ query }: { query: string }) => {
  const { embedding } = await embed({
    model: google.textEmbeddingModel(EMBEDDING_MODEL),
    value: query,
  });
  return embedding;
};
