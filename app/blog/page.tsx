import Link from "next/link";
import type { Metadata } from "next";
import { getContentSource, getCurrentSiteId } from "@/app/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
};

export default async function BlogIndexPage() {
  const siteId = getCurrentSiteId();
  const source = getContentSource();
  const posts = await source.listPosts(siteId);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-3xl font-bold text-ink mb-8">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-ink-dim">No posts yet.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-hairline pb-8">
              <Link href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-xl font-semibold text-ink group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-ink-dim mt-1">{post.publishedAt}</p>
                <p className="text-ink-dim mt-2">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
