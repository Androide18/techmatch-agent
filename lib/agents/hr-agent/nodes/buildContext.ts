import { Profile } from '@/app/api/search-profiles/types';
import { HRAgentStateType } from '../graph';

export const buildContext = (state: HRAgentStateType): HRAgentStateType => {
  const profilesContext =
    state.matchingProfiles?.map(buildProfileContext).join('\n') || '';

  return {
    context: profilesContext,
  };
};

const buildProfileContext = (profile: Profile, index: number) => {
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
