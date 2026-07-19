import { readFileSync } from 'fs';
import { join } from 'path';

/* Shared building blocks for the site's generated social-preview (Open Graph /
   Twitter) images. Colors and type are pulled from the default "projection"
   theme so the cards read as an extension of the site itself. */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const C = {
  bg: '#07090C',
  border: '#1B2535',
  text: '#DDE3EE',
  muted: '#8396AB',
  accent: '#C9F53A',
};

const fontsDir = join(process.cwd(), 'app/og/fonts');

/** Brand fonts (Syne display + IBM Plex Mono) as raw TTF for Satori. */
export function ogFonts() {
  return [
    { name: 'Plex', data: readFileSync(join(fontsDir, 'IBMPlexMono-Regular.ttf')), weight: 400 as const, style: 'normal' as const },
    { name: 'Plex', data: readFileSync(join(fontsDir, 'IBMPlexMono-Medium.ttf')), weight: 500 as const, style: 'normal' as const },
    { name: 'Plex', data: readFileSync(join(fontsDir, 'IBMPlexMono-SemiBold.ttf')), weight: 600 as const, style: 'normal' as const },
    { name: 'Syne', data: readFileSync(join(fontsDir, 'Syne-ExtraBold.ttf')), weight: 800 as const, style: 'normal' as const },
  ];
}

interface OgCardProps {
  /** Small letterspaced label above the title. */
  eyebrow: string;
  /** The adaptive, page-specific headline. */
  title: string;
  /** One-to-two sentence blurb describing the page. */
  blurb: string;
  /** Left-hand footer text, e.g. a domain / path. */
  footerLeft: string;
  /** Short uppercase tags shown at the bottom-right. */
  tags: string[];
  /** Title font size — tune per page so long titles still fit. */
  titleSize?: number;
}

/** The shared card layout: dark canvas, lime glow, hairline footer. */
export function OgCard({ eyebrow, title, blurb, footerLeft, tags, titleSize = 84 }: OgCardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: C.bg,
        color: C.text,
        fontFamily: 'Plex',
        padding: '66px 72px',
        position: 'relative',
      }}
    >
      {/* soft lime glow, echoing the hero backdrop */}
      <div
        style={{
          position: 'absolute',
          top: -240,
          right: -180,
          width: 760,
          height: 760,
          background:
            'radial-gradient(circle at center, rgba(201,245,58,0.20) 0%, rgba(7,9,12,0) 70%)',
        }}
      />
      {/* top accent rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: C.accent }} />

      {/* eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 16, height: 16, background: C.accent, borderRadius: 3 }} />
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: 'uppercase', color: C.muted, fontWeight: 500 }}>
          {eyebrow}
        </div>
      </div>

      {/* title + blurb */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: 'Syne',
            fontWeight: 800,
            fontSize: titleSize,
            lineHeight: 1.02,
            letterSpacing: -2,
            color: C.text,
            maxWidth: 1010,
          }}
        >
          {title}
        </div>
        <div style={{ width: 104, height: 8, background: C.accent, marginTop: 28, borderRadius: 2 }} />
        <div style={{ fontSize: 29, lineHeight: 1.42, color: C.muted, marginTop: 30, maxWidth: 960, fontWeight: 400 }}>
          {blurb}
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${C.border}`,
          paddingTop: 28,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 10, height: 10, background: C.accent, borderRadius: 2 }} />
          <div style={{ fontSize: 24, color: C.text, letterSpacing: 1, fontWeight: 500 }}>{footerLeft}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                fontSize: 19,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: C.muted,
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: '8px 14px',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
