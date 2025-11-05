import { sql } from '@/lib/db';
import { Profile } from './types';

export const fetchMatchingProfiles = async ({
  embedding,
}: {
  embedding: Array<number>;
}) => {
  // Search for similar profiles using vector similarity
  const matchingProfiles = await sql<Array<Profile>>`
    SELECT * FROM (
      SELECT  
        record_id,
        content,
        metadata,
        1 - (embedding <=> ${JSON.stringify(embedding)}) as similarity
      FROM employee_profiles_techmatch
      ORDER BY similarity DESC
    ) t
    WHERE t.similarity > 0.62
  `;

  return matchingProfiles;
};

export const buildMatchingProfilesContext = (
  profiles: Array<Profile>
): string => {
  return profiles.map(buildProfileContext).join('\n');
};

export const buildProfileContext = (profile: Profile, index: number) => {
  const similarityScore = (profile.similarity * 100).toFixed(1);

  const metadata =
    typeof profile.metadata === 'string'
      ? JSON.parse(profile.metadata)
      : profile.metadata;

  return `
    Profile ${index + 1}:
    ${profile.content}

    Additional Metadata:
    - Email: ${metadata.email || 'N/A'}
    - Location: ${metadata.location || 'N/A'}
    - Office: ${metadata.office || 'N/A'}
    - Profile Picture URL: ${metadata.profile_picture_url || 'N/A'}
    - Similarity Score: ${similarityScore}%
    --------------------
  `;
};
