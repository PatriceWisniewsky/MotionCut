-- ============================================================
-- MotionCut - Supabase Database Schema
-- Führe dieses Script im Supabase SQL Editor aus
-- ============================================================

-- 1. Profiles Tabelle (erweitert Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatisch Profil erstellen bei User-Registrierung
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Composition Types Tabelle
CREATE TABLE IF NOT EXISTS composition_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('intro', 'outro', 'broll', 'motion', 'social')),
  default_props JSONB NOT NULL DEFAULT '{}',
  schema_version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Blueprints Tabelle
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  composition_type_id UUID REFERENCES composition_types(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  params JSONB NOT NULL DEFAULT '{}',
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Video History Tabelle
CREATE TABLE IF NOT EXISTS video_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint_id UUID REFERENCES blueprints(id) ON DELETE SET NULL,
  composition_type TEXT NOT NULL,
  params JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'rendering' CHECK (status IN ('rendering', 'completed', 'failed')),
  output_url TEXT,
  file_size_bytes BIGINT,
  duration_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Profiles: User kann nur eigenes Profil sehen/bearbeiten
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Composition Types: Alle authentifizierten User können lesen
ALTER TABLE composition_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view composition types"
  ON composition_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert composition types"
  ON composition_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Blueprints: User sieht eigene + öffentliche
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blueprints"
  ON blueprints FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create own blueprints"
  ON blueprints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blueprints"
  ON blueprints FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blueprints"
  ON blueprints FOR DELETE
  USING (auth.uid() = user_id);

-- Video History: User sieht nur eigene
ALTER TABLE video_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own video history"
  ON video_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own video history"
  ON video_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video history"
  ON video_history FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Seed: Standard-Composition-Types einfügen
-- ============================================================
INSERT INTO composition_types (name, display_name, description, category, default_props, schema_version)
VALUES
  ('TextReveal', 'Text Reveal', 'Animierter Text-Einflug mit optionalem Blitzeffekt', 'broll',
   '{"text": "MotionCut", "fontSize": 80, "textColor": "#e4e4e7", "backgroundColor": "#0a0a0f", "animationStyle": "slide", "hasFlash": true, "durationInFrames": 90}', 1),
  ('WordSlam', 'Word Slam', 'Ein Wort knallt groß rein – bold und aufmerksamkeitsstark', 'broll',
   '{"word": "BOOM", "fontSize": 160, "textColor": "#f59e0b", "backgroundColor": "#0a0a0f", "hasBlitz": true, "durationInFrames": 60}', 1),
  ('IntroSequence', 'Intro Sequence', 'Titel + Untertitel mit Übergangsanimationen', 'intro',
   '{"title": "MotionCut", "subtitle": "Video Generation Dashboard", "primaryColor": "#00b4d8", "secondaryColor": "#f59e0b", "backgroundColor": "#0a0a0f", "animationSpeed": 1, "durationInFrames": 150}', 1),
  ('OutroSequence', 'Outro Sequence', 'CTA + Kanal-Branding mit Fade-Out', 'outro',
   '{"ctaText": "Subscribe for more!", "channelName": "MotionCut", "primaryColor": "#00b4d8", "backgroundColor": "#0a0a0f", "showSubscribe": true, "durationInFrames": 120}', 1),
  ('SocialHook', 'Social Hook', 'Kurzer, aufmerksamkeitsstarker Clip für Social Media', 'social',
   '{"mainText": "Most brands don''t have a sales problem", "accentText": "They have a trust problem", "textColor": "#e4e4e7", "accentColor": "#f59e0b", "backgroundColor": "#0a0a0f", "aspectRatio": "16:9", "durationInFrames": 90}', 1)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- Supabase Storage Bucket für gerenderte Videos
-- ============================================================
-- Hinweis: Dies muss im Supabase Dashboard unter Storage erstellt werden:
-- Bucket Name: rendered-videos
-- Public: Nein (wir nutzen Signed URLs)
-- Erlaubte MIME-Types: video/mp4, video/webm
