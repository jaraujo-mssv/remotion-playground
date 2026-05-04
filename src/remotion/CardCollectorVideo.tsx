import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Outfit";
import { loadFont as loadFontMono } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily } = loadFont();
const { fontFamily: monoFamily } = loadFontMono();

const BG = "#0a0a0f";
const CREAM = "#faf4ec";
const ORANGE = "#d74939";
const ORANGE_LIGHT = "#ff8163";
const MUTED = "rgba(250, 244, 236, 0.55)";
const LOGO_LOCAL = staticFile("brand/logo-positive-white.png");

const C = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

function spr(frame: number, fps: number, delay = 0, damping = 22, stiffness = 200) {
  return spring({ frame: Math.max(0, frame - delay), fps, config: { damping, stiffness } });
}
function fIn(frame: number, delay = 0, dur = 8) {
  return interpolate(Math.max(0, frame - delay), [0, dur], [0, 1], C);
}
function up(frame: number, fps: number, delay = 0, dist = 36) {
  const s = spr(frame, fps, delay);
  return {
    opacity: fIn(frame, delay),
    transform: `translateY(${interpolate(s, [0, 1], [dist, 0])}px)`,
  };
}
function si(frame: number, fps: number, delay = 0) {
  const s = spr(frame, fps, delay, 20, 160);
  return {
    opacity: fIn(frame, delay),
    transform: `scale(${interpolate(s, [0, 1], [0.72, 1])})`,
  };
}
function wp(frame: number, delay = 0, dur = 16) {
  const pct = interpolate(Math.max(0, frame - delay), [0, dur], [100, 0], C);
  return { clipPath: `inset(0 ${pct}% 0 0)` };
}

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

const AgentAvatar: React.FC = () => (
  <div
    style={{
      width: 38,
      height: 38,
      borderRadius: "50%",
      backgroundColor: `${ORANGE}33`,
      border: `1px solid ${ORANGE}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: ORANGE_LIGHT,
      fontFamily: monoFamily,
      fontSize: 16,
      fontWeight: 700,
    }}
  >
    A
  </div>
);

const ChatHeader: React.FC = () => (
  <div
    style={{
      padding: "14px 24px",
      borderBottom: `1px solid rgba(250,244,236,0.08)`,
      backgroundColor: `rgba(215,73,57,0.07)`,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "#10b981",
        boxShadow: "0 0 6px #10b981",
      }}
    />
    <span style={{ color: CREAM, fontFamily, fontSize: 22, fontWeight: 600 }}>Agent</span>
    <span style={{ color: MUTED, fontFamily: monoFamily, fontSize: 15, marginLeft: 6 }}>
      Deal Finder
    </span>
  </div>
);

const ChatInputBar: React.FC<{ sendOp?: number; sendScale?: number }> = ({
  sendOp = 0,
  sendScale = 1,
}) => (
  <div style={{ padding: "12px 16px", borderTop: `1px solid rgba(250,244,236,0.07)` }}>
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(250,244,236,0.07)`,
        borderRadius: 10,
        padding: "8px 8px 8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        minHeight: 50,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: ORANGE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: sendOp,
          transform: `scale(${sendScale})`,
          boxShadow: `0 0 16px ${ORANGE}55`,
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 3L17 10L10 17M3 10H17"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
);

const CsvFileCard: React.FC<{ filename: string; meta?: string }> = ({ filename, meta }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      backgroundColor: "rgba(16,185,129,0.08)",
      border: "1px solid rgba(16,185,129,0.3)",
      borderRadius: 12,
      padding: "12px 16px",
    }}
  >
    <div
      style={{
        width: 42,
        height: 50,
        backgroundColor: "rgba(16,185,129,0.15)",
        border: "1px solid rgba(16,185,129,0.4)",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          color: "#10b981",
          fontFamily: monoFamily,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.04em",
        }}
      >
        CSV
      </span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ color: CREAM, fontFamily, fontSize: 22, fontWeight: 600, lineHeight: 1.2 }}>
        {filename}
      </div>
      {meta && <div style={{ color: MUTED, fontFamily: monoFamily, fontSize: 16 }}>{meta}</div>}
    </div>
  </div>
);

