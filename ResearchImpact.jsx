/**
 * ResearchImpact.jsx  —  v2 (NIW Narrative Edition)
 *
 * Narrative flow enforced by section order:
 *   Research Visibility → Academic Recognition → Research Output → Academic Presence
 *
 * Data source: research-impact.json  (import or pass as prop)
 *
 * Dependencies: react, Tailwind CSS
 * Fonts (add once to root CSS):
 *   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@400;500&display=swap');
 *
 * Usage:
 *   import data from './research-impact.json';
 *   <ResearchImpact data={data} />
 */

import React from 'react';
import defaultData from './research-impact.json';

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════════ */
const C = {
  bg:     '#F5F2EB',
  light:  '#EDE8DF',
  dark:   '#0E0E0E',
  card:   '#FFFFFF',
  ink:    '#0E0E0E',
  accent: '#B8935A',
  muted:  '#7A7468',
  border: '#C8C0B0',
  green:  '#4A7C59',
};
const F = {
  serif: "'Cormorant Garamond', Georgia, serif",
  mono:  "'DM Mono', 'Courier New', monospace",
  sans:  "system-ui, -apple-system, sans-serif",
};

/* ═══════════════════════════════════════════════════════════════════════════
   PLATFORM ICONS  (inline SVG)
═══════════════════════════════════════════════════════════════════════════ */
const icons = {
  google_scholar: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="Google Scholar">
      <circle cx="20" cy="20" r="20" fill="#4285F4" />
      <polygon points="20,11 32,17 20,23 8,17" fill="white" />
      <path d="M14 19.5v5.5c0 3.3 2.7 6 6 6s6-2.7 6-6v-5.5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="32" cy="17" r="2.2" fill="white" />
      <line x1="32" y1="19.2" x2="32" y2="25" stroke="white" strokeWidth="1.5" />
    </svg>
  ),
  ssrn: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="SSRN">
      <rect width="40" height="40" rx="5" fill="#1B2A4A" />
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Arial,sans-serif" letterSpacing="0.5">SSRN</text>
    </svg>
  ),
  researchgate: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="ResearchGate">
      <rect width="40" height="40" rx="5" fill="#00CCBB" />
      <path d="M10 11v18M10 11h8c3 0 5.5 2 5.5 4.5S21 20 18 20H10M18 20l7 9" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="28" y="32" fill="white" fontSize="9" fontWeight="700" fontFamily="Arial,sans-serif">c</text>
    </svg>
  ),
  orcid: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="ORCID">
      <circle cx="20" cy="20" r="20" fill="#A6CE39" />
      <circle cx="13.5" cy="13" r="2" fill="white" />
      <rect x="12" y="17" width="3" height="11" rx="1.5" fill="white" />
      <path d="M19 13v14h4.5c4.2 0 7.5-3.1 7.5-7s-3.3-7-7.5-7H19z" fill="white" />
    </svg>
  ),
  linkedin: ({ size = 36 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="LinkedIn">
      <rect width="40" height="40" rx="5" fill="#0A66C2" />
      <text x="20" y="27" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="Arial,sans-serif">in</text>
    </svg>
  ),
};

