# ROADMAP: resume

This site is the W-2 extension site: the personal site that sits beside
Sage Advice LLC.

## Next: a shared blog

Logged 2026-09-26. This is the next item of work in this repo.

Two sites get a blog:

- `hannasage.love/blog`, served by this repo.
- `sageadvice.dev/blog`, served by `internal-repos/sage-web`.

Both blogs read posts from one database. A post can appear on one site or
on both. Not every post appears on both. Each site renders its posts in its
own style, so the same post looks different on each site.

### Requirements

1. One store holds every post.
2. Each post names the sites that show it.
3. Each site lists and renders only the posts that name it.
4. Each site applies its own layout, type, and colour to a post. The post
   content carries no site styling.
5. A post has one URL per site that shows it. If a post appears on both
   sites, one URL is the canonical URL (the URL that search engines treat
   as the original).

### Decisions for Hanna

These decisions are open. The work does not start until each one has an
answer.

1. Where the posts live. Variants: a hosted Postgres database such as
   Supabase, a headless CMS (a content service with an editor and an API),
   or Markdown files in one Git repo that both sites read.
2. How a post names its sites. Variants: a list of site names on each
   post, or one tag per site.
3. Which site is canonical for a shared post. Variants: the site that
   published it first, a field on each post, or always `sageadvice.dev`.
4. Where the shared code lives. Variants: a small package that both repos
   install, or a copy in each repo.
5. How a site gets new posts. Variants: a rebuild on each publish, or
   incremental regeneration (the page refreshes from the store on a timer).
