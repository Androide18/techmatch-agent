import { generateEmbedding } from '@/app/api/search-profiles/embedding';
import { HRAgentNode, HRAgentStateType } from '../graph';

export const generateInputEmbedding = async (
  state: HRAgentStateType
): Promise<HRAgentStateType> => {
  try {
    const { embedding, usage } = await generateEmbedding({
      query: state.input!,
    });

    return {
      inputEmbedding: embedding,
      tokenUsage: {
        ...state.tokenUsage,
        inputTokens: state.tokenUsage?.inputTokens || 0,
        outputTokens:
          (state.tokenUsage?.outputTokens || 0) + (usage.tokens || 0),
      },
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
