import { generateEmbedding } from '@/app/api/search-profiles/embedding';
import { HRAgentNode, HRAgentStateType } from '../graph';

export const generateInputEmbedding = async (
  state: HRAgentStateType
): Promise<HRAgentStateType> => {
  try {
    const inputEmbedding = await generateEmbedding({
      query: state.input!,
    });

    return {
      inputEmbedding,
    };
  } catch (error) {
    return {
      error: {
        reason: `Failed to generate input embedding: ${
          (error as Error).message
        }`,
        step: HRAgentNode.GenerateInputEmbedding,
      },
    };
  }
};
