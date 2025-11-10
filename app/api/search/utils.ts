import { sql } from "@/lib/db";
import { Profile } from "./types";

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
  return profiles.map(buildProfileContext).join("\n");
};

export const buildProfileContext = (profile: Profile, index: number) => {
  const similarityScore = (profile.similarity * 100).toFixed(1);

  const metadata =
    typeof profile.metadata === "string"
      ? JSON.parse(profile.metadata)
      : profile.metadata;

  return `
    Profile ${index + 1}:
    ${profile.content}

    Additional Metadata:
    - Email: ${metadata.email || "N/A"}
    - Location: ${metadata.location || "N/A"}
    - Office: ${metadata.office || "N/A"}
    - Profile Picture URL: ${metadata.profile_picture_url || "N/A"}
    - Similarity Score: ${similarityScore}%
    --------------------
  `;
};

export const cleanPdfText = (text: string) => {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove extra spaces, tabs, newlines
  cleaned = cleaned.replace(/\s+/g, " ");

  // 2. Fix PDFs that split letters: "J o b" -> "Job"
  cleaned = cleaned.replace(/\b([A-Za-z]) (?=[A-Za-z]\b)/g, "$1");

  // 3. Ensure space after punctuation (like ":")
  cleaned = cleaned.replace(/([.,;!?])(?=\S)/g, "$1 ");

  // 4. Remove space before punctuation
  cleaned = cleaned.replace(/\s+([.,;!?])/g, "$1");

  // 5. Trim
  cleaned = cleaned.trim();

  return cleaned;
};
