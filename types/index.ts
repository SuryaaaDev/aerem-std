export interface Project {
  id: string;
  title: string;
  slug: string;
  client?: string;
  year?: number;
  category: string;
  description?: string;
  thumbnail?: string;
  mockups: string[];
  created_at: string;
  updated_at: string;
}
