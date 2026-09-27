# ROADMAP: resume

This site is the W-2 extension site: the personal site that sits beside
Sage Advice LLC.

## Next: a shared blog

Logged 2026-09-26. Updated 2026-09-27 with Hanna's decisions. This is the
next item of work in this repo. The MVP is tracked in
`sageadvicellc/workbench#199`.

One blog back end serves every brand:

- `hannasage.love/blog`, served by this repo.
- `sageadvice.dev/blog`, served by `internal-repos/sage-web`.
- The sagetrellis and sagespec sites, when they exist.

One content store holds every post. Each site shows only the posts it is
permitted to show. Each site renders its posts in its own style, so the
same post looks different on each site. The aim is unity and cohesion
between the brands.

### Requirements

1. One store holds every post.
2. Each post carries the permission that says which sites show it.
3. Each site lists and renders only the posts it is permitted to show.
4. Each site applies its own layout, type, and colour to a post. The post
   content carries no site styling.
5. A post has one URL per site that shows it. If a post appears on more
   than one site, one URL is the canonical URL (the URL that search engines
   treat as the original).
6. Each post carries one hero image and a few related images in the prose.
7. Agents are served by `llms.txt`.

### Decided

1. Posts live in Sanity, a hosted headless CMS (a content service with an
   editor and an API). Staging preview is part of that choice.
2. One back end serves every brand, and each site shows a permitted
   selection.
3. Imagery is shader and 3D fields plus generated stills, in a cyberpunk
   look that fits Hanna's animated portrait. Generated stills draw on the
   Higgsfield Plus plan's 4,000 credits a month, under a budget monitor.
4. Agents are served by `llms.txt` now. Playbooks offered through MCP are
   a later consideration.
5. Posts carry no agent-authorship label. The blog is the founder's, and
   agents ghostwrite for her.
6. The sites move to Vercel Pro, and Vercel Web Analytics keeps twelve
   months of data.
7. The blog plans toward courses and consulting leads first, and
   sponsorship third.
8. The build is design-first. The projection-ui 0.2 blog mockups in Figma
   gain imagery, and Hanna's approval of the mockups gates the build.

### Decisions for Hanna

These decisions are open. Each one has an answer before its part of the
build starts.

1. How a post's permission is set. Variants: a list of site names on each
   post, or one tag per site.
2. Which site is canonical for a shared post. Variants: the site that
   published it first, a field on each post, or always `sageadvice.dev`.
3. Where the shared code lives. Variants: a small package that every site
   installs, or a copy in each repo.
4. How a site gets new posts. Variants: a rebuild on each publish, or
   incremental regeneration (the page refreshes from the store on a timer).
