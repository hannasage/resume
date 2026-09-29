# AGENTS.md: resume

## Stack

Next.js App Router, TypeScript, React. Styling is Tailwind CSS. Forms use
React Hook Form with Zod validation. State that must persist across
components uses Zustand. Tests run on Vitest.

## Gates

Run these four before every commit, all at zero errors:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

Never commit directly to `main`. Branch, commit, open a pull request as a
draft. New code needs test coverage; a commit that adds code with no test
is incomplete.

## Content rules

Blog posts are Markdown files with YAML frontmatter, validated at read
time. A post that fails validation throws instead of building.

- `title` and `excerpt` are required, non-empty strings.
- `slug` may contain only lowercase letters, digits, and hyphens. It falls
  back to the file name when frontmatter omits it.
- `publishedAt` must be strict ISO 8601: `YYYY-MM-DD`, optionally with a
  time and a zone (for example `2026-01-01T09:00:00Z`). A calendar-invalid
  date, such as day 30 of February, is also rejected.
- `canonicalSite` must be one of the site identifiers the deployment
  knows. An unknown value fails to parse, so frontmatter cannot steer a
  canonical URL or an Open Graph image at an arbitrary host.
- `sites` is a list of site identifiers a post is permitted to show on. A
  post appears only on a site listed here.
- `heroImage.url` is optional. When present, it must be an absolute
  `https://` URL on an allowed host, or a path resolving under the site's
  own origin. A backslash in the value is rejected outright, because a URL
  parser can treat it as a path separator and route the image off-site.
  Any other URL scheme prefix (`ftp:`, `javascript:`, and so on) is
  rejected the same way.

## Style

This repository is public.

- A commit message, a pull request body, or an issue never names a
  person, quotes a private conversation, or links a private chat or
  session.
- Keep commit messages and pull request bodies free of internal process
  references: no tool names, no review names, no decision citations.
  State what changed and why, in terms a reader outside the project can
  follow.
- American spelling. Favor plain, direct sentences over jargon.
