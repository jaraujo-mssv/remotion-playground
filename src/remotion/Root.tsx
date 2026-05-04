import React from "react";
import { Composition } from "remotion";
import { DynamicComp } from "./DynamicComp";
import { MassiveBrandVideo } from "./MassiveBrandVideo";
import { CRMEnrichmentVideo } from "./CRMEnrichmentVideo";
import { WebRenderVideo } from "./WebRenderVideo";
import { WebRenderVideoV2 } from "./WebRenderVideoV2";
import { WebRenderVideoMobile } from "./WebRenderVideoMobile";
import { PodcasterVideo } from "./PodcasterVideo";
import { CardCollectorVideo } from "./CardCollectorVideo";
import { PCRepairVideo } from "./PCRepairVideo";
import { WebRenderVideoJoggingSF } from "./WebRenderVideoJoggingSF";
import { TransitionsDemo, TRANSITIONS_DEMO_DURATION } from "./TransitionsDemo";

const defaultCode = `import { AbsoluteFill } from "remotion";
export const MyAnimation = () => <AbsoluteFill style={{ backgroundColor: "#000" }} />;`;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Draft-DynamicComp"
        component={DynamicComp}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ code: defaultCode }}
        calculateMetadata={({ props }) => ({
          durationInFrames: props.durationInFrames as number,
          fps: props.fps as number,
        })}
      />
      <Composition
        id="Draft-MassiveBrandVideo"
        component={MassiveBrandVideo}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Draft-CRMEnrichmentVideo"
        component={CRMEnrichmentVideo}
        durationInFrames={705}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Draft-WebRenderVideo"
        component={WebRenderVideo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WebRenderAPI-WomanHomeOffice"
        component={WebRenderVideoV2}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Draft-WebRenderVideo-Mobile"
        component={WebRenderVideoMobile}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Draft-Podcaster-Video"
        component={PodcasterVideo}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Draft-CardCollector-Video"
        component={CardCollectorVideo}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Draft-PCRepair-Video"
        component={PCRepairVideo}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WebRenderAPI-JoggingSF"
        component={WebRenderVideoJoggingSF}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo-Transitions"
        component={TransitionsDemo}
        durationInFrames={TRANSITIONS_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
