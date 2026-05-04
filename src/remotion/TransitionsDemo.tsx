import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
  type TransitionPresentation,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { iris } from "@remotion/transitions/iris";
import { none } from "@remotion/transitions/none";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFontMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont();
const { fontFamily: monoFamily } = loadFontMono();

const C = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const BG = "#0a0a0f";
const CREAM = "#faf4ec";
const MUTED = "rgba(250, 244, 236, 0.55)";

const W = 1920;
const H = 1080;

const TITLE_FRAMES = 70;
const SCENE_FRAMES = 80;
const TRANSITION_FRAMES = 30;

const IMAGES = [
  "storyboard/card-collector-1.jpg",
  "storyboard/card-collector-2.jpg",
  "storyboard/card-collector-3.jpg",
  "storyboard/family-guy-1.jpg",
  "storyboard/family-guy-2.jpg",
  "storyboard/family-guy-3.jpg",
  "storyboard/jogging-sf-1.jpg",
  "storyboard/jogging-sf-2.jpg",
  "storyboard/jogging-sf-3.jpg",
  "storyboard/pc-repair-1.jpg",
  "storyboard/pc-repair-2.jpg",
  "storyboard/pc-repair-3.jpg",
  "storyboard/podcast-1.jpg",
  "storyboard/podcast-2.jpg",
  "storyboard/podcast-3.jpg",
];

const TRANSITION_COLORS = {
  none: "#6b7280",
  fade: "#3b82f6",
  slide: "#8b5cf6",
  wipe: "#10b981",
  flip: "#f59e0b",
  clockWipe: "#ef4444",
  iris: "#d74939",
};

type TransitionDef = {
  label: string;
  sublabel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  presentation: TransitionPresentation<any>;
  timing: ReturnType<typeof linearTiming>;
  color: string;
};

