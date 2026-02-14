import type { CompositionId, Category } from "./schemas";

/** Composition Type in der Datenbank */
export interface CompositionTypeRecord {
  id: string;
  name: CompositionId;
  display_name: string;
  description: string;
  category: Category;
  default_props: Record<string, unknown>;
  schema_version: number;
  created_at: string;
}

/** Blueprint in der Datenbank */
export interface BlueprintRecord {
  id: string;
  user_id: string;
  composition_type_id: string;
  name: string;
  params: Record<string, unknown>;
  thumbnail_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/** Video-History Eintrag in der Datenbank */
export interface VideoHistoryRecord {
  id: string;
  user_id: string;
  blueprint_id: string | null;
  composition_type: CompositionId;
  params: Record<string, unknown>;
  status: "rendering" | "completed" | "failed";
  output_url: string | null;
  file_size_bytes: number | null;
  duration_ms: number | null;
  created_at: string;
}

/** Profil-Eintrag */
export interface ProfileRecord {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

/** Render-Request Payload */
export interface RenderRequest {
  compositionId: CompositionId;
  inputProps: Record<string, unknown>;
  blueprintId?: string;
}

/** Render-Response */
export interface RenderResponse {
  success: boolean;
  videoId?: string;
  outputUrl?: string;
  error?: string;
}
