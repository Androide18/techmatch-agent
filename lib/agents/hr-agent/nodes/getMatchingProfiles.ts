import { sql } from '@/lib/db';
import { Profile } from '@/app/api/search-profiles/types';
import { SIMILARITY_THRESHOLD } from '@/lib/constants';
import { HRAgentNode, HRAgentStateType } from '../graph';

export const getMatchingProfiles = async (
  state: HRAgentStateType
): Promise<HRAgentStateType> => {
  try {
    // Search for similar profiles using vector similarity
    const matchingProfiles = await sql<Array<Profile>>`
      SELECT * FROM (
        SELECT  
          record_id,
          content,
          metadata,
          1 - (embedding <=> ${JSON.stringify(
            state.inputEmbedding
          )}) as similarity
        FROM employee_profiles_techmatch
        ORDER BY similarity DESC
      ) t
      WHERE t.similarity > ${SIMILARITY_THRESHOLD}
    `;

    return {
      matchingProfiles: matchingProfiles ?? [],
    };
  } catch (error) {
    return {
      error: {
        reason: `Failed to fetch matching profiles: ${
          (error as Error).message
        }`,
        step: HRAgentNode.GetMatchingProfiles,
      },
    };
  }
};