function PlatformIcon({ id, size = 36 }) {
  const Icon = icons[id];
  if (!Icon) return <div style={{ width: size, height: size, background: C.border, borderRadius: 4 }} />;
  return <Icon size={size} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   RECOGNITION ICONS  (shown on dark section)
═══════════════════════════════════════════════════════════════════════════ */
const recognitionIcons = {
  clarivate: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 2L26 8.5v11L14 26 2 19.5v-11z" stroke={C.accent} strokeWidth="1.5" fill="none" />
      <path d="M14 7L22 11.5v9L14 21l-8-4.5v-9z" fill={C.accent} opacity="0.2" />
      <circle cx="14" cy="14" r="2.5" fill={C.accent} />
    </svg>
  ),
  taylor_francis: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="5" width="14" height="18" rx="1" stroke={C.accent} strokeWidth="1.5" fill="none" />
      <rect x="8" y="5" width="14" height="18" rx="1" stroke={C.accent} strokeWidth="1.5" fill="none" opacity="0.5" />
      <line x1="7" y1="10" x2="15" y2="10" stroke={C.accent} strokeWidth="1" />
      <line x1="7" y1="13" x2="15" y2="13" stroke={C.accent} strokeWidth="1" />
      <line x1="7" y1="16" x2="13" y2="16" stroke={C.accent} strokeWidth="1" />
    </svg>
  ),
  conference: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="11" y="4" width="6" height="10" rx="3" stroke={C.accent} strokeWidth="1.5" fill="none" />
      <path d="M7 13c0 3.9 3.1 7 7 7s7-3.1 7-7" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="14" y1="20" x2="14" y2="24" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="24" x2="18" y2="24" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  peer_reviewed: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="11" stroke={C.accent} strokeWidth="1.5" fill="none" />
      <path d="M9 14l3.5 3.5L19 10" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  doi: () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M10 17a5 5 0 0 1 0-6" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M18 11a5 5 0 0 1 0 6" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="10" y1="14" x2="18" y2="14" stroke={C.accent} strokeWidth="1.5" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED ATOMS
═══════════════════════════════════════════════════════════════════════════ */
function Label({ children, style }) {
  return (
    <span style={{ fontFamily: F.mono, fontSize: '0.63rem', letterSpacing: '0.12em', textTransform: 'uppercase', ...style }}>
      {children}
    </span>
  );
}

function SectionOverline({ number, title }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Label style={{ color: C.accent, opacity: 0.6 }}>{number}</Label>
      <div style={{ width: 1, height: 12, background: C.border }} />
      <Label style={{ color: C.accent }}>{title}</Label>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PURE SVG SPARKLINE  (zero deps — shown only when ≥ 2 data points)
═══════════════════════════════════════════════════════════════════════════ */
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const W = 220, H = 70, P = { t: 6, r: 6, b: 20, l: 32 };
  const iW = W - P.l - P.r, iH = H - P.t - P.b;
  const vals = data.map(d => parseFloat(d.value) || 0);
  const min = Math.min(...vals), max = Math.max(...vals), span = max - min || 1;
  const toX = i => P.l + (i / (data.length - 1)) * iW;
  const toY = v => P.t + (1 - (v - min) / span) * iH;
  const pts = data.map((d, i) => ({ x: toX(i), y: toY(parseFloat(d.value) || 0) }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x},${P.t + iH} L${P.l},${P.t + iH}Z`;
  const fmt = v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${Math.round(v)}`;
  const step = Math.max(1, Math.floor(data.length / 4));
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      <path d={area} fill={color} opacity="0.1" />
      <path d={line} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} />)}
      <text x={P.l - 4} y={P.t + iH + 1} textAnchor="end" fontSize="7" fill={C.muted} fontFamily="monospace">{fmt(min)}</text>
      <text x={P.l - 4} y={P.t + 5}       textAnchor="end" fontSize="7" fill={C.muted} fontFamily="monospace">{fmt(max)}</text>
      {data.map((d, i) => i % step === 0 || i === data.length - 1
        ? <text key={i} x={toX(i)} y={H - 2} textAnchor="middle" fontSize="7" fill={C.muted} fontFamily="monospace">{d.year}</text>
        : null)}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ① SECTION HEADER
═══════════════════════════════════════════════════════════════════════════ */
function PageHeader({ lastUpdated }) {
  return (
    <div className="flex flex-col gap-4 mb-14">
      <div className="flex items-center gap-3">
        <div style={{ width: 32, height: 1, background: C.accent }} />
        <Label style={{ color: C.accent }}>Research Impact</Label>
      </div>
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 style={{ fontFamily: F.serif, fontSize: '3.4rem', fontWeight: 300, lineHeight: 1, color: C.ink, margin: '0 0 12px 0' }}>
            Scholarly <em style={{ color: C.accent, fontStyle: 'italic' }}>Metrics</em>
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: '0.85rem', lineHeight: 1.7, color: C.muted, maxWidth: 560, margin: 0 }}>
            Reach and impact demonstrated through citations, downloads, reads, and institutional
            recognition across leading academic platforms and peer-reviewed publishers.
          </p>
        </div>
        <div style={{ border: `1px solid ${C.border}`, padding: '8px 14px', flexShrink: 0 }}>
          <Label style={{ color: C.muted }}>
            Last updated: <span style={{ color: C.accent }}>{lastUpdated}</span>
          </Label>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ② VISIBILITY CARDS  (numbers only — no profile links)
