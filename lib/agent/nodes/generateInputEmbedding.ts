import { generateEmbedding } from '@/app/api/search-profiles/embedding';
import { AgentStateType, AgentNode } from '../graph';

export const generateInputEmbedding = async (
  state: AgentStateType
): Promise<AgentStateType> => {
  try {
    const inputEmbedding = await generateEmbedding({ query: state.userInput! });

    return {
      inputEmbedding,
    };
  } catch (error) {
    return {
      error: {
        reason: `Failed to generate input embedding: ${
          (error as Error).message
        }`,
        step: AgentNode.GenerateInputEmbedding,
      },
    };
  }
};
