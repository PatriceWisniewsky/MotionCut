import { z } from "zod";

// ============================================================
// TextReveal Schema
// ============================================================
export const textRevealSchema = z.object({
  text: z.string().min(1).describe("Anzuzeigender Text"),
  fontSize: z.number().min(20).max(200).describe("Schriftgröße in px"),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Textfarbe (Hex)"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Hintergrundfarbe (Hex)"),
  animationStyle: z.enum(["slide", "fade", "scale"]).describe("Animationsart"),
  hasFlash: z.boolean().describe("Blitzeffekt ein/aus"),
  durationInFrames: z.number().min(15).max(300).describe("Dauer in Frames (30fps)"),
});

export type TextRevealProps = z.infer<typeof textRevealSchema>;

export const textRevealDefaults: TextRevealProps = {
  text: "MotionCut",
  fontSize: 80,
  textColor: "#e4e4e7",
  backgroundColor: "#0a0a0f",
  animationStyle: "slide",
  hasFlash: true,
  durationInFrames: 90,
};

// ============================================================
// WordSlam Schema
// ============================================================
export const wordSlamSchema = z.object({
  word: z.string().min(1).max(20).describe("Das Wort (kurz!)"),
  fontSize: z.number().min(40).max(300).describe("Schriftgröße in px"),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Textfarbe (Hex)"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Hintergrundfarbe (Hex)"),
  hasBlitz: z.boolean().describe("Blitz-/Lichteffekt"),
  durationInFrames: z.number().min(15).max(150).describe("Dauer in Frames (30fps)"),
});

export type WordSlamProps = z.infer<typeof wordSlamSchema>;

export const wordSlamDefaults: WordSlamProps = {
  word: "BOOM",
  fontSize: 160,
  textColor: "#f59e0b",
  backgroundColor: "#0a0a0f",
  hasBlitz: true,
  durationInFrames: 60,
};

// ============================================================
// IntroSequence Schema
// ============================================================
export const introSequenceSchema = z.object({
  title: z.string().min(1).describe("Haupttitel"),
  subtitle: z.string().describe("Untertitel"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Primärfarbe (Hex)"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Sekundärfarbe (Hex)"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Hintergrundfarbe (Hex)"),
  animationSpeed: z.number().min(0.5).max(3).describe("Animationsgeschwindigkeit (Multiplikator)"),
  durationInFrames: z.number().min(60).max(450).describe("Dauer in Frames (30fps)"),
});

export type IntroSequenceProps = z.infer<typeof introSequenceSchema>;

export const introSequenceDefaults: IntroSequenceProps = {
  title: "MotionCut",
  subtitle: "Video Generation Dashboard",
  primaryColor: "#00b4d8",
  secondaryColor: "#f59e0b",
  backgroundColor: "#0a0a0f",
  animationSpeed: 1,
  durationInFrames: 150,
};

// ============================================================
// OutroSequence Schema
// ============================================================
export const outroSequenceSchema = z.object({
  ctaText: z.string().min(1).describe("Call-to-Action Text"),
  channelName: z.string().min(1).describe("Kanal-/Markenname"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Primärfarbe (Hex)"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Hintergrundfarbe (Hex)"),
  showSubscribe: z.boolean().describe("Abo-Button anzeigen"),
  durationInFrames: z.number().min(60).max(300).describe("Dauer in Frames (30fps)"),
});

export type OutroSequenceProps = z.infer<typeof outroSequenceSchema>;

export const outroSequenceDefaults: OutroSequenceProps = {
  ctaText: "Subscribe for more!",
  channelName: "MotionCut",
  primaryColor: "#00b4d8",
  backgroundColor: "#0a0a0f",
  showSubscribe: true,
  durationInFrames: 120,
};

// ============================================================
// SocialHook Schema
// ============================================================
export const socialHookSchema = z.object({
  mainText: z.string().min(1).describe("Haupttext (Hook)"),
  accentText: z.string().describe("Akzent-/Highlight-Text"),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Textfarbe (Hex)"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Akzentfarbe (Hex)"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).describe("Hintergrundfarbe (Hex)"),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]).describe("Seitenverhältnis"),
  durationInFrames: z.number().min(30).max(180).describe("Dauer in Frames (30fps)"),
});

export type SocialHookProps = z.infer<typeof socialHookSchema>;

export const socialHookDefaults: SocialHookProps = {
  mainText: "Most brands don't have a sales problem",
  accentText: "They have a trust problem",
  textColor: "#e4e4e7",
  accentColor: "#f59e0b",
  backgroundColor: "#0a0a0f",
  aspectRatio: "16:9",
  durationInFrames: 90,
};

// ============================================================
// Registry: alle Templates mit Metadaten
// ============================================================
export const compositionRegistry = {
  TextReveal: {
    id: "TextReveal",
    displayName: "Text Reveal",
    description: "Animierter Text-Einflug mit optionalem Blitzeffekt",
    category: "broll" as const,
    schema: textRevealSchema,
    defaults: textRevealDefaults,
  },
  WordSlam: {
    id: "WordSlam",
    displayName: "Word Slam",
    description: "Ein Wort knallt groß rein – bold und aufmerksamkeitsstark",
    category: "broll" as const,
    schema: wordSlamSchema,
    defaults: wordSlamDefaults,
  },
  IntroSequence: {
    id: "IntroSequence",
    displayName: "Intro Sequence",
    description: "Titel + Untertitel mit Übergangsanimationen",
    category: "intro" as const,
    schema: introSequenceSchema,
    defaults: introSequenceDefaults,
  },
  OutroSequence: {
    id: "OutroSequence",
    displayName: "Outro Sequence",
    description: "CTA + Kanal-Branding mit Fade-Out",
    category: "outro" as const,
    schema: outroSequenceSchema,
    defaults: outroSequenceDefaults,
  },
  SocialHook: {
    id: "SocialHook",
    displayName: "Social Hook",
    description: "Kurzer, aufmerksamkeitsstarker Clip für Social Media",
    category: "social" as const,
    schema: socialHookSchema,
    defaults: socialHookDefaults,
  },
} as const;

export type CompositionId = keyof typeof compositionRegistry;
export type Category = "intro" | "outro" | "broll" | "motion" | "social";

export const categories: { value: Category; label: string }[] = [
  { value: "intro", label: "Intros" },
  { value: "outro", label: "Outros" },
  { value: "broll", label: "B-Rolls" },
  { value: "motion", label: "Motion Graphics" },
  { value: "social", label: "Social Media" },
];
