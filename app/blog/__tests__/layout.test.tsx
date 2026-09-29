import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BlogLayout from "../layout";
import { ThemeProvider } from "../../context/ThemeContext";

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog",
}));

describe("BlogLayout", () => {
  it("renders Navigation above the page content", () => {
    render(
      <ThemeProvider>
        <BlogLayout>
          <p>Post body</p>
        </BlogLayout>
      </ThemeProvider>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /blog/i })[0]).toHaveAttribute(
      "href",
      "/blog"
    );
    expect(screen.getByText("Post body")).toBeInTheDocument();
  });
});
