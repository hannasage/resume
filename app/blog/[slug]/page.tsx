import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContentSource, getCurrentSiteId } from "@/app/lib/blog";
import { buildPostMetadata } from "@/app/lib/blog/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getContentSource().getPost(getCurrentSiteId(), slug);
  if (!post) {
    return { title: "Not found" };
  }
  return buildPostMetadata(post);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const siteId = getCurrentSiteId();
  const post = await getContentSource().getPost(siteId, slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">{post.title}</h1>
        <p className="text-sm text-ink-dim mb-8">{post.publishedAt}</p>
        {post.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element -- local placeholder assets, no image optimization needed
          <img src={post.heroImage.url} alt={post.heroImage.alt} className="w-full mb-8" />
        )}
        <div className="text-ink whitespace-pre-wrap">{post.body}</div>
      </article>
    </main>
  );
}
