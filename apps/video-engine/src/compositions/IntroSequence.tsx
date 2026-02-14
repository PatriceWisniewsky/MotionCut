import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export { introSequenceDefaults } from "@motioncut/video-types";
import type { IntroSequenceProps } from "@motioncut/video-types";

const AnimatedLine: React.FC<{
  color: string;
  delay: number;
  width: string;
  top: string;
}> = ({ color, delay, width, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: `translateX(-50%) scaleX(${progress})`,
        width,
        height: 3,
        backgroundColor: color,
        opacity: progress,
        borderRadius: 2,
      }}
    />
  );
};

export const IntroSequence: React.FC<IntroSequenceProps> = ({
  title,
  subtitle,
  primaryColor,
  secondaryColor,
  backgroundColor,
  animationSpeed,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFps = fps * animationSpeed;

  // Phase 1: Decorative lines sweep in (frames 0-30)
  // Phase 2: Title appears (frames 15-60)
  // Phase 3: Subtitle appears (frames 40-80)
  // Phase 4: Hold + fade out

  // Title animation
  const titleProgress = spring({
    frame: frame - Math.round(15 / animationSpeed),
    fps: adjustedFps,
    config: { damping: 14, stiffness: 100 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);
  const titleOpacity = titleProgress;

  // Subtitle animation
  const subtitleProgress = spring({
    frame: frame - Math.round(35 / animationSpeed),
    fps: adjustedFps,
    config: { damping: 14, stiffness: 80 },
  });

  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0]);
  const subtitleOpacity = subtitleProgress;

  // Background gradient pulse
  const gradientAngle = interpolate(frame, [0, durationInFrames], [0, 360]);

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at ${50 + Math.sin(gradientAngle * 0.01) * 10}% ${50 + Math.cos(gradientAngle * 0.01) * 10}%, ${backgroundColor}ee 0%, ${backgroundColor} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Decorative accent lines */}
      <AnimatedLine
        color={primaryColor}
        delay={Math.round(5 / animationSpeed)}
        width="200px"
        top="38%"
      />
      <AnimatedLine
        color={secondaryColor}
        delay={Math.round(8 / animationSpeed)}
        width="120px"
        top="39%"
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          fontSize: 72,
          fontWeight: 800,
          color: "#e4e4e7",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.03em",
          textAlign: "center",
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          transform: `translateY(${subtitleY}px)`,
          opacity: subtitleOpacity,
          fontSize: 28,
          fontWeight: 400,
          color: primaryColor,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {subtitle}
      </div>

      {/* Bottom accent line */}
      <AnimatedLine
        color={secondaryColor}
        delay={Math.round(45 / animationSpeed)}
        width="160px"
        top="62%"
      />
    </AbsoluteFill>
  );
};
