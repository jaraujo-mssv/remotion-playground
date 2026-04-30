import React from "react";
import { Composition } from "remotion";
import { DynamicComp } from "./DynamicComp";
import { MassiveBrandVideo } from "./MassiveBrandVideo";
import { CRMEnrichmentVideo } from "./CRMEnrichmentVideo";

const defaultCode = `import { AbsoluteFill } from "remotion";
export const MyAnimation = () => <AbsoluteFill style={{ backgroundColor: "#000" }} />;`;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DynamicComp"
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
        id="MassiveBrandVideo"
        component={MassiveBrandVideo}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CRMEnrichmentVideo"
        component={CRMEnrichmentVideo}
        durationInFrames={705}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