const DEMO_TRANSITIONS: TransitionDef[] = [
  {
    label: "None",
    sublabel: "Hard cut · instant",
    presentation: none(),
    timing: linearTiming({ durationInFrames: 1 }),
    color: TRANSITION_COLORS.none,
  },
  {
    label: "Fade",
    sublabel: "Linear · 30f",
    presentation: fade(),
    timing: linearTiming({ durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.fade,
  },
  {
    label: "Slide",
    sublabel: "From left · Spring",
    presentation: slide({ direction: "from-left" }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.slide,
  },
  {
    label: "Slide",
    sublabel: "From right · Linear",
    presentation: slide({ direction: "from-right" }),
    timing: linearTiming({ durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.slide,
  },
  {
    label: "Slide",
    sublabel: "From top · Linear",
    presentation: slide({ direction: "from-top" }),
    timing: linearTiming({ durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.slide,
  },
  {
    label: "Slide",
    sublabel: "From bottom · Spring",
    presentation: slide({ direction: "from-bottom" }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.slide,
  },
  {
    label: "Wipe",
    sublabel: "From left · Linear",
    presentation: wipe({ direction: "from-left" }),
    timing: linearTiming({ durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.wipe,
  },
  {
    label: "Wipe",
    sublabel: "From top · Spring",
    presentation: wipe({ direction: "from-top" }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.wipe,
  },
  {
    label: "Wipe",
    sublabel: "Top-right · Linear",
    presentation: wipe({ direction: "from-top-right" }),
    timing: linearTiming({ durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.wipe,
  },
  {
    label: "Wipe",
    sublabel: "From bottom · Spring",
    presentation: wipe({ direction: "from-bottom" }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.wipe,
  },
  {
    label: "Flip",
    sublabel: "From left · Spring",
    presentation: flip({ direction: "from-left" }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.flip,
  },
  {
    label: "Flip",
    sublabel: "From top · Linear",
    presentation: flip({ direction: "from-top" }),
    timing: linearTiming({ durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.flip,
  },
  {
    label: "Clock Wipe",
    sublabel: "Spring · 30f",
    presentation: clockWipe({ width: W, height: H }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.clockWipe,
  },
  {
    label: "Flip",
    sublabel: "From bottom · Spring",
    presentation: flip({ direction: "from-bottom" }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.flip,
  },
  {
    label: "Clock Wipe",
    sublabel: "Spring · 30f",
    presentation: clockWipe({ width: W, height: H }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.clockWipe,
  },
  {
    label: "Iris",
    sublabel: "Spring · 30f",
    presentation: iris({ width: W, height: H }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES }),
    color: TRANSITION_COLORS.iris,
  },
];

// Computed total: TITLE + (15 × SCENE) - (1×1 + 14×30) = 70 + 1200 - 421 = 849
export const TRANSITIONS_DEMO_DURATION =
  TITLE_FRAMES +
  IMAGES.length * SCENE_FRAMES -
  DEMO_TRANSITIONS.reduce(
    (sum, t) => sum + t.timing.getDurationInFrames({ fps: 30 }),
    0
  );

const DotGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "radial-gradient(circle, rgba(96,118,145,0.7) 1.5px, transparent 1.5px)",
      backgroundSize: "72px 72px",
      opacity,
      pointerEvents: "none",
    }}
  />
);

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();

  const titleY = interpolate(frame, [8, 28], [40, 0], C);
  const titleOp = interpolate(frame, [8, 28], [0, 1], C);
  const subOp = interpolate(frame, [24, 40], [0, 1], C);
  const badgesOp = interpolate(frame, [38, 55], [0, 1], C);

  const types = [
    { name: "None", color: TRANSITION_COLORS.none },
    { name: "Fade", color: TRANSITION_COLORS.fade },
    { name: "Slide", color: TRANSITION_COLORS.slide },
    { name: "Wipe", color: TRANSITION_COLORS.wipe },
    { name: "Flip", color: TRANSITION_COLORS.flip },
    { name: "Clock Wipe", color: TRANSITION_COLORS.clockWipe },
    { name: "Iris", color: TRANSITION_COLORS.iris },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <DotGrid opacity={0.1} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            textAlign: "center",
          }}
        >
          <div
            style={{
              opacity: titleOp,
              transform: `translateY(${titleY}px)`,
              color: CREAM,
              fontFamily,
              fontSize: 100,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            Transitions Demo
          </div>

          <div
            style={{
              opacity: subOp,
              color: MUTED,
              fontFamily: monoFamily,
              fontSize: 26,
              letterSpacing: "0.06em",
            }}
          >
            @remotion/transitions · 7 types · 15 variations
          </div>

          <div
            style={{
              opacity: badgesOp,
              display: "flex",
              gap: 14,
              flexWrap: "wrap" as const,
              justifyContent: "center",
              maxWidth: 900,
            }}
          >
            {types.map(({ name, color }) => (
              <div
                key={name}
                style={{
                  backgroundColor: `${color}22`,
                  border: `1.5px solid ${color}55`,
                  borderRadius: 100,
                  padding: "8px 24px",
                  color,
                  fontFamily: monoFamily,
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ImageScene: React.FC<{
  src: string;
  label: string;
  sublabel: string;
  color: string;
  index: number;
}> = ({ src, label, sublabel, color, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const labelOp = interpolate(
    frame,
    [12, 24, durationInFrames - 24, durationInFrames - 10],
    [0, 1, 1, 0],
    C
  );
  const zoomScale = interpolate(frame, [0, durationInFrames], [1.0, 1.06], C);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoomScale})`,
        }}
      />

      {/* Bottom gradient scrim */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 22%, transparent 42%)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom bar: label left, counter right */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: "0 80px 68px",
          opacity: labelOp,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          {/* Transition label */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  backgroundColor: color,
                  borderRadius: 100,
                  padding: "10px 30px",
                  color: "#fff",
                  fontFamily,
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: monoFamily,
                  fontSize: 22,
                  letterSpacing: "0.04em",
                }}
              >
                {sublabel}
              </div>
            </div>
          </div>

          {/* Scene counter */}
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: monoFamily,
              fontSize: 22,
              letterSpacing: "0.08em",
            }}
          >
            {String(index + 1).padStart(2, "0")} / {String(IMAGES.length).padStart(2, "0")}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TransitionsDemo: React.FC = () => {
  const items: React.ReactNode[] = [];

  items.push(
    <TransitionSeries.Sequence key="title" durationInFrames={TITLE_FRAMES}>
      <TitleCard />
    </TransitionSeries.Sequence>
  );

  IMAGES.forEach((src, i) => {
    const t = DEMO_TRANSITIONS[i];
    items.push(
      <TransitionSeries.Transition key={`t-${i}`} presentation={t.presentation} timing={t.timing} />
    );
    items.push(
      <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={SCENE_FRAMES}>
        <ImageScene src={src} label={t.label} sublabel={t.sublabel} color={t.color} index={i} />
      </TransitionSeries.Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <TransitionSeries>{items}</TransitionSeries>
    </AbsoluteFill>
  );
};