const SlackBubble: React.FC<{
  frame: number;
  fps: number;
  delay: number;
  name: string;
  message: string;
  time: string;
  initials: string;
}> = ({ frame, fps, delay, name, message, time, initials }) => {
  const sty = up(frame, fps, delay, 24);
  return (
    <div style={{ ...sty, display: "flex", gap: 16, alignItems: "flex-start", maxWidth: 800 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          backgroundColor: ORANGE,
          border: `2px solid ${ORANGE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: CREAM,
          fontSize: 18,
          fontFamily: monoFamily,
          fontWeight: 700,
        }}
      >
        {initials}
      </div>
      <div
        style={{
          backgroundColor: "rgba(26,25,32,0.88)",
          border: `1px solid rgba(250,244,236,0.12)`,
          borderRadius: "4px 16px 16px 16px",
          padding: "16px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ color: CREAM, fontSize: 28, fontFamily, fontWeight: 700 }}>{name}</span>
          <span style={{ color: MUTED, fontSize: 20, fontFamily: monoFamily }}>{time}</span>
        </div>
        <div style={{ color: CREAM, fontSize: 32, fontFamily, fontWeight: 400, lineHeight: 1.45 }}>
          {message}
        </div>
      </div>
    </div>
  );
};

// ─── Scene 1: Hook ────────────────────────────────────────────────────────────

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowSty = up(frame, fps, 4);
  const line1Sty = wp(frame, 10, 14);
  const line2Sty = wp(frame, 22, 16);
  const logoSty = si(frame, fps, 38);
  const exitOp = interpolate(frame, [50, 85], [1, 0], C);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity: exitOp }}>
      <DotGrid opacity={0.12} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ ...eyebrowSty, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 48, height: 1.5, backgroundColor: ORANGE }} />
            <div
              style={{
                fontFamily: monoFamily,
                fontSize: 28,
                fontWeight: 600,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                color: ORANGE,
              }}
            >
              Web Render API
            </div>
            <div style={{ width: 48, height: 1.5, backgroundColor: ORANGE }} />
          </div>

          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                ...line1Sty,
                color: CREAM,
                fontSize: 104,
                fontFamily,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              One search.
            </div>
          </div>

          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                ...line2Sty,
                fontSize: 84,
                fontFamily,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 40px ${ORANGE}44)`,
              }}
            >
              Every deal, found instantly.
            </div>
          </div>

          <div style={{ ...logoSty, marginTop: 8 }}>
            <Img src={LOGO_LOCAL} style={{ height: 72 }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: The Trigger ─────────────────────────────────────────────────────

const TheTrigger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 35], [0, 1], C);
  const zoomScale = interpolate(frame, [0, 400], [1, 1.08], C);

  return (
    <AbsoluteFill style={{ opacity: enterOp }}>
      <Img
        src={staticFile("storyboard/card-collector-1.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoomScale})` }}
      />
      <DotGrid opacity={0.07} />
      <Sequence from={16}>
        <Audio src={staticFile("sfx/notification.mp3")} />
      </Sequence>
      <Sequence from={68}>
        <Audio src={staticFile("sfx/notification.mp3")} />
      </Sequence>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
          padding: "0 120px 120px 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-end" }}>
          <SlackBubble
            frame={frame}
            fps={fps}
            delay={16}
            name="Tyler B."
            initials="TB"
            time="4:07 PM"
            message="Holographic Charizard just dropped to $89 on eBay 👀"
          />
          <SlackBubble
            frame={frame}
            fps={fps}
            delay={68}
            name="Tyler B."
            initials="TB"
            time="4:08 PM"
            message="You should grab more from your list while prices are low 🃏"
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: Prompt & Result ─────────────────────────────────────────────────

const PROMPT_TEXT =
  "Find best prices for: 1999 Charizard holo, Pikachu Illustrator, Base Set Blastoise. Check eBay, TCGPlayer, and PWCC.";
const AI_RESPONSE = "On it — scanning eBay, TCGPlayer, and PWCC listings now.";

const ThePromptAndResult: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoomScale = interpolate(frame, [0, 400], [1, 1.08], C);

  const panelOp = fIn(frame, 2, 8);
  const sendOp = fIn(frame, 57, 8);
  const sendScale = interpolate(
    spring({ frame: Math.max(0, frame - 57), fps, config: { damping: 18, stiffness: 180 } }),
    [0, 1],
    [0.6, 1]
  );

  const promptSty = up(frame, fps, 10, 24);
  const aiSty = up(frame, fps, 65, 24);
  const resultSty = up(frame, fps, 122, 24);

  const thinkOp = interpolate(frame, [82, 88, 118, 130], [0, 1, 1, 0], C);
  const dt = Math.max(0, frame - 82);
  const makeDot = (offset: number) =>
    interpolate((dt + offset) % 12, [0, 6, 12], [0.25, 1, 0.25], C);

  const csvOp = fIn(frame, 158, 12);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("storyboard/card-collector-2.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoomScale})` }}
      />
      <DotGrid opacity={0.07} />
      <Sequence from={158}>
        <Audio src={staticFile("sfx/sucess.mp3")} />
      </Sequence>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: panelOp }}>
        <div
          style={{
            width: 1100,
            backgroundColor: "rgba(10,10,15,0.6)",
            border: `1.5px solid rgba(250,244,236,0.12)`,
            borderRadius: 20,
            overflow: "hidden",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatHeader />

          <div style={{ padding: "28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  ...promptSty,
                  backgroundColor: `${ORANGE}22`,
                  border: `1px solid ${ORANGE}44`,
                  borderRadius: "18px 4px 18px 18px",
                  padding: "18px 24px",
                  maxWidth: "80%",
                }}
              >
                <div style={{ color: CREAM, fontFamily, fontSize: 28, lineHeight: 1.55 }}>
                  {PROMPT_TEXT}
                </div>
              </div>
            </div>

            <div style={{ ...aiSty, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <AgentAvatar />
              <div
                style={{
                  backgroundColor: "rgba(26,25,32,0.85)",
                  border: `1px solid rgba(250,244,236,0.08)`,
                  borderRadius: "4px 18px 18px 18px",
                  padding: "18px 24px",
                }}
              >
                <div style={{ color: CREAM, fontFamily, fontSize: 28, lineHeight: 1.55 }}>
                  {AI_RESPONSE}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ opacity: Math.max(thinkOp, resultSty.opacity) }}>
                <AgentAvatar />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: thinkOp,
                    backgroundColor: "rgba(26,25,32,0.85)",
                    border: `1px solid rgba(250,244,236,0.08)`,
                    borderRadius: "4px 18px 18px 18px",
                    padding: "18px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {[0, 4, 8].map((offset, i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: MUTED,
                        opacity: makeDot(offset),
                      }}
                    />
                  ))}
                </div>

                <div
                  style={{
                    ...resultSty,
                    backgroundColor: "rgba(26,25,32,0.85)",
                    border: `1px solid rgba(250,244,236,0.10)`,
                    borderRadius: "4px 18px 18px 18px",
                    padding: "18px 24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <div style={{ color: CREAM, fontFamily, fontSize: 28, lineHeight: 1.55 }}>
                    Found the best prices across all three marketplaces:
                  </div>
                  <div style={{ opacity: csvOp }}>
                    <CsvFileCard filename="card_prices.csv" meta="3 cards · Best deals found" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ChatInputBar sendOp={sendOp} sendScale={sendScale} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Outro ────────────────────────────────────────────────────────────────────

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoomScale = interpolate(frame, [0, 400], [1, 1.08], C);
  const scrimOp = fIn(frame, 0, 10);

  const line1Sty = wp(frame, 6, 16);
  const line2Sty = wp(frame, 22, 18);
  const logoSty = si(frame, fps, 42);

  return (
    <AbsoluteFill>
      <Img
        src={staticFile("storyboard/card-collector-3.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoomScale})` }}
      />
      <AbsoluteFill style={{ backgroundColor: "rgba(10,10,15,0.65)", opacity: scrimOp, pointerEvents: "none" }} />
      <DotGrid opacity={0.07} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              ...line1Sty,
              color: CREAM,
              fontSize: 100,
              fontFamily,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textAlign: "center",
              padding: "0 48px",
            }}
          >
            Find the deal.
          </div>

          <div
            style={{
              ...line2Sty,
              fontSize: 100,
              fontFamily,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              textAlign: "center",
              padding: "0 48px",
              background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 40px ${ORANGE}44)`,
            }}
          >
            Fill the album.
          </div>

          <div style={{ ...logoSty, marginTop: 20 }}>
            <Img src={LOGO_LOCAL} style={{ height: 88 }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Root export ──────────────────────────────────────────────────────────────

export const CardCollectorVideo: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio
        src={staticFile("music/chill_background-the-weekend-117427.mp3")}
        volume={(f) => interpolate(f, [durationInFrames - 60, durationInFrames], [1, 0], C)}
      />

      <Sequence name="01 - Hook" from={0} durationInFrames={85}>
        <Hook />
      </Sequence>
      <Sequence name="02 - The Trigger" from={50} durationInFrames={130}>
        <TheTrigger />
      </Sequence>
      <Sequence name="03 - The Prompt & Result" from={180} durationInFrames={210}>
        <ThePromptAndResult />
      </Sequence>
      <Sequence name="05 - Outro" from={390} durationInFrames={150}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
