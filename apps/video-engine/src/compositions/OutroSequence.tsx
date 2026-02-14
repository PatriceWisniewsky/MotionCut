import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export { outroSequenceDefaults } from "@motioncut/video-types";
import type { OutroSequenceProps } from "@motioncut/video-types";

const SubscribeButton: React.FC<{
  color: string;
  frame: number;
  fps: number;
  delay: number;
}> = ({ color, frame, fps, delay }) => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const pulse =
    frame > delay + 20
      ? 1 + Math.sin((frame - delay - 20) * 0.1) * 0.03
      : 1;

  return (
    <div
      style={{
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.8, 1]) * pulse})`,
        backgroundColor: color,
        color: "#ffffff",
        padding: "16px 48px",
        borderRadius: 50,
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        boxShadow: `0 4px 20px ${color}40`,
      }}
    >
      SUBSCRIBE
    </div>
  );
};

export const OutroSequence: React.FC<OutroSequenceProps> = ({
  ctaText,
  channelName,
  primaryColor,
  backgroundColor,
  showSubscribe,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Channel name animation
  const channelProgress = spring({
    frame: frame - 5,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  // CTA text animation
  const ctaProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Divider line
  const lineProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 25, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Channel Name */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          opacity: channelProgress,
          transform: `translateY(${interpolate(channelProgress, [0, 1], [20, 0])}px)`,
          fontSize: 56,
          fontWeight: 800,
          color: "#e4e4e7",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        {channelName}
      </div>

      {/* Divider line */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translateX(-50%)",
          width: interpolate(lineProgress, [0, 1], [0, 80]),
          height: 2,
          backgroundColor: primaryColor,
          opacity: lineProgress,
        }}
      />

      {/* CTA Text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          opacity: ctaProgress,
          transform: `translateY(${interpolate(ctaProgress, [0, 1], [15, 0])}px)`,
          fontSize: 30,
          fontWeight: 400,
          color: "#a1a1aa",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          letterSpacing: "0.02em",
          textAlign: "center",
          maxWidth: 600,
        }}
      >
        {ctaText}
      </div>

      {/* Subscribe Button */}
      {showSubscribe && (
        <div style={{ position: "absolute", top: "64%" }}>
          <SubscribeButton
            color={primaryColor}
            frame={frame}
            fps={fps}
            delay={35}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
