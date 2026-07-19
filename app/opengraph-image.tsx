import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, ogFonts } from './og/shared';

export const alt = 'Hanna Sage — Software Engineer & AI Enthusiast';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Portfolio · Software Engineer"
        title="Hanna Sage"
        titleSize={120}
        blurb="Creative technologist with 7+ years building scalable systems and leading teams — now expanding AI/ML work in Baltimore, Maryland."
        footerLeft="hannasage.love"
        tags={['Baltimore, MD', 'Full-stack']}
      />
    ),
    { ...size, fonts: ogFonts() }
  );
}
