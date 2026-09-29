/**
 * The canonical origin for this deployment. A constant, not an
 * environment variable: a misset env var on a deploy would silently
 * write a wrong domain into metadata, sitemap, robots, and RSS output.
 * A preview deploy still points canonicals at production, on purpose.
 */
export const SITE_URL = "https://hannasage.love";
