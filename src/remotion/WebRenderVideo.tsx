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
const CARD = "#1a1920";
const SUCCESS = "#10b981";
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

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 24, height: 1, backgroundColor: ORANGE, flexShrink: 0 }} />
    <div
      style={{
        fontFamily: monoFamily,
        fontSize: 15,
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "0.08em",
        color: ORANGE,
      }}
    >
      {children}
    </div>
  </div>
);

// ─── Scene 1: Hook (0–90, 3s) — no video ─────────────────────────────────────

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowSty = up(frame, fps, 4);
  const line1Sty = wp(frame, 12, 16);
  const line2Sty = wp(frame, 28, 18);
  const logoSty = si(frame, fps, 48);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
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
              Your entire CRM, enriched.
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

// ─── Scene 2: The Trigger (90–270, 6s) ────────────────────────────────────────

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
    <div
      style={{
        ...sty,
        display: "flex",
        gap: 16,
        alignItems: "flex-start",
        maxWidth: 720,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          backgroundColor: `${ORANGE}33`,
          border: `2px solid ${ORANGE}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: ORANGE_LIGHT,
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
          gap: 6,
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ color: CREAM, fontSize: 22, fontFamily, fontWeight: 700 }}>{name}</span>
          <span style={{ color: MUTED, fontSize: 14, fontFamily: monoFamily }}>{time}</span>
        </div>
        <div
          style={{
            color: CREAM,
            fontSize: 32,
            fontFamily,
            fontWeight: 400,
            lineHeight: 1.45,
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
};

const TheTrigger: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile("videos/Woman working on laptop.mp4")}
        trimBefore={60}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
          padding: "0 120px 120px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "flex-end",
          }}
        >
          <SlackBubble
            frame={frame}
            fps={fps}
            delay={20}
            name="Sarah M."
            initials="SM"
            time="2:14 PM"
            message="Hey — can you prep enriched contacts for the Acme pitch? Need it by 3pm 🙏"
          />
          <SlackBubble
            frame={frame}
            fps={fps}
            delay={90}
            name="Sarah M."
            initials="SM"
            time="2:14 PM"
            message="150 contacts in the sheet 👆"
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 3: The Prompt (270–450, 6s) — AI agent chat ────────────────────────

const PROMPT_TEXT =
  "Enrich our 150 contacts. Pull website, news, and LinkedIn data for each. Use Massive.";
const AI_RESPONSE =
  "On it — pulling enrichment data on 150 contacts now. This should take about 30 seconds.";

const ThePrompt: React.FC = () => {
  const frame = useCurrentFrame();

  const panelOp = fIn(frame, 2, 8);
  const promptReveal = interpolate(frame, [10, 58], [0, 100], C);
  const sendOp = fIn(frame, 63, 8);
  const sendScale = interpolate(
    spring({ frame: Math.max(0, frame - 63), fps: 30, config: { damping: 18, stiffness: 180 } }),
    [0, 1],
    [0.6, 1]
  );
  const aiOp = fIn(frame, 72, 8);
  const aiReveal = interpolate(frame, [76, 100], [0, 100], C);

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile("videos/Woman working on laptop - close up.mp4")}
        trimBefore={0}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />

      {/* Chat panel — centered */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", opacity: panelOp }}
      >
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
          {/* Header */}
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
                backgroundColor: SUCCESS,
                boxShadow: `0 0 6px ${SUCCESS}`,
              }}
            />
            <span style={{ color: CREAM, fontFamily, fontSize: 22, fontWeight: 600 }}>
              Agent
            </span>
            <span
              style={{
                color: MUTED,
                fontFamily: monoFamily,
                fontSize: 15,
                marginLeft: 6,
              }}
            >
              CRM Enrichment
            </span>
          </div>

          {/* Chat body */}
          <div
            style={{
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* User message — right-aligned */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  backgroundColor: `${ORANGE}22`,
                  border: `1px solid ${ORANGE}44`,
                  borderRadius: "18px 4px 18px 18px",
                  padding: "18px 24px",
                  maxWidth: "78%",
                  clipPath: `inset(0 ${100 - promptReveal}% 0 0 round 18px)`,
                }}
              >
                <div
                  style={{
                    color: CREAM,
                    fontFamily,
                    fontSize: 28,
                    lineHeight: 1.55,
                    fontWeight: 400,
                  }}
                >
                  {PROMPT_TEXT}
                </div>
              </div>
            </div>

            {/* AI response — left-aligned */}
            <div
              style={{
                opacity: aiOp,
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
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
              <div
                style={{
                  backgroundColor: "rgba(26,25,32,0.85)",
                  border: `1px solid rgba(250,244,236,0.08)`,
                  borderRadius: "4px 18px 18px 18px",
                  padding: "18px 24px",
                  clipPath: `inset(0 ${100 - aiReveal}% 0 0 round 18px)`,
                }}
              >
                <div
                  style={{
                    color: CREAM,
                    fontFamily,
                    fontSize: 28,
                    lineHeight: 1.55,
                  }}
                >
                  {AI_RESPONSE}
                </div>
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: `1px solid rgba(250,244,236,0.07)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: `1px solid rgba(250,244,236,0.07)`,
                borderRadius: 10,
                padding: "10px 16px",
                color: MUTED,
                fontFamily,
                fontSize: 18,
              }}
            >
              Message Agent...
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: ORANGE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: sendOp,
                transform: `scale(${sendScale})`,
                boxShadow: `0 0 16px ${ORANGE}55`,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 4: Massive in Action (450–750, 10s) — no video ─────────────────────