═══════════════════════════════════════════════════════════════════════════ */
function StatRow({ items }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map(({ label, value }) => (
        <div key={label} style={{ border: `1px solid ${C.border}`, padding: '3px 8px' }}>
          <Label style={{ color: C.ink, fontSize: '0.58rem' }}>{label} {value}</Label>
        </div>
      ))}
    </div>
  );
}

function VisibilityCard({ platformId, name, primaryLabel, primaryValue, subStats }) {
  return (
    <div className="bg-white flex flex-col gap-4 p-6" style={{ border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2.5">
        <PlatformIcon id={platformId} size={30} />
        <Label style={{ color: C.ink, fontWeight: 600 }}>{name}</Label>
      </div>
      <div>
        <div style={{ fontFamily: F.serif, fontSize: '2.8rem', fontWeight: 300, lineHeight: 1, color: C.ink, marginBottom: 4 }}>
          {primaryValue}
        </div>
        <Label style={{ color: C.accent }}>{primaryLabel}</Label>
      </div>
      <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: 0 }} />
      {subStats && <StatRow items={subStats} />}
    </div>
  );
}

function OrcidVisibilityCard({ orcid }) {
  return (
    <div className="bg-white flex flex-col gap-4 p-6" style={{ border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2.5">
        <PlatformIcon id="orcid" size={30} />
        <Label style={{ color: C.ink, fontWeight: 600 }}>ORCID</Label>
      </div>
      <div>
        <div style={{ fontFamily: F.mono, fontSize: '0.88rem', fontWeight: 500, color: C.ink, marginBottom: 4, letterSpacing: '0.04em' }}>
          {orcid.id}
        </div>
        <Label style={{ color: C.accent }}>ORCID iD</Label>
      </div>
      <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: 0 }} />
      <div className="flex flex-col gap-1.5">
        {orcid.verified && <span style={{ fontFamily: F.mono, fontSize: '0.68rem', color: C.green }}>✓ Verified identity</span>}
        {orcid.linked   && <span style={{ fontFamily: F.mono, fontSize: '0.68rem', color: C.green }}>✓ Linked researcher</span>}
      </div>
    </div>
  );
}

