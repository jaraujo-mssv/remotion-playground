import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
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

// ─── Shared ───────────────────────────────────────────────────────────────────

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
      CRM Enrichment
    </span>
  </div>
);

const ChatInputBar: React.FC<{ sendOp?: number; sendScale?: number }> = ({
  sendOp = 0,
  sendScale = 1,
}) => (
  <div
    style={{
      padding: "12px 16px",
      borderTop: `1px solid rgba(250,244,236,0.07)`,
    }}
  >
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

// ─── Scene 1: Hook (0–60, 2s) ─────────────────────────────────────────────────

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSty = si(frame, fps, 4);
  const line1Sty = wp(frame, 16, 14);
  const line2Sty = wp(frame, 30, 16);
  const eyebrowSty = up(frame, fps, 48);
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
          <div style={{ ...logoSty }}>
            <Img src={LOGO_LOCAL} style={{ height: 72 }} />
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
              One prompt.
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
              Enrich your entire CRM.
            </div>
          </div>

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
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 2: The Trigger (60–150, 3s) ────────────────────────────────────────

const SlackBubble: React.FC<{
  frame: number;
  fps: number;
  delay: number;
  name: string;
  message: string;
  time: string;
  initials: string;
  avatarSrc?: string;
  avatarSize?: number;
  attachment?: React.ReactNode;
}> = ({ frame, fps, delay, name, message, time, initials, avatarSrc, avatarSize = 52, attachment }) => {
  const sty = up(frame, fps, delay, 24);
  return (
    <div
      style={{
        ...sty,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        maxWidth: 800,
      }}
    >
      {avatarSrc ? (
        <Img
          src={avatarSrc}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
            border: `2px solid ${ORANGE}`,
          }}
        />
      ) : (
        <div
          style={{
            width: avatarSize,
            height: avatarSize,
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
      )}
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
        <div
          style={{ color: CREAM, fontSize: 32, fontFamily, fontWeight: 400, lineHeight: 1.45 }}
        >
          {message}
        </div>
        {attachment && <div>{attachment}</div>}
      </div>
    </div>
  );
};

const TheTrigger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterOp = interpolate(frame, [0, 35], [0, 1], C);

  return (
    <AbsoluteFill style={{ opacity: enterOp }}>
      <OffthreadVideo
        src={staticFile("videos/Woman working on laptop.mp4")}
        trimBefore={50}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <Sequence from={16}><Audio src={staticFile("sfx/notification.mp3")} /></Sequence>
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
            name="Sarah M."
            initials="SM"
            avatarSrc={staticFile("images/sarah.png")}
            avatarSize={70}
            time="2:14 PM"
            message="Hey, can you enrich contacts from Hubspot for our automated campaigns this week? Here's the CSV 🙏 thanks!"
            attachment={<CsvFileCard filename="contacts_list.csv" meta="150 contacts" />}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3+4: Prompt & Result (150–360, 7s) ────────────────────────────────

const PROMPT_TEXT =
  "Enrich 150 contacts. Pulling info from their websites, news, social media, ChatGPT, and Perplexity using Massive Web Render.";
const AI_RESPONSE =
  "On it – pulling enrichment data for 150 contacts now from various sources.";

const ThePromptAndResult: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelOp = fIn(frame, 2, 8);
  const sendOp = fIn(frame, 57, 8);
  const sendScale = interpolate(
    spring({ frame: Math.max(0, frame - 57), fps, config: { damping: 18, stiffness: 180 } }),
    [0, 1],
    [0.6, 1]
  );

  // Slide-up entrance for each bubble
  const promptSty = up(frame, fps, 10, 24);
  const aiSty = up(frame, fps, 65, 24);
  const resultSty = up(frame, fps, 122, 24);

  // Thinking dots: appear at 82, hold, fade out before result
  const thinkOp = interpolate(frame, [82, 88, 118, 130], [0, 1, 1, 0], C);
  const dt = Math.max(0, frame - 82);
  const makeDot = (offset: number) =>
    interpolate((dt + offset) % 12, [0, 6, 12], [0.25, 1, 0.25], C);

  // CSV card appears after result text is in view
  const csvOp = fIn(frame, 158, 12);

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile("videos/Woman working on laptop - close up.mp4")}
        trimBefore={0}
        volume={(f) => interpolate(f, [67, 82], [1, 0], C)}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <Sequence from={158}><Audio src={staticFile("sfx/sucess.mp3")} /></Sequence>

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
            {/* User prompt with CSV attachment */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  ...promptSty,
                  backgroundColor: `${ORANGE}22`,
                  border: `1px solid ${ORANGE}44`,
                  borderRadius: "18px 4px 18px 18px",
                  padding: "18px 24px",
                  maxWidth: "80%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ color: CREAM, fontFamily, fontSize: 28, lineHeight: 1.55 }}>
                  {PROMPT_TEXT}
                </div>
                <CsvFileCard filename="contacts_list.csv" meta="150 contacts" />
              </div>
            </div>

            {/* Agent "On it..." */}
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

            {/* Third slot: thinking dots → result message + CSV, same visual space */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ opacity: Math.max(thinkOp, resultSty.opacity) }}>
                <AgentAvatar />
              </div>
              <div style={{ position: "relative", flex: 1 }}>
                {/* Thinking dots — absolute overlay, fades out */}
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

                {/* Result message + CSV — in flow, sets container height, slides up */}
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
                    Ok. Ready, here's your CSV
                  </div>
                  <div style={{ opacity: csvOp }}>
                    <CsvFileCard filename="enriched_contacts.csv" meta="150 contacts enriched · Ready" />
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

// ─── Scene 5: Outro (360–450, 3s) ─────────────────────────────────────────────

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scrimOp = fIn(frame, 0, 10);
  const line1Sty = wp(frame, 6, 16);
  const line2Sty = wp(frame, 22, 18);
  const logoSty = si(frame, fps, 42);

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile("videos/Woman done working.mp4")}
        trimBefore={90}
        muted
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />

      <AbsoluteFill
        style={{
          backgroundColor: "rgba(10,10,15,0.65)",
          opacity: scrimOp,
          pointerEvents: "none",
        }}
      />
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
            Let the web
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
            work for you.
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

export const WebRenderVideoV2: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio
        src={staticFile("music/fassounds-good-night-lofi-cozy-chill-music-160166.mp3")}
        volume={(f) =>
          interpolate(f, [durationInFrames - 60, durationInFrames], [1, 0], C)
        }
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
