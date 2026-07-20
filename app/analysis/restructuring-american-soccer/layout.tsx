import type { Metadata } from 'next';

/* The brief itself is a client component and can't export metadata, so this
   server layout supplies the page-specific title, blurb, and social preview.
   The co-located opengraph-image / twitter-image files attach automatically. */

const title = 'Restructuring American Soccer';
const description =
  'A sourced 30-year restructuring analysis of the U.S. soccer pyramid: franchise economics, pay-to-play youth, five international case studies, and a phased open-pyramid roadmap with 85 cited sources.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title: `${title} · Sage Advice LLC`,
    description,
    type: 'article',
    url: '/analysis/restructuring-american-soccer',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} · Sage Advice LLC`,
    description,
  },
};

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
