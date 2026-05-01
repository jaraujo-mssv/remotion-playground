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

// Faster defaults: stiffness=200 settles in ~12-15 frames at 30fps
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

// ─── Shared elements ──────────────────────────────────────────────────────────

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

const DotGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.18 }) => (
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

const Brackets: React.FC<{ frame: number; delay?: number }> = ({ frame, delay = 0 }) => {
  const f = Math.max(0, frame - delay);
  const w = interpolate(f, [0, 10], [0, 44], C);
  const h = interpolate(f, [2, 12], [0, 44], C);
  const op = fIn(frame, delay, 6);
  const T = 3;
  const M = 52;
  const bar = (style: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    backgroundColor: ORANGE,
    ...style,
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

// ─── Scene 1: Logo Intro (0–45, 1.5s) ────────────────────────────────────────

const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOp = fIn(frame, 0, 6);
  const logoScale = spr(frame, fps, 0, 20, 180);
  const lineW = interpolate(frame, [5, 18], [0, 260], C);
  const tagSty = up(frame, fps, 14);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <DotGrid />

      {/* Pulse rings — shorter period to fit in 45f */}
      {[0, 14, 28].map((offset, i) => {
        const f = (frame + offset) % 42;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: 200,
              height: 200,
              borderRadius: "50%",
              border: `2px solid ${ORANGE}`,
              opacity: interpolate(f, [0, 42], [0.7, 0], C),
              transform: `scale(${interpolate(f, [0, 42], [0.3, 3], C)})`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Rotating dashed ring */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          transform: `rotate(${frame * 2}deg)`,
          pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 300 300" style={{ width: "100%", height: "100%" }}>
          <circle
            cx="150" cy="150" r="138"
            fill="none" stroke={ORANGE} strokeWidth="2"
            strokeDasharray="60 450" opacity="0.5"
          />
          <circle
            cx="150" cy="150" r="138"
            fill="none" stroke={ORANGE_LIGHT} strokeWidth="1"
            strokeDasharray="20 490" opacity="0.3"
            transform="rotate(120, 150, 150)"
          />
        </svg>
      </div>

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          opacity: logoOp,
          transform: `scale(${interpolate(logoScale, [0, 1], [0.8, 1])})`,
          zIndex: 2,
        }}
      >
        <Img src={LOGO_WHITE} style={{ height: 68 }} />
      </div>

      {/* Line + tagline */}
      <div
        style={{
          position: "absolute",
          top: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div style={{ height: 2, width: lineW, backgroundColor: ORANGE }} />
        <div
          style={{
            ...tagSty,
            color: MUTED,
            fontSize: 16,
            fontFamily: monoFamily,
            letterSpacing: "0.08em",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Real-time web access for AI
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Opening Statement (45–165, 4s) ──────────────────────────────────

const OpeningStatement: React.FC = () => {
  const frame = useCurrentFrame();
  const barH = interpolate(frame, [0, 20], [0, 380], C);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 200px",
      }}
    >
      <DotGrid />
      <Brackets frame={frame} />

      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          left: 116,
          top: "50%",
          transform: "translateY(-50%)",
          width: 4,
          height: barH,
          backgroundColor: ORANGE,
          borderRadius: 2,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {[
          { text: "The internet wasn't built", color: CREAM, size: 80, weight: 700, delay: 0 },
          { text: "for machines.", color: ORANGE, size: 96, weight: 900, delay: 20 },
          { text: "It was built for humans.", color: CREAM, size: 80, weight: 700, delay: 46, mt: 14 },
          { text: "We bridge the gap.", color: CREAM, size: 80, weight: 900, delay: 70 },
        ].map(({ text, color, size, weight, delay, mt }, i) => (
          <div key={i} style={{ overflow: "hidden", marginTop: mt ?? 0 }}>
            <div
              style={{
                ...wp(frame, delay, 16),
                color,
                fontSize: size,
                fontFamily,
                fontWeight: weight,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
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

// ─── Scene 3: Product Statement (165–255, 3s) ─────────────────────────────────

const NetworkGraphic: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const nodes = [
    { x: 90, y: 90, delay: 4 },
    { x: 260, y: 50, delay: 10 },
    { x: 360, y: 180, delay: 16 },
    { x: 200, y: 270, delay: 8 },
    { x: 50, y: 220, delay: 13 },
  ];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2]];

  return (
    <svg viewBox="0 0 420 320" style={{ width: 420, height: 320, opacity: 0.65 }}>
      {edges.map(([a, b], i) => {
        const na = nodes[a], nb = nodes[b];
        const prog = interpolate(Math.max(0, frame - 6 - i * 3), [0, 14], [0, 1], C);
        return (
          <line
            key={i}
            x1={na.x} y1={na.y}
            x2={na.x + (nb.x - na.x) * prog}
            y2={na.y + (nb.y - na.y) * prog}
            stroke={ORANGE} strokeWidth="1.5" opacity="0.5"
          />
        );
      })}
      {nodes.map((n, i) => {
        const s = spr(frame, fps, n.delay, 20, 160);
        const r = interpolate(s, [0, 1], [0, 10]);
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={r * 2.5} fill={ORANGE} opacity="0.12" />
            <circle cx={n.x} cy={n.y} r={r} fill={ORANGE} />
          </g>
        );
      })}
    </svg>
  );
};

const ProductStatement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const w1 = si(frame, fps, 0);
  const w2 = up(frame, fps, 10);
  const w3 = up(frame, fps, 24);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <DotGrid />

      {/* Faint Massive logo watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.06,
          pointerEvents: "none",
        }}
      >
        <Img src={LOGO_WHITE} style={{ width: 900 }} />
      </div>

      {/* Network top-right */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 60,
          opacity: interpolate(frame, [8, 22], [0, 0.7], C),
        }}
      >
        <NetworkGraphic frame={frame} fps={fps} />
      </div>

      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            ...w1,
            fontSize: 148,
            fontFamily,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            background: `linear-gradient(135deg, ${ORANGE} 0%, ${ORANGE_LIGHT} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 60px ${ORANGE}44)`,
          }}
        >
          Massive
        </div>
        <div style={{ ...w2, color: CREAM, fontSize: 54, fontFamily, fontWeight: 300, letterSpacing: "-0.02em" }}>
          is real-time web access
        </div>
        <div style={{ ...w3, color: ORANGE_LIGHT, fontSize: 70, fontFamily, fontWeight: 800, letterSpacing: "-0.03em" }}>
          for AI.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const CRMIcon: React.FC<{ frame: number }> = ({ frame }) => {
  const CIRC = 2 * Math.PI * 32;
  const headDash = interpolate(frame, [0, 18], [CIRC, 0], C);
  const bodyDash = interpolate(frame, [10, 26], [120, 0], C);
  const dbOp = fIn(frame, 22, 10);
  const connDash = interpolate(frame, [34, 48], [100, 0], C);

  return (
    <svg viewBox="0 0 300 300" style={{ width: 760, height: 760 }}>
      <circle
        cx="88" cy="78" r="32"
        fill="none" stroke={ORANGE} strokeWidth="3"
        strokeDasharray={CIRC} strokeDashoffset={headDash}
        strokeLinecap="round"
      />
      <path
        d="M22 185 Q88 140 154 185"
        fill="none" stroke={ORANGE} strokeWidth="3"
        strokeDasharray="130" strokeDashoffset={bodyDash}
        strokeLinecap="round"
      />
      <g opacity={dbOp}>
        <ellipse cx="222" cy="148" rx="52" ry="14" fill={`${ORANGE}25`} stroke={ORANGE} strokeWidth="2.5" />
        <line x1="170" y1="148" x2="170" y2="222" stroke={ORANGE} strokeWidth="2.5" />
        <line x1="274" y1="148" x2="274" y2="222" stroke={ORANGE} strokeWidth="2.5" />
        <ellipse cx="222" cy="222" rx="52" ry="14" fill="none" stroke={ORANGE} strokeWidth="2.5" />
        <ellipse cx="222" cy="182" rx="52" ry="14" fill="none" stroke={ORANGE} strokeWidth="1.5" opacity="0.4" />
      </g>
      <line
        x1="152" y1="162" x2="170" y2="175"
        stroke={ORANGE_LIGHT} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray="28" strokeDashoffset={connDash}
      />
      <circle
        cx={152 + interpolate(frame, [34, 48], [0, 18], C)}
        cy={162 + interpolate(frame, [34, 48], [0, 13], C)}
        r="4" fill={ORANGE_LIGHT}
        opacity={fIn(frame, 34, 6)}
      />
    </svg>
  );
};

const SearchIcon: React.FC<{ frame: number }> = ({ frame }) => {
  const outerCirc = 2 * Math.PI * 96;
  const outerDash = interpolate(frame, [0, 22], [outerCirc, 0], C);
  const innerCirc = 2 * Math.PI * 56;
  const innerDash = interpolate(frame, [10, 28], [innerCirc, 0], C);
  const scanAngle = frame * 6;
  const rad = (scanAngle * Math.PI) / 180;
  const scanOp = fIn(frame, 20, 8);
  const handleDash = interpolate(frame, [26, 40], [80, 0], C);

  return (
    <svg viewBox="0 0 300 300" style={{ width: 760, height: 760 }}>
      <circle
        cx="148" cy="148" r="96"
        fill="none" stroke={ORANGE} strokeWidth="2.5"
        strokeDasharray={outerCirc} strokeDashoffset={outerDash}
        strokeLinecap="round"
      />
      <circle
        cx="148" cy="148" r="56"
        fill="none" stroke={ORANGE} strokeWidth="1.5" opacity="0.5"
        strokeDasharray={innerCirc} strokeDashoffset={innerDash}
        strokeLinecap="round"
      />
      <circle cx="148" cy="148" r="96" fill={`${ORANGE}10`} opacity={scanOp} />
      <line
        x1="148" y1="148"
        x2={148 + 96 * Math.cos(rad)}
        y2={148 + 96 * Math.sin(rad)}
        stroke={ORANGE_LIGHT} strokeWidth="2.5" opacity={scanOp}
        strokeLinecap="round"
      />
      <circle
        cx={148 + 96 * Math.cos(rad)}
        cy={148 + 96 * Math.sin(rad)}
        r="6" fill={ORANGE_LIGHT} opacity={scanOp}
      />
      <line
        x1="222" y1="222" x2="278" y2="278"
        stroke={ORANGE} strokeWidth="5" strokeLinecap="round"
        strokeDasharray="80" strokeDashoffset={handleDash}
        opacity={fIn(frame, 26, 8)}
      />
    </svg>
  );
};

const PortfolioIcon: React.FC<{ frame: number }> = ({ frame }) => {
  const bars = [
    { x: 22, maxH: 150, delay: 2, color: ORANGE },
    { x: 102, maxH: 210, delay: 10, color: ORANGE_LIGHT },
    { x: 182, maxH: 110, delay: 18, color: ORANGE },
    { x: 262, maxH: 185, delay: 6, color: `${ORANGE_LIGHT}cc` },
  ];
  const axisLen = interpolate(frame, [0, 12], [0, 326], C);
  const arrowH = interpolate(frame, [26, 46], [0, 220], C);

  return (
    <svg viewBox="0 0 340 280" style={{ width: 820, height: 676 }}>
      <line x1="10" y1="258" x2={10 + axisLen} y2="258" stroke={MUTED} strokeWidth="2" opacity="0.4" />
      {bars.map((bar, i) => {
        const h = interpolate(frame, [bar.delay, bar.delay + 22], [0, bar.maxH], C);
        return (
          <g key={i}>
            <rect x={bar.x - 2} y={258 - h} width={68} height={h} fill={bar.color} opacity="0.15" rx="4" />
            <rect x={bar.x} y={258 - h} width={64} height={h} fill={bar.color} rx="4" />
          </g>
        );
      })}
      <line
        x1="18" y1={258 - interpolate(frame, [26, 46], [0, 40], C)}
        x2={18 + interpolate(frame, [26, 46], [0, 300], C)}
        y2={258 - arrowH}
        stroke={ORANGE_LIGHT} strokeWidth="2.5" strokeLinecap="round"
        opacity={fIn(frame, 26)}
      />
    </svg>
  );
};

// ─── Use Case Slide (generic) ─────────────────────────────────────────────────

interface UseCaseProps {
  number: string;
  title: string;
  bullets: string[];
  renderIcon: (frame: number) => React.ReactNode;
  extraBottom?: (frame: number) => React.ReactNode;
}

const UseCaseSlide: React.FC<UseCaseProps> = ({
  number, title, bullets, renderIcon, extraBottom,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillSty = up(frame, fps, 0);
  const titleSty = up(frame, fps, 8);
  const lineW = interpolate(frame, [10, 30], [0, 720], C);
  const bSty = bullets.map((_, i) => up(frame, fps, 28 + i * 12));

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <DotGrid />
      <Brackets frame={frame} />

      {/* Eyebrow label */}
      <div
        style={{
          ...pillSty,
          position: "absolute",
          top: 96,
          left: 100,
          zIndex: 2,
        }}
      >
        <Eyebrow>Use Case {number}</Eyebrow>
      </div>

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
          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <div style={{ ...titleSty, color: CREAM, fontSize: 82, fontFamily, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.04em" }}>
              {title}
            </div>
            <div style={{ height: 2, width: lineW, backgroundColor: ORANGE, opacity: 0.55 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {bullets.map((b, i) => (
                <div key={i} style={{ ...bSty[i], display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: ORANGE, flexShrink: 0 }} />
                  <div style={{ color: MUTED, fontSize: 36, fontFamily, fontWeight: 400, lineHeight: 1.3 }}>
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
          opacity: fIn(frame, 4, 12),
        }}>
          {renderIcon(frame)}
        </div>
      </div>

      {extraBottom && extraBottom(frame)}
    </AbsoluteFill>
  );
};

// ─── Scene 5: How To Use (615–705, 3s) ───────────────────────────────────────

const HowToUse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headSty = up(frame, fps, 0);
  const c1Sty = up(frame, fps, 10);
  const arrowW = interpolate(frame, [24, 38], [0, 140], C);
  const arrowOp = fIn(frame, 24, 8);
  const c2Sty = up(frame, fps, 36);
  const noteSty = up(frame, fps, 54);

  const card = (n: string, title: string, sub: string, sty: object) => (
    <div
      style={{
        ...sty,
        backgroundColor: CARD,
        border: `1px solid ${ORANGE}44`,
        borderRadius: 20,
        padding: "32px 40px",
        minWidth: 340,
      }}
    >
      <div style={{ color: ORANGE, fontSize: 13, fontFamily: monoFamily, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
        {n}
      </div>
      <div style={{ color: CREAM, fontSize: 34, fontFamily, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
        {title}
      </div>
      <div style={{ color: MUTED, fontSize: 20, fontFamily: monoFamily, fontWeight: 400, marginTop: 8 }}>{sub}</div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: BG, justifyContent: "center", padding: "0 160px" }}
    >
      <DotGrid />
      <Brackets frame={frame} />
      <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
        <div
          style={{
            ...headSty,
            color: CREAM,
            fontSize: 72,
            fontFamily,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          Get started in seconds
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {card("01", "Add skills to your agent", "Upload zip or copy/paste", c1Sty)}

          <svg
            width={arrowW + 24}
            height="40"
            style={{ opacity: arrowOp, flexShrink: 0, overflow: "visible" }}
          >
            <line x1="0" y1="20" x2={arrowW} y2="20" stroke={ORANGE} strokeWidth="3" />
            {arrowW > 100 && (
              <>
                <line x1={arrowW - 14} y1="9" x2={arrowW} y2="20" stroke={ORANGE} strokeWidth="3" />
                <line x1={arrowW - 14} y1="31" x2={arrowW} y2="20" stroke={ORANGE} strokeWidth="3" />
              </>
            )}
          </svg>

          {card("02", "Prompt your agent", '"Use Massive skill to…"', c2Sty)}
        </div>

        <div style={{ ...noteSty, color: MUTED, fontSize: 26, fontFamily }}>
          Find the skills zip in your dashboard
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: Outro (705–750, 1.5s) ──────────────────────────────────────────

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rayLen = interpolate(frame, [0, 12], [0, 700], C);
  const rayOp = interpolate(frame, [0, 4, 28, 45], [0, 0.35, 0.15, 0], C);
  const gradOp = interpolate(frame, [0, 18], [0, 0.55], C);
  const logoSty = si(frame, fps, 4);
  const urlSty = up(frame, fps, 16);

  return (
    <AbsoluteFill style={{ backgroundColor: BG, justifyContent: "center", alignItems: "center" }}>
      <DotGrid opacity={0.1} />

      {/* Burst rays */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: rayOp }}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return (
              <line
                key={i}
                x1="960" y1="540"
                x2={960 + Math.cos(angle) * rayLen}
                y2={540 + Math.sin(angle) * rayLen}
                stroke={ORANGE} strokeWidth="1.5"
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "50%",
          background: `linear-gradient(to top, ${ORANGE}44, transparent)`,
          opacity: gradOp,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          zIndex: 2,
        }}
      >
        <div style={logoSty}>
          <Img src={LOGO_WHITE} style={{ height: 72 }} />
        </div>
        <div
          style={{
            ...urlSty,
            color: MUTED,
            fontSize: 16,
            fontFamily: monoFamily,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          joinmassive.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Platform chips for CRM ───────────────────────────────────────────────────

const PLATFORMS = ["Google", "Gemini", "ChatGPT", "Perplexity", "Copilot"];

const PlatformChips: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: "absolute",
      bottom: 96,
      left: 100,
      display: "flex",
      gap: 12,
    }}
  >
    {PLATFORMS.map((p, i) => {
      const f = Math.max(0, frame - 52 - i * 6);
      return (
        <div
          key={p}
          style={{
            opacity: interpolate(f, [0, 8], [0, 1], C),
            transform: `translateY(${interpolate(f, [0, 8], [14, 0], C)}px)`,
            backgroundColor: `${ORANGE}22`,
            border: `1px solid ${ORANGE}55`,
            color: CREAM,
            padding: "6px 18px",
            borderRadius: 20,
            fontSize: 22,
            fontFamily,
            fontWeight: 500,
          }}
        >
          {p}
        </div>
      );
    })}
  </div>
);

// ─── Root export ──────────────────────────────────────────────────────────────

export const MassiveBrandVideo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <Sequence from={0} durationInFrames={45}>
      <LogoIntro />
    </Sequence>
    <Sequence from={45} durationInFrames={120}>
      <OpeningStatement />
    </Sequence>
    <Sequence from={165} durationInFrames={90}>
      <ProductStatement />
    </Sequence>
    <Sequence from={255} durationInFrames={120}>
      <UseCaseSlide
        number="01"
        title="CRM Enrichment"
        bullets={[
          "Enrich contacts from company websites",
          "Pull from Google, Gemini, ChatGPT & Copilot",
          "Export CSV and feed to your agent",
        ]}
        renderIcon={(f) => <CRMIcon frame={f} />}
        extraBottom={(f) => <PlatformChips frame={f} />}
      />
    </Sequence>
    <Sequence from={375} durationInFrames={120}>
      <UseCaseSlide
        number="02"
        title="Search & GEO"
        bullets={[
          "Monitor visibility across search engines & LLMs",
          "Research competitors in results",
          "Implement findings to improve presence",
        ]}
        renderIcon={(f) => <SearchIcon frame={f} />}
      />
    </Sequence>
    <Sequence from={495} durationInFrames={120}>
      <UseCaseSlide
        number="03"
        title="Portfolio Management"
        bullets={[
          "Track companies via search & LLM news",
          "Weekly auto-reports, no repeat stories",
          "Prioritized by importance of news",
        ]}
        renderIcon={(f) => <PortfolioIcon frame={f} />}
      />
    </Sequence>
    <Sequence from={615} durationInFrames={90}>
      <HowToUse />
    </Sequence>
    <Sequence from={705} durationInFrames={45}>
      <Outro />
    </Sequence>
  </AbsoluteFill>
);
