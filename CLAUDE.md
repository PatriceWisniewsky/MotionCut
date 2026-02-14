# MotionCut - Projekt-Konventionen

## Projektübersicht
MotionCut ist eine Video-Generierungs-Plattform basierend auf Remotion + Next.js + Supabase.
Monorepo-Architektur mit Turborepo + pnpm.

## Struktur
- `apps/dashboard` - Next.js 14+ App Router (Frontend + API)
- `apps/video-engine` - Remotion Compositions (Video-Templates)
- `packages/video-types` - Geteilte TypeScript-Types + Zod-Schemas

## Konventionen
- TypeScript strict mode überall
- Zod-Schemas für alle Composition Input Props
- Supabase für Datenbank, Auth und Storage
- Tailwind CSS + shadcn/ui für Dashboard-Styling
- Dark Theme als Standard
- Deutsche Kommentare sind OK, Code/Variablen auf Englisch

## Wichtige Patterns
- Remotion Player (`@remotion/player`) für Live-Vorschau im Dashboard
- `@remotion/renderer` für lokales Rendering (NICHT in Next.js API Routes bundlen!)
- Pre-Bundle-Strategie: Remotion wird vorab gebundelt, Bundle-Pfad an Renderer übergeben
- Supabase RLS (Row Level Security) auf allen User-Tabellen

## Befehle
- `pnpm dev` - Startet alle Apps parallel
- `pnpm build` - Baut alle Packages + Apps
- `pnpm --filter dashboard dev` - Nur Dashboard starten
- `pnpm --filter video-engine dev` - Nur Remotion Studio starten
