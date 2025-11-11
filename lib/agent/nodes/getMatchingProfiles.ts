import { AgentStateType, AgentNode } from '../graph';
import { sql } from '@/lib/db';
import { Profile } from '@/app/api/search-profiles/types';
import { SIMILARITY_THRESHOLD } from '@/lib/constants';

export const getMatchingProfiles = async (
  state: AgentStateType
): Promise<AgentStateType> => {
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
        step: AgentNode.GetMatchingProfiles,
      },
    };
  }
};