const DATA_ROWS = [
  { company: "Acme Corp", news: "Series B — $40M raised", li: true },
  { company: "Bright Ventures", news: "New product launch announced", li: true },
  { company: "Meridian Labs", news: "Hiring 50 engineers this quarter", li: true },
  { company: "Solvex AI", news: "Acquired by Microsoft for $120M", li: true },
  { company: "Anchor Health", news: "FDA approval secured last week", li: true },
];

const InAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dashSty = up(frame, fps, 4, 48);
  const headerOp = fIn(frame, 6, 12);
  const count = Math.round(interpolate(frame, [20, 210], [0, 150], C));
  const progressPct = interpolate(frame, [20, 210], [0, 100], C);
  const costOp = fIn(frame, 40, 12);
  const doneSty = si(frame, fps, 240);
  const doneOp = fIn(frame, 240, 10);
  const dashBlur = interpolate(frame, [252, 266], [0, 6], C);
  const popupSty = si(frame, fps, 256);
  const popupScrimOp = fIn(frame, 252, 14);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <DotGrid opacity={0.10} />

      <AbsoluteFill style={{ padding: "80px 100px" }}>
        <div
          style={{
            ...dashSty,
            flex: 1,
            height: "100%",
            backgroundColor: CARD,
            border: `1.5px solid ${ORANGE}44`,
            borderRadius: 24,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            filter: `blur(${dashBlur}px)`,
          }}
        >
          {/* ── Header bar ── */}
          <div
            style={{
              opacity: headerOp,
              padding: "0 36px",
              height: 60,
              flexShrink: 0,
              borderBottom: `1px solid rgba(250,244,236,0.08)`,
              backgroundColor: `rgba(215,73,57,0.06)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                color: MUTED,
                fontFamily: monoFamily,
                fontSize: 22,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Agent: CRM Enrichment
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: SUCCESS,
                  boxShadow: `0 0 8px ${SUCCESS}`,
                }}
              />
              <span
                style={{
                  color: SUCCESS,
                  fontFamily: monoFamily,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                Processing
              </span>
            </div>
          </div>

          {/* ── Two-column body ── */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

            {/* Left: enriching progress */}
            <div
              style={{
                width: 460,
                flexShrink: 0,
                borderRight: `1px solid rgba(250,244,236,0.08)`,
                padding: "44px 48px",
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              <Eyebrow>Enriching CRM</Eyebrow>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span
                    style={{
                      color: CREAM,
                      fontFamily,
                      fontSize: 96,
                      fontWeight: 900,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {count}
                  </span>
                  <span
                    style={{
                      color: MUTED,
                      fontFamily,
                      fontSize: 32,
                      fontWeight: 300,
                    }}
                  >
                    / 150
                  </span>
                </div>
                <span
                  style={{
                    color: MUTED,
                    fontFamily: monoFamily,
                    fontSize: 16,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  contacts enriched
                </span>

                {/* Progress bar */}
                <div
                  style={{
                    height: 6,
                    backgroundColor: `${ORANGE}22`,
                    borderRadius: 3,
                    overflow: "hidden",
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progressPct}%`,
                      background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_LIGHT})`,
                      borderRadius: 3,
                      boxShadow: `0 0 10px ${ORANGE}66`,
                    }}
                  />
                </div>
              </div>

              {/* Cost ticker */}
              <div style={{ opacity: costOp, display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: ORANGE_LIGHT,
                  }}
                />
                <span
                  style={{
                    color: ORANGE_LIGHT,
                    fontFamily: monoFamily,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  $0.003 / contact
                </span>
              </div>

              <div style={{ flex: 1 }} />

              {/* Done badge */}
              <div
                style={{
                  ...doneSty,
                  opacity: doneOp,
                  backgroundColor: `${SUCCESS}18`,
                  border: `1.5px solid ${SUCCESS}55`,
                  borderRadius: 12,
                  padding: "14px 20px",
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
                    backgroundColor: SUCCESS,
                    boxShadow: `0 0 6px ${SUCCESS}`,
                  }}
                />
                <span
                  style={{
                    color: SUCCESS,
                    fontFamily: monoFamily,
                    fontSize: 17,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  150 contacts enriched ✓
                </span>
              </div>
            </div>

            {/* Right: data rows */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {DATA_ROWS.map((row, i) => {
                const rowSty = up(frame, fps, 20 + i * 36, 28);
                return (
                  <div
                    key={i}
                    style={{
                      ...rowSty,
                      flex: 1,
                      padding: "0 44px",
                      borderBottom:
                        i < DATA_ROWS.length - 1
                          ? `1px solid rgba(250,244,236,0.06)`
                          : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 32,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span
                        style={{
                          color: CREAM,
                          fontFamily,
                          fontSize: 30,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {row.company}
                      </span>
                      <span
                        style={{
                          color: MUTED,
                          fontFamily,
                          fontSize: 24,
                          fontWeight: 300,
                          lineHeight: 1,
                        }}
                      >
                        {row.news}
                      </span>
                    </div>

                    {row.li && (
                      <div
                        style={{
                          flexShrink: 0,
                          backgroundColor: `${SUCCESS}18`,
                          border: `1px solid ${SUCCESS}44`,
                          borderRadius: 40,
                          padding: "8px 20px",
                          color: SUCCESS,
                          fontFamily: monoFamily,
                          fontSize: 16,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        LinkedIn ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Completion popup ── */}
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}
      >
        {/* Scrim behind popup */}
        <AbsoluteFill
          style={{ backgroundColor: "rgba(10,10,15,0.55)", opacity: popupScrimOp }}
        />

        {/* Popup card */}
        <div
          style={{
            ...popupSty,
            position: "relative",
            width: 660,
            backgroundColor: CARD,
            border: `1.5px solid ${SUCCESS}55`,
            borderRadius: 24,
            padding: "44px 52px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            boxShadow: `0 0 80px ${SUCCESS}18`,
          }}
        >
          {/* Success icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: `${SUCCESS}22`,
              border: `2px solid ${SUCCESS}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke={SUCCESS}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                color: CREAM,
                fontFamily,
                fontSize: 38,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              Task Complete
            </div>
            <div
              style={{
                color: MUTED,
                fontFamily,
                fontSize: 22,
                lineHeight: 1.45,
              }}
            >
              150 contacts enriched successfully
            </div>
          </div>

          <div
            style={{
              backgroundColor: ORANGE,
              borderRadius: 12,
              padding: "14px 52px",
              color: CREAM,
              fontFamily,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              boxShadow: `0 0 28px ${ORANGE}66`,
            }}
          >
            OK!
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Outro (750–900, 5s) ─────────────────────────────────────────────

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rayLen = interpolate(frame, [0, 14], [0, 700], C);
  const rayOp = interpolate(frame, [0, 5, 40, 60], [0, 0.3, 0.12, 0], C);
  const gradOp = interpolate(frame, [0, 20], [0, 0.5], C);
  const logoSty = si(frame, fps, 10);
  const urlSty = up(frame, fps, 28);
  const eyebrowSty = up(frame, fps, 42);

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile("videos/Woman done working.mp4")}
        trimBefore={0}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <DotGrid opacity={0.06} />

      {/* Burst rays */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: rayOp }}>
        <svg
          width="1920"
          height="1080"
          viewBox="0 0 1920 1080"
          style={{ position: "absolute" }}
        >
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return (
              <line
                key={i}
                x1="960"
                y1="540"
                x2={960 + Math.cos(angle) * rayLen}
                y2={540 + Math.sin(angle) * rayLen}
                stroke={ORANGE}
                strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Gradient glow bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45%",
          background: `linear-gradient(to top, ${ORANGE}33, transparent)`,
          opacity: gradOp,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            zIndex: 2,
          }}
        >
          <div style={logoSty}>
            <Img src={LOGO_LOCAL} style={{ height: 88 }} />
          </div>
          <div
            style={{
              ...urlSty,
              color: MUTED,
              fontSize: 18,
              fontFamily: monoFamily,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            joinmassive.com
          </div>
          <div style={eyebrowSty}>
            <Eyebrow>Web Render API</Eyebrow>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Root export ──────────────────────────────────────────────────────────────

export const WebRenderVideo: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio
        src={staticFile(
          "music/fassounds-good-night-lofi-cozy-chill-music-160166.mp3"
        )}
        volume={(f) =>
          interpolate(f, [durationInFrames - 60, durationInFrames], [1, 0], C)
        }
      />

      <Sequence name="01 - Hook" from={0} durationInFrames={90}>
        <Hook />
      </Sequence>
      <Sequence name="02 - The Trigger" from={90} durationInFrames={180}>
        <TheTrigger />
      </Sequence>
      <Sequence name="03 - The Prompt" from={270} durationInFrames={180}>
        <ThePrompt />
      </Sequence>
      <Sequence name="04 - In Action" from={450} durationInFrames={300}>
        <InAction />
      </Sequence>
      <Sequence name="05 - Outro" from={750} durationInFrames={150}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
