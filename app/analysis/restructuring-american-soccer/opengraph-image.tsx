import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, ogFonts } from '../../og/shared';

export const alt =
  'Restructuring American Soccer, a Sage Advice LLC business-analysis brief';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Sage Advice LLC · Business Analysis"
        title="Restructuring American Soccer"
        titleSize={66}
        blurb="A sourced 30-year restructuring of the U.S. soccer pyramid: franchise economics, pay-to-play youth, and a phased open-pyramid roadmap."
        footerLeft="hannasage.love/analysis"
        tags={['Research brief', '85 sources']}
      />
    ),
    { ...size, fonts: ogFonts() }
  );
}
