export interface Profile {
  content: string;
  metadata: {
    email?: string;
    location?: string;
    office?: string;
    profile_picture_url?: string;
  };
  similarity: number;
}