function VisibilitySection({ visibility }) {
  const { googleScholar: gs, ssrn, researchgate: rg, orcid } = visibility;
  return (
    <div className="mb-16">
      <SectionOverline number="01" title="Research Visibility" />
      <div className="grid grid-cols-4 gap-5">
        <VisibilityCard
          platformId="google_scholar" name="GOOGLE SCHOLAR"
          primaryLabel="TOTAL CITATIONS" primaryValue={gs.citations}
          subStats={[
            { label: 'H-INDEX', value: gs.hIndex },
            { label: 'I10', value: gs.i10Index },
            { label: 'SINCE 2021', value: gs.citationsSince2021 },
          ]}
        />
        <VisibilityCard
          platformId="ssrn" name="SSRN"
          primaryLabel="TOTAL DOWNLOADS" primaryValue={ssrn.totalDownloads}
          subStats={[
            { label: 'PAPERS', value: ssrn.papers },
            { label: 'ABST. VIEWS', value: ssrn.abstractViews },
          ]}
        />
        <VisibilityCard
          platformId="researchgate" name="RESEARCHGATE"
          primaryLabel="TOTAL READS" primaryValue={rg.reads}
          subStats={[
            { label: 'CITATIONS', value: rg.citations },
            { label: 'RECOMMEND.', value: rg.recommendations },
          ]}
        />
        <OrcidVisibilityCard orcid={orcid} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   YEAR-OVER-YEAR CHARTS  (hidden when empty; no combined chart)
═══════════════════════════════════════════════════════════════════════════ */
const CHART_META = [
  { key: 'googleScholar', seriesKey: 'citations',      label: 'Google Scholar Citations by Year',   color: '#4285F4' },
  { key: 'ssrn',          seriesKey: 'totalDownloads', label: 'SSRN Downloads by Year',             color: '#1B2A4A' },
  { key: 'researchgate',  seriesKey: 'reads',          label: 'ResearchGate Reads by Year',          color: '#00CCBB' },
];

function ChartsSection({ chartHistory }) {
  const visible = CHART_META
    .map(m => ({ ...m, data: (chartHistory[m.key] || {})[m.seriesKey] || [] }))
    .filter(m => m.data.length >= 2);
  if (visible.length === 0) return null;
  return (
    <div className="grid gap-5 mb-16" style={{ gridTemplateColumns: `repeat(${visible.length}, 1fr)` }}>
      {visible.map(c => (
        <div key={c.key} className="bg-white p-4" style={{ border: `1px solid ${C.border}` }}>
          <Label style={{ color: C.muted, display: 'block', marginBottom: 10, lineHeight: 1.5 }}>{c.label}</Label>
          <div style={{ height: 80 }}><Sparkline data={c.data} color={c.color} /></div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ③ ACADEMIC RECOGNITION  (dark section — most prominent)
═══════════════════════════════════════════════════════════════════════════ */
function RecognitionCard({ item }) {
  const [hovered, setHovered] = React.useState(false);
  const Icon = recognitionIcons[item.id] || (() => null);
  return (
    <div
      style={{
        border: `1px solid rgba(184,147,90,0.25)`,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transition: 'border-color 0.2s',
        ...(hovered ? { borderColor: 'rgba(184,147,90,0.7)' } : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon + badge row */}
      <div className="flex items-start justify-between">
        <Icon />
        <span style={{
          fontFamily: F.mono, fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: C.accent, border: `1px solid rgba(184,147,90,0.4)`, padding: '2px 7px',
        }}>
          {item.badge}
        </span>
      </div>

      {/* Institution */}
      <div>
        <p style={{ fontFamily: F.mono, fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.accent, margin: '0 0 6px 0' }}>
          {item.institution}
        </p>
        <p style={{ fontFamily: F.sans, fontSize: '0.8rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
          {item.description}
        </p>
      </div>

      {/* View Evidence link */}
      <a
        href={item.evidenceUrl}
        style={{
          fontFamily: F.mono, fontSize: '0.63rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: C.accent, textDecoration: 'none', marginTop: 'auto',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          opacity: hovered ? 1 : 0.75, transition: 'opacity 0.15s',
        }}
      >
        View Evidence ↗
      </a>
    </div>
  );
}

function RecognitionSection({ recognition }) {
  return (
    <div style={{ background: C.dark, padding: '80px 24px', margin: '0 -24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Overline on dark bg */}
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 32, height: 1, background: C.accent, opacity: 0.6 }} />
          <Label style={{ color: C.accent, opacity: 0.7 }}>02</Label>
          <div style={{ width: 1, height: 12, background: 'rgba(184,147,90,0.3)' }} />
          <Label style={{ color: C.accent, opacity: 0.7 }}>Academic Recognition</Label>
        </div>

        <h3 style={{ fontFamily: F.serif, fontSize: '2.4rem', fontWeight: 300, color: 'white', margin: '0 0 6px 0' }}>
          Institutional <em style={{ color: C.accent, fontStyle: 'italic' }}>Validation</em>
        </h3>
        <p style={{ fontFamily: F.sans, fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', margin: '0 0 40px 0', maxWidth: 500 }}>
          Recognition by leading academic publishers, citation databases, and professional bodies confirms the quality and relevance of this research.
        </p>

        {/* 3 + 2 grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {recognition.slice(0, 3).map(item => <RecognitionCard key={item.id} item={item} />)}
        </div>
        <div className="grid grid-cols-2 gap-4" style={{ maxWidth: 'calc(66.67% + 8px)' }}>
          {recognition.slice(3).map(item => <RecognitionCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ④ RESEARCH OUTPUT OVERVIEW  (replaces table — elegant stat grid)
═══════════════════════════════════════════════════════════════════════════ */
function OutputSection({ researchOutput }) {
  return (
    <div className="mb-16">
      <SectionOverline number="03" title="Research Output" />
      <div className="grid grid-cols-5 gap-px" style={{ background: C.border }}>
        {researchOutput.map((item, i) => (
          <div
            key={i}
            className="bg-white flex flex-col justify-between p-6"
          >
            <div style={{ fontFamily: F.serif, fontSize: '2.6rem', fontWeight: 300, lineHeight: 1, color: C.ink, marginBottom: 8 }}>
              {item.value}
            </div>
            <div>
              <p style={{ fontFamily: F.mono, fontSize: '0.63rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.ink, margin: '0 0 4px 0', fontWeight: 500 }}>
                {item.label}
              </p>
              <p style={{ fontFamily: F.sans, fontSize: '0.72rem', color: C.muted, margin: 0 }}>
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: F.sans, fontSize: '0.72rem', color: C.muted, marginTop: 10 }}>
        All output is publicly verifiable. Figures reflect works published, presented, or submitted as of the date above.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ⑤ ACADEMIC PRESENCE  (single block, all profile links)
═══════════════════════════════════════════════════════════════════════════ */
function PresenceSection({ academicPresence }) {
  return (
    <div>
      <SectionOverline number="04" title="Academic Presence" />
      <div className="bg-white" style={{ border: `1px solid ${C.border}` }}>
        {academicPresence.map((profile, i) => (
          <div
            key={profile.id}
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: i < academicPresence.length - 1 ? `1px solid ${C.border}` : 'none' }}
          >
            <div className="flex items-center gap-3">
              <PlatformIcon id={profile.id} size={26} />
              <div>
                <p style={{ fontFamily: F.sans, fontSize: '0.88rem', color: C.ink, margin: 0, fontWeight: 500 }}>
                  {profile.name}
                </p>
                {profile.handle && (
                  <p style={{ fontFamily: F.mono, fontSize: '0.65rem', color: C.muted, margin: 0 }}>
                    {profile.handle}
                  </p>
                )}
              </div>
            </div>
            <a
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: F.mono, fontSize: '0.63rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.accent, textDecoration: 'none' }}
            >
              View Profile ↗
            </a>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: F.serif, fontSize: '0.95rem', fontStyle: 'italic', color: C.muted, marginTop: 16, lineHeight: 1.6 }}>
        "Research is not only about creating knowledge, but also about making an impact and advancing practice."
        <span style={{ fontFamily: F.mono, fontSize: '0.63rem', fontStyle: 'normal', color: C.accent, display: 'block', marginTop: 6 }}>
          — Ivan Bakalo
        </span>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════════════════════════════════ */
/**
 * @param {{ data?: typeof defaultData }} props
 */
export default function ResearchImpact({ data = defaultData }) {
  const { meta, visibility, chartHistory, recognition, researchOutput, academicPresence } = data;

  return (
    <div id="impact" style={{ background: C.bg }}>

      {/* Header + Sections 01, 03, 04 share the padded container */}
      <div style={{ padding: '80px 24px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <PageHeader lastUpdated={meta.lastUpdated} />
          <VisibilitySection visibility={visibility} />
          <ChartsSection chartHistory={chartHistory} />
        </div>
      </div>

      {/* Section 02: Recognition — full bleed dark */}
      <RecognitionSection recognition={recognition} />

      {/* Sections 03 + 04 resume padded container */}
      <div style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <OutputSection researchOutput={researchOutput} />
          <PresenceSection academicPresence={academicPresence} />
        </div>
      </div>

    </div>
  );
}
