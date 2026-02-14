import React from "react";
import { Composition } from "remotion";
import { TextReveal, textRevealDefaults } from "./compositions/TextReveal";
import { WordSlam, wordSlamDefaults } from "./compositions/WordSlam";
import { IntroSequence, introSequenceDefaults } from "./compositions/IntroSequence";
import { OutroSequence, outroSequenceDefaults } from "./compositions/OutroSequence";
import { SocialHook, socialHookDefaults } from "./compositions/SocialHook";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TextReveal"
        component={TextReveal}
        durationInFrames={textRevealDefaults.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={textRevealDefaults}
      />
      <Composition
        id="WordSlam"
        component={WordSlam}
        durationInFrames={wordSlamDefaults.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={wordSlamDefaults}
      />
      <Composition
        id="IntroSequence"
        component={IntroSequence}
        durationInFrames={introSequenceDefaults.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={introSequenceDefaults}
      />
      <Composition
        id="OutroSequence"
        component={OutroSequence}
        durationInFrames={outroSequenceDefaults.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={outroSequenceDefaults}
      />
      <Composition
        id="SocialHook"
        component={SocialHook}
        durationInFrames={socialHookDefaults.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={socialHookDefaults}
      />
    </>
  );
};
