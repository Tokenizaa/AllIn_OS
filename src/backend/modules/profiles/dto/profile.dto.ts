export interface Profile {
  id: string;
  user_id: string;
  name?: string;
  email?: string;
  role: string;
  status: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileDto {
  user_id: string;
  name?: string;
  email?: string;
  role: string;
  status?: string;
  display_name?: string;
  avatar_url?: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  display_name?: string;
  avatar_url?: string;
}
