"use client";

import React, { useMemo } from "react";
import { Player } from "@remotion/player";
import type { CompositionId } from "@motioncut/video-types";

// Import from barrel export
import {
  TextReveal,
  WordSlam,
  IntroSequence,
  OutroSequence,
  SocialHook,
} from "@motioncut/video-engine";

const compositionComponents: Record<CompositionId, React.FC<any>> = {
  TextReveal,
  WordSlam,
  IntroSequence,
  OutroSequence,
  SocialHook,
};

interface VideoPreviewProps {
  compositionId: CompositionId;
  inputProps: Record<string, unknown>;
  className?: string;
}

export function VideoPreview({
  compositionId,
  inputProps,
  className = "",
}: VideoPreviewProps) {
  const Component = compositionComponents[compositionId];

  // Determine dimensions based on aspect ratio (for SocialHook)
  const dimensions = useMemo(() => {
    if (
      compositionId === "SocialHook" &&
      inputProps.aspectRatio === "9:16"
    ) {
      return { width: 1080, height: 1920 };
    }
    if (
      compositionId === "SocialHook" &&
      inputProps.aspectRatio === "1:1"
    ) {
      return { width: 1080, height: 1080 };
    }
    return { width: 1920, height: 1080 };
  }, [compositionId, inputProps.aspectRatio]);

  if (!Component) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-muted">
        Template &quot;{compositionId}&quot; nicht gefunden.
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl overflow-hidden border border-border ${className}`}
    >
      <Player
        component={Component}
        inputProps={inputProps}
        durationInFrames={
          (inputProps.durationInFrames as number) ?? 90
        }
        fps={30}
        compositionWidth={dimensions.width}
        compositionHeight={dimensions.height}
        style={{ width: "100%" }}
        controls
        autoPlay={false}
        loop
      />
    </div>
  );
}
