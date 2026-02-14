import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// Re-export defaults from schemas for Root.tsx registration
export { textRevealDefaults } from "@motioncut/video-types";
import type { TextRevealProps } from "@motioncut/video-types";

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  fontSize,
  textColor,
  backgroundColor,
  animationStyle,
  hasFlash,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash effect: white overlay that fades quickly
  const flashOpacity = hasFlash
    ? interpolate(frame, [0, 4, 10], [0, 0.8, 0], { extrapolateRight: "clamp" })
    : 0;

  // Main text animation based on style
  const getTextTransform = () => {
    const progress = spring({
      frame: frame - 5,
      fps,
      config: { damping: 12, stiffness: 100, mass: 0.8 },
    });

    switch (animationStyle) {
      case "slide":
        return {
          transform: `translateY(${interpolate(progress, [0, 1], [80, 0])}px)`,
          opacity: progress,
        };
      case "fade":
        return {
          opacity: progress,
        };
      case "scale":
        return {
          transform: `scale(${interpolate(progress, [0, 1], [0.3, 1])})`,
          opacity: progress,
        };
    }
  };

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const textTransform = getTextTransform();

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Flash overlay */}
      {hasFlash && (
        <AbsoluteFill
          style={{
            backgroundColor: "#ffffff",
            opacity: flashOpacity,
          }}
        />
      )}

      {/* Animated text */}
      <div
        style={{
          ...textTransform,
          fontSize,
          fontWeight: 800,
          color: textColor,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.02em",
          textAlign: "center",
          padding: "0 80px",
          lineHeight: 1.1,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
