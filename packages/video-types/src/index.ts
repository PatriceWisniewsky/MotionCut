export {
  // Schemas
  textRevealSchema,
  wordSlamSchema,
  introSequenceSchema,
  outroSequenceSchema,
  socialHookSchema,
  // Defaults
  textRevealDefaults,
  wordSlamDefaults,
  introSequenceDefaults,
  outroSequenceDefaults,
  socialHookDefaults,
  // Registry
  compositionRegistry,
  categories,
} from "./schemas";

export type {
  TextRevealProps,
  WordSlamProps,
  IntroSequenceProps,
  OutroSequenceProps,
  SocialHookProps,
  CompositionId,
  Category,
} from "./schemas";

export type {
  CompositionTypeRecord,
  BlueprintRecord,
  VideoHistoryRecord,
  ProfileRecord,
  RenderRequest,
  RenderResponse,
} from "./types";
