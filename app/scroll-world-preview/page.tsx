import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScrollWorld from "@/app/components/scroll-world/ScrollWorld";

// Internal preview route for the in-progress scroll-driven home hero
// scaffold. Not linked from site navigation and excluded from indexing.
export const metadata: Metadata = {
  title: "Scroll World Preview",
  robots: { index: false, follow: false },
};

export default function ScrollWorldPreviewPage() {
  if (process.env.NODE_ENV === "production" && process.env.SCROLL_WORLD_PREVIEW !== "1") {
    notFound();
  }
  return <ScrollWorld />;
}
