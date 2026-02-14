import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export { socialHookDefaults } from "@motioncut/video-types";
import type { SocialHookProps } from "@motioncut/video-types";

export const SocialHook: React.FC<SocialHookProps> = ({
  mainText,
  accentText,
  textColor,
  accentColor,
  backgroundColor,
  aspectRatio,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main text animation - words appear one by one
  const words = mainText.split(" ");
  const framesPerWord = Math.max(2, Math.floor(20 / words.length));

  // Accent text animation
  const accentDelay = words.length * framesPerWord + 15;
  const accentProgress = spring({
    frame: frame - accentDelay,
    fps,
    config: { damping: 10, stiffness: 120, mass: 0.6 },
  });

  // Underline animation under accent
  const underlineProgress = spring({
    frame: frame - accentDelay - 5,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Fade out
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background accent gradient
  const gradientProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 40 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}f0 50%, ${accentColor}10 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: aspectRatio === "9:16" ? "0 40px" : "0 120px",
        opacity: fadeOut,
      }}
    >
      {/* Decorative accent dot */}
      <div
        style={{
          position: "absolute",
          top: aspectRatio === "9:16" ? "25%" : "30%",
          left: "50%",
          transform: `translateX(-50%) scale(${gradientProgress})`,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: accentColor,
          opacity: gradientProgress,
        }}
      />

      {/* Main text - word by word reveal */}
      <div
        style={{
          textAlign: "center",
          fontSize: aspectRatio === "9:16" ? 42 : 52,
          fontWeight: 700,
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          lineHeight: 1.3,
          letterSpacing: "-0.02em",
        }}
      >
        {words.map((w, i) => {
          const wordProgress = spring({
            frame: frame - i * framesPerWord - 5,
            fps,
            config: { damping: 12, stiffness: 100 },
          });

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: 12,
                color: textColor,
                opacity: wordProgress,
                transform: `translateY(${interpolate(wordProgress, [0, 1], [15, 0])}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      {/* Accent text */}
      {accentText && (
        <div
          style={{
            marginTop: 30,
            textAlign: "center",
            position: "relative",
            display: "inline-block",
          }}
        >
          <div
            style={{
              fontSize: aspectRatio === "9:16" ? 36 : 44,
              fontWeight: 800,
              fontFamily: "Inter, system-ui, -apple-system, sans-serif",
              color: accentColor,
              opacity: accentProgress,
              transform: `translateY(${interpolate(accentProgress, [0, 1], [20, 0])}px)`,
              letterSpacing: "-0.02em",
            }}
          >
            {accentText}
          </div>

          {/* Underline */}
          <div
            style={{
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: `translateX(-50%) scaleX(${underlineProgress})`,
              width: "80%",
              height: 3,
              backgroundColor: accentColor,
              borderRadius: 2,
              opacity: underlineProgress * 0.6,
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
