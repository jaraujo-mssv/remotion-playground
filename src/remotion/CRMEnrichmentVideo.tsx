import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
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
const LOGO_WHITE =
  "https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c10559f51353fed1c27b0_logo-white.svg";

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

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 24, height: 1, backgroundColor: ORANGE, flexShrink: 0 }} />
    <div style={{
      fontFamily: monoFamily,
      fontSize: 14,
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
      color: ORANGE,
    }}>
      {children}
    </div>
  </div>
);

const DotGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.16 }) => (
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

const Brackets: React.FC<{ frame: number }> = ({ frame }) => {
  const w = interpolate(frame, [0, 10], [0, 44], C);
  const h = interpolate(frame, [2, 12], [0, 44], C);
  const op = fIn(frame, 0, 6);
  const T = 3;
  const M = 52;
  const bar = (style: React.CSSProperties): React.CSSProperties => ({
    position: "absolute", backgroundColor: ORANGE, ...style,
  });
  return (
    <AbsoluteFill style={{ opacity: op, pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: M, left: M }}>
        <div style={bar({ top: 0, left: 0, width: w, height: T })} />
        <div style={bar({ top: 0, left: 0, width: T, height: h })} />
      </div>
      <div style={{ position: "absolute", top: M, right: M }}>
        <div style={bar({ top: 0, right: 0, width: w, height: T })} />
        <div style={bar({ top: 0, right: 0, width: T, height: h })} />
      </div>
      <div style={{ position: "absolute", bottom: M, left: M }}>
        <div style={bar({ bottom: 0, left: 0, width: w, height: T })} />
        <div style={bar({ bottom: 0, left: 0, width: T, height: h })} />
      </div>
      <div style={{ position: "absolute", bottom: M, right: M }}>
        <div style={bar({ bottom: 0, right: 0, width: w, height: T })} />
        <div style={bar({ bottom: 0, right: 0, width: T, height: h })} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 1: Hook (0–75, 2.5s) ──────────────────────────────────────────────
// "Enrich your entire CRM / in 3 steps. / At a fraction of the cost."

const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  const lines = [
    { text: "Enrich your entire CRM", delay: 0 },
    { text: "in 3 steps.", delay: 18, orange: true, large: true },
    { text: "At a fraction of the cost.", delay: 44 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", padding: "0 180px" }}>
      <DotGrid />
      <Brackets frame={frame} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {lines.map(({ text, delay, orange, large }, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <div
              style={{
                ...wp(frame, delay),
                fontSize: large ? 110 : 80,
                fontFamily,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                ...(orange ? {
                  background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: `drop-shadow(0 0 40px ${ORANGE}44)`,
                } : { color: CREAM }),
              }}
            >
              {text}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: The Problem (75–195, 4s) ───────────────────────────────────────
// Old way vs new way

const OldWayRow: React.FC<{ label: string; frame: number; delay: number; strike?: boolean }> = ({
  label, frame, delay, strike,
}) => {
  const sty = up(frame, useVideoConfig().fps, delay);
  const strikeW = interpolate(Math.max(0, frame - delay - 10), [0, 16], [0, 100], C);
  return (
    <div style={{ ...sty, display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: MUTED, flexShrink: 0 }} />
      <div style={{ color: MUTED, fontSize: 38, fontFamily, fontWeight: 400, position: "relative" }}>
        {label}
        {strike && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: 3,
            width: `${strikeW}%`,
            backgroundColor: ORANGE,
            borderRadius: 2,
          }} />
        )}
      </div>
    </div>
  );
};

const TheProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const head = up(frame, fps, 0);
  const dividerW = interpolate(frame, [14, 36], [0, 660], C);
  const subhead = up(frame, fps, 72);
  const newLine = up(frame, fps, 86);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", padding: "0 180px" }}>
      <DotGrid />
      <Brackets frame={frame} />
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {/* Old way */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={head}>
            <Eyebrow>The Old Way</Eyebrow>
          </div>
          <div style={{ height: 1, width: dividerW, backgroundColor: MUTED, opacity: 0.3 }} />
          <OldWayRow label="Pay $0.50–$2 per contact" frame={frame} delay={18} strike />
          <OldWayRow label="Data goes stale within weeks" frame={frame} delay={30} strike />
          <OldWayRow label="Locked into one vendor's database" frame={frame} delay={42} strike />
        </div>

        {/* New way */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={subhead}>
            <Eyebrow>The Massive Way</Eyebrow>
          </div>
          <div
            style={{
              ...newLine,
              color: CREAM,
              fontSize: 52,
              fontFamily,
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
            }}
          >
            Real-time data from the web — at AI pricing.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Step scene layout ────────────────────────────────────────────────────────

interface StepProps {
  num: string;
  title: string;
  sub: string;
  bullets: string[];
  renderGraphic: (frame: number, fps: number) => React.ReactNode;
}

const StepScene: React.FC<StepProps> = ({ num, title, sub, bullets, renderGraphic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const numSty = si(frame, fps, 0);
  const titleSty = up(frame, fps, 8);
  const subSty = up(frame, fps, 18);
  const divW = interpolate(frame, [12, 32], [0, 680], C);
  const bSty = bullets.map((_, i) => up(frame, fps, 32 + i * 12));

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <DotGrid />
      <Brackets frame={frame} />

      {/* 50/50 split */}
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* Left: text */}
        <div style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 60px 0 100px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={numSty}>
              <Eyebrow>Step {num}</Eyebrow>
            </div>
            <div style={{ ...titleSty, color: CREAM, fontSize: 72, fontFamily, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>
              {title}
            </div>
            <div style={{ ...subSty, color: MUTED, fontSize: 22, fontFamily: monoFamily, fontWeight: 400 }}>
              {sub}
            </div>
            <div style={{ height: 2, width: divW, backgroundColor: ORANGE, opacity: 0.5 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {bullets.map((b, i) => (
                <div key={i} style={{ ...bSty[i], display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: ORANGE, flexShrink: 0 }} />
                  <div style={{ color: MUTED, fontSize: 34, fontFamily, fontWeight: 400, lineHeight: 1.3 }}>
                    {b}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: graphic */}
        <div style={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: fIn(frame, 4, 14),
        }}>
          {renderGraphic(frame, fps)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Step graphics ────────────────────────────────────────────────────────────

// Step 1: Animated CSV file with download arrow
const CSVGraphic: React.FC<{ frame: number }> = ({ frame }) => {
  const fileScale = spr(frame, useVideoConfig().fps, 0, 20, 160);
  const fileS = interpolate(fileScale, [0, 1], [0.6, 1]);
  const fileOp = fIn(frame, 0, 10);

  // Rows draw in one by one
  const rows = [0, 1, 2, 3, 4];
  const rowW = rows.map((r) =>
    interpolate(Math.max(0, frame - 16 - r * 8), [0, 14], [0, 200], C)
  );

  // Download arrow
  const arrowY = interpolate(frame, [50, 70], [0, 18], C);
  const arrowOp = interpolate(frame, [48, 58], [0, 1], C);

  return (
    <svg viewBox="0 0 320 380" style={{ width: 700, height: 831, opacity: fileOp }}>
      {/* File body */}
      <g transform={`scale(${fileS}) translate(${(1 - fileS) * 160}, ${(1 - fileS) * 190})`}>
        {/* Page */}
        <rect x="30" y="10" width="220" height="280" rx="10"
          fill={CARD} stroke={ORANGE} strokeWidth="2.5" />
        {/* Dog-ear */}
        <path d="M200 10 L250 60 L200 60 Z" fill={BG} stroke={ORANGE} strokeWidth="2.5" />
        {/* Header row */}
        <rect x="30" y="10" width="170" height="44" rx="10"
          fill={`${ORANGE}33`} />
        {/* Header labels */}
        <rect x="44" y="24" width="60" height="8" rx="4" fill={ORANGE} opacity="0.8" />
        <rect x="116" y="24" width="44" height="8" rx="4" fill={ORANGE} opacity="0.5" />
        <rect x="172" y="24" width="44" height="8" rx="4" fill={ORANGE} opacity="0.5" />
        {/* Column dividers */}
        <line x1="110" y1="54" x2="110" y2="290" stroke={ORANGE} strokeWidth="1" opacity="0.2" />
        <line x1="174" y1="54" x2="174" y2="290" stroke={ORANGE} strokeWidth="1" opacity="0.2" />
        {/* Data rows */}
        {rows.map((r) => (
          <g key={r}>
            <rect x="44" y={64 + r * 42} width={rowW[r] * 0.35} height="8" rx="4"
              fill={CREAM} opacity="0.5" />
            <rect x="116" y={64 + r * 42} width={rowW[r] * 0.24} height="8" rx="4"
              fill={MUTED} opacity="0.4" />
            <rect x="174" y={64 + r * 42} width={rowW[r] * 0.24} height="8" rx="4"
              fill={MUTED} opacity="0.4" />
            <line x1="30" y1={84 + r * 42} x2="250" y2={84 + r * 42}
              stroke={ORANGE} strokeWidth="1" opacity="0.12" />
          </g>
        ))}
      </g>
      {/* Download arrow */}
      <g opacity={arrowOp} transform={`translateY(${arrowY})`}>
        <line x1="160" y1="304" x2="160" y2="344" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
        <line x1="140" y1="328" x2="160" y2="348" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
        <line x1="180" y1="328" x2="160" y2="348" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
        {/* Platform badges */}
        {["Salesforce", "HubSpot", "Notion"].map((p, i) => (
          <g key={p} opacity={fIn(frame, 60 + i * 8, 8)}>
            <rect x={40 + i * 84} y={362} width={76} height={22} rx={11}
              fill={`${ORANGE}22`} stroke={`${ORANGE}55`} strokeWidth="1" />
            <text x={78 + i * 84} y={377} textAnchor="middle"
              fill={CREAM} fontSize="11" fontFamily={fontFamily} fontWeight={500}>
              {p}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

// Step 2: Agent with skill being plugged in
const SkillGraphic: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const agentScale = spr(frame, fps, 0, 20, 160);
  const agentS = interpolate(agentScale, [0, 1], [0.7, 1]);
  const agentOp = fIn(frame, 0, 10);

  // Plugin piece slides in from the right
  const plugX = interpolate(frame, [22, 42], [340, 218], C);
  const plugOp = fIn(frame, 20, 10);

  // Connection lines radiate out after plug connects
  const lineOp = interpolate(frame, [44, 56], [0, 0.6], C);
  const lineLen = interpolate(frame, [44, 60], [0, 60], C);

  // Agents listed
  const agents = ["Claude", "ChatGPT", "Gemini", "Copilot"];

  return (
    <svg viewBox="0 0 360 360" style={{ width: 760, height: 760, opacity: agentOp }}>
      {/* Outer ring */}
      <circle cx="160" cy="170"
        r={interpolate(agentS, [0.7, 1], [63, 90])}
        fill="none" stroke={ORANGE} strokeWidth="2.5"
        transform={`scale(${agentS}) translate(${(1 - agentS) * 160}, ${(1 - agentS) * 170})`}
      />
      {/* Inner ring */}
      <circle cx="160" cy="170" r="55" fill={`${ORANGE}18`} stroke={ORANGE} strokeWidth="1.5" opacity={agentS} />
      {/* Brain nodes */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const nx = 160 + 55 * Math.cos(rad);
        const ny = 170 + 55 * Math.sin(rad);
        return (
          <circle key={i} cx={nx} cy={ny} r="5" fill={ORANGE}
            opacity={interpolate(agentS, [0.7, 1], [0, 1])} />
        );
      })}
      {/* Center dot */}
      <circle cx="160" cy="170" r="12" fill={ORANGE} opacity={agentS} />
      <circle cx="160" cy="170" r="6" fill={BG} opacity={agentS} />

      {/* Radiating lines after connection */}
      {[30, 90, 150, 210, 270, 330].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={160 + 90 * Math.cos(rad)} y1={170 + 90 * Math.sin(rad)}
            x2={160 + (90 + lineLen) * Math.cos(rad)}
            y2={170 + (90 + lineLen) * Math.sin(rad)}
            stroke={ORANGE_LIGHT} strokeWidth="1.5" opacity={lineOp}
          />
        );
      })}

      {/* Skill plugin block */}
      <g opacity={plugOp}>
        <rect x={plugX} y="142" width="60" height="56" rx="8"
          fill={`${ORANGE}33`} stroke={ORANGE} strokeWidth="2.5" />
        <rect x={plugX + 10} y="158" width="40" height="8" rx="4" fill={ORANGE} opacity="0.8" />
        <rect x={plugX + 10} y="172" width="28" height="6" rx="3" fill={ORANGE} opacity="0.4" />
        {/* Plug prongs */}
        <line x1={plugX} y1="158" x2={plugX - 12} y2="158" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
        <line x1={plugX} y1="180" x2={plugX - 12} y2="180" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Agent labels around edge */}
      {agents.map((a, i) => {
        const deg = i * 90 - 45;
        const rad = (deg * Math.PI) / 180;
        const lx = 160 + 130 * Math.cos(rad);
        const ly = 170 + 130 * Math.sin(rad);
        return (
          <g key={a} opacity={fIn(frame, 50 + i * 6, 8)}>
            <rect x={lx - 38} y={ly - 13} width={76} height={26} rx={13}
              fill={`${ORANGE}22`} stroke={`${ORANGE}55`} strokeWidth="1" />
            <text x={lx} y={ly + 5} textAnchor="middle"
              fill={CREAM} fontSize="13" fontFamily={fontFamily} fontWeight={500}>
              {a}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Step 3: Prompt window → enriched data
const PromptGraphic: React.FC<{ frame: number }> = ({ frame }) => {
  const winOp = fIn(frame, 0, 10);
  // Prompt text appears character by character via clip
  const promptReveal = interpolate(frame, [14, 38], [0, 100], C);
  const PROMPT_TEXT = '"Enrich these contacts with Massive"';

  // Enriched data rows appear below
  const enrichedRows = [
    { label: "Website", val: "acme.com/about" },
    { label: "LinkedIn", val: "linkedin.com/company/acme" },
    { label: "News", val: "Series B — $40M raised" },
    { label: "HQ", val: "San Francisco, CA" },
  ];

  return (
    <svg viewBox="0 0 340 380" style={{ width: 700, height: 782, opacity: winOp }}>
      {/* Terminal window */}
      <rect x="10" y="10" width="310" height="140" rx="12"
        fill={CARD} stroke={ORANGE} strokeWidth="2" />
      {/* Traffic lights */}
      <circle cx="34" cy="32" r="6" fill={ORANGE} />
      <circle cx="54" cy="32" r="6" fill={`${ORANGE}66`} />
      <circle cx="74" cy="32" r="6" fill={`${ORANGE}33`} />
      {/* Prompt line */}
      <text x="26" y="68" fill={MUTED} fontSize="13" fontFamily="monospace" opacity="0.8">
        &gt;
      </text>
      {/* Prompt text with clip reveal */}
      <clipPath id="promptClip">
        <rect x="0" y="0" width={`${promptReveal}%`} height="200" />
      </clipPath>
      <text x="40" y="68" fill={ORANGE_LIGHT} fontSize="13" fontFamily="monospace" clipPath="url(#promptClip)">
        {PROMPT_TEXT}
      </text>
      {/* Cursor blink */}
      <rect
        x={40 + (PROMPT_TEXT.length * 7.7 * promptReveal) / 100}
        y="56" width="8" height="16"
        fill={ORANGE}
        opacity={interpolate(Math.floor(frame / 6) % 2, [0, 1], [0, 1], C)}
      />
      {/* Processing dots */}
      {[0, 1, 2].map((i) => (
        <circle key={i}
          cx={120 + i * 20} cy={108}
          r="5"
          fill={ORANGE}
          opacity={interpolate(
            Math.max(0, frame - 40 - i * 5),
            [0, 8, 14, 20], [0, 1, 1, 0], C
          )}
        />
      ))}

      {/* Enriched output rows */}
      {enrichedRows.map((row, i) => {
        const rowOp = fIn(frame, 50 + i * 10, 10);
        const rowX = interpolate(Math.max(0, frame - 50 - i * 10), [0, 12], [30, 0], C);
        return (
          <g key={i} opacity={rowOp} transform={`translateX(${rowX})`}>
            <rect x="10" y={162 + i * 50} width="310" height="42" rx="8"
              fill={i % 2 === 0 ? `${ORANGE}18` : `${ORANGE}0d`}
              stroke={`${ORANGE}33`} strokeWidth="1" />
            <text x="26" y={188 + i * 50} fill={MUTED} fontSize="12" fontFamily="monospace">
              {row.label}
            </text>
            <text x="110" y={188 + i * 50} fill={CREAM} fontSize="12" fontFamily="monospace" fontWeight={500}>
              {row.val}
            </text>
            {/* Green check */}
            <circle cx="302" cy={183 + i * 50} r="8" fill={"#5BA87333"} />
            <text x="302" y={187 + i * 50} textAnchor="middle" fill={"#5BA873"} fontSize="10">✓</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Scene 6: Cost Comparison (510–600, 3s) ───────────────────────────────────

const CostComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headSty = up(frame, fps, 0);
  const subSty = up(frame, fps, 12);

  const BAR_MAX = 260;
  const otherH = interpolate(frame, [18, 42], [0, BAR_MAX], C);
  const massiveH = interpolate(frame, [28, 48], [0, BAR_MAX * 0.08], C);
  const otherOp = fIn(frame, 18, 10);
  const massiveOp = fIn(frame, 28, 10);
  const labelOp = fIn(frame, 50, 8);

  const tagSty = up(frame, fps, 58);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", padding: "0 160px" }}>
      <DotGrid />
      <Brackets frame={frame} />

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ ...headSty, color: CREAM, fontSize: 72, fontFamily, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}>
            A fraction of the cost.
          </div>
          <div style={{ ...subSty, color: MUTED, fontSize: 28, fontFamily, fontWeight: 300 }}>
            Real-time enrichment at AI pricing — not legacy database rates.
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 60 }}>
          {/* Other tools bar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              opacity: fIn(frame, 50, 8),
              color: MUTED,
              fontSize: 28,
              fontFamily,
              fontWeight: 600,
            }}>
              $0.50–$2
              <span style={{ fontSize: 18, display: "block", fontWeight: 400 }}>per contact</span>
            </div>
            <div style={{
              width: 140,
              height: otherH,
              backgroundColor: "#607691",
              borderRadius: "8px 8px 0 0",
              opacity: otherOp,
            }} />
            <div style={{
              opacity: labelOp,
              color: MUTED,
              fontSize: 24,
              fontFamily,
              fontWeight: 500,
              textAlign: "center",
            }}>
              Legacy tools
              <span style={{ display: "block", fontSize: 18, opacity: 0.6 }}>ZoomInfo, Apollo…</span>
            </div>
          </div>

          {/* Massive bar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              opacity: fIn(frame, 54, 8),
              color: ORANGE,
              fontSize: 28,
              fontFamily,
              fontWeight: 700,
              textShadow: `0 0 40px ${ORANGE}44`,
            }}>
              Pennies
              <span style={{ fontSize: 18, display: "block", fontWeight: 400, color: ORANGE_LIGHT }}>per contact</span>
            </div>
            <div style={{
              width: 140,
              height: massiveH,
              background: `linear-gradient(to top, ${ORANGE}, ${ORANGE_LIGHT})`,
              borderRadius: "8px 8px 0 0",
              opacity: massiveOp,
              boxShadow: `0 0 30px ${ORANGE}55`,
            }} />
            <div style={{
              opacity: labelOp,
              color: CREAM,
              fontSize: 24,
              fontFamily,
              fontWeight: 600,
              textAlign: "center",
            }}>
              Massive
              <span style={{ display: "block", fontSize: 18, color: MUTED, fontWeight: 400 }}>Real-time web data</span>
            </div>
          </div>

          {/* Axis */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: MUTED,
            opacity: 0.2,
          }} />
        </div>

        {/* Tag line */}
        <div style={{
          ...tagSty,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          backgroundColor: `${ORANGE}22`,
          border: `1px solid ${ORANGE}55`,
          padding: "12px 28px",
          borderRadius: 40,
          alignSelf: "flex-start",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: ORANGE }} />
          <div style={{ color: CREAM, fontSize: 28, fontFamily, fontWeight: 600 }}>
            Always fresh — pulled live from the web
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 7: Outro (600–660, 2s) ────────────────────────────────────────────

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rayLen = interpolate(frame, [0, 14], [0, 700], C);
  const rayOp = interpolate(frame, [0, 5, 36, 60], [0, 0.3, 0.12, 0], C);
  const gradOp = interpolate(frame, [0, 20], [0, 0.5], C);
  const logoSty = si(frame, fps, 5);
  const line1 = up(frame, fps, 18);
  const line2 = up(frame, fps, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <DotGrid opacity={0.1} />

      <AbsoluteFill style={{ pointerEvents: "none", opacity: rayOp }}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return (
              <line key={i} x1="960" y1="540"
                x2={960 + Math.cos(angle) * rayLen}
                y2={540 + Math.sin(angle) * rayLen}
                stroke={ORANGE} strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
        background: `linear-gradient(to top, ${ORANGE}44, transparent)`,
        opacity: gradOp,
      }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, zIndex: 2 }}>
        <div style={logoSty}>
          <Img src={LOGO_WHITE} style={{ height: 72 }} />
        </div>
        <div style={{ ...line1, color: CREAM, fontSize: 36, fontFamily, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Start enriching your CRM today
        </div>
        <div style={{ ...line2, color: MUTED, fontSize: 16, fontFamily: monoFamily, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          joinmassive.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export const CRMEnrichmentVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    {/* 1 – Hook (0–75) */}
    <Sequence from={0} durationInFrames={75}>
      <Hook />
    </Sequence>

    {/* 2 – Problem (75–195) */}
    <Sequence from={75} durationInFrames={120}>
      <TheProblem />
    </Sequence>

    {/* 3 – Step 01: Export (195–315) */}
    <Sequence from={195} durationInFrames={120}>
      <StepScene
        num="01"
        title="Export your contacts"
        sub="Download a CSV from any CRM or spreadsheet"
        bullets={[
          "Salesforce, HubSpot, Notion, or a spreadsheet",
          "Any list of names, emails, or company URLs",
        ]}
        renderGraphic={(f) => <CSVGraphic frame={f} />}
      />
    </Sequence>

    {/* 4 – Step 02: Add skill (315–435) */}
    <Sequence from={315} durationInFrames={120}>
      <StepScene
        num="02"
        title="Add the Massive skill"
        sub="Upload to your AI agent of choice"
        bullets={[
          "Works with Claude, ChatGPT, Gemini & Copilot",
          "Find the skills zip in your Massive dashboard",
        ]}
        renderGraphic={(f, fps) => <SkillGraphic frame={f} fps={fps} />}
      />
    </Sequence>

    {/* 5 – Step 03: Prompt (435–555) */}
    <Sequence from={435} durationInFrames={120}>
      <StepScene
        num="03"
        title="Prompt it — done"
        sub="Get enriched data pulled live from the web"
        bullets={[
          "Company websites, news, LinkedIn & search results",
          "Always fresh — no stale database records",
        ]}
        renderGraphic={(f) => <PromptGraphic frame={f} />}
      />
    </Sequence>

    {/* 6 – Cost (555–645) */}
    <Sequence from={555} durationInFrames={90}>
      <CostComparison />
    </Sequence>

    {/* 7 – Outro (645–705) */}
    <Sequence from={645} durationInFrames={60}>
      <Outro />
    </Sequence>
  </AbsoluteFill>
);
