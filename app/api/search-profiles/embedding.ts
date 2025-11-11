import { google } from '@ai-sdk/google';
import { embed } from 'ai';

const EMBEDDING_MODEL = 'text-embedding-004';

export const generateEmbedding = async ({ query }: { query: string }) => {
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel(EMBEDDING_MODEL),
      value: query,
    });

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
};
