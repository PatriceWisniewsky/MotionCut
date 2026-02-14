import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export { wordSlamDefaults } from "@motioncut/video-types";
import type { WordSlamProps } from "@motioncut/video-types";

export const WordSlam: React.FC<WordSlamProps> = ({
  word,
  fontSize,
  textColor,
  backgroundColor,
  hasBlitz,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slam animation: overshoots and bounces back
  const slamProgress = spring({
    frame: frame - 2,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  const scale = interpolate(slamProgress, [0, 1], [3, 1]);
  const opacity = interpolate(slamProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Blitz effect: lightning-like flash
  const blitzOpacity = hasBlitz
    ? interpolate(
        frame,
        [0, 2, 5, 7, 10],
        [0, 1, 0.2, 0.6, 0],
        { extrapolateRight: "clamp" }
      )
    : 0;

  // Screen shake effect on slam
  const shakeX =
    frame < 10
      ? Math.sin(frame * 15) * interpolate(frame, [0, 10], [8, 0], { extrapolateRight: "clamp" })
      : 0;
  const shakeY =
    frame < 10
      ? Math.cos(frame * 12) * interpolate(frame, [0, 10], [5, 0], { extrapolateRight: "clamp" })
      : 0;

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Glow pulse after slam
  const glowIntensity =
    frame > 10
      ? interpolate(
          Math.sin(frame * 0.15),
          [-1, 1],
          [20, 40]
        )
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Blitz flash */}
      {hasBlitz && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,${blitzOpacity}) 0%, rgba(255,255,255,0) 70%)`,
          }}
        />
      )}

      {/* The Word */}
      <div
        style={{
          transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
          opacity,
          fontSize,
          fontWeight: 900,
          color: textColor,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          textShadow: `0 0 ${glowIntensity}px ${textColor}40`,
          textAlign: "center",
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};
