import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navigation from "../Navigation";
import { ThemeProvider } from "../../context/ThemeContext";

const mockUsePathname = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

function renderNavigation(props: {
  activeSection: string;
  scrollToSection: (section: string) => void;
}) {
  return render(
    <ThemeProvider>
      <Navigation {...props} />
    </ThemeProvider>
  );
}

describe("Navigation", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders a Blog link with the correct href in both desktop and mobile markup", () => {
    mockUsePathname.mockReturnValue("/");
    renderNavigation({ activeSection: "about", scrollToSection: () => {} });

    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    expect(blogLinks).toHaveLength(2);
    for (const link of blogLinks) {
      expect(link).toHaveAttribute("href", "/blog");
    }
  });

  it("shows the active style when pathname is /blog", () => {
    mockUsePathname.mockReturnValue("/blog");
    renderNavigation({ activeSection: "about", scrollToSection: () => {} });

    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    for (const link of blogLinks) {
      expect(link.className).toContain("text-accent");
    }
  });

  it("shows the active style when pathname is /blog/some-slug", () => {
    mockUsePathname.mockReturnValue("/blog/some-slug");
    renderNavigation({ activeSection: "about", scrollToSection: () => {} });

    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    for (const link of blogLinks) {
      expect(link.className).toContain("text-accent");
    }
  });

  it("shows the inactive style when pathname is / (home, an in-page section active)", () => {
    mockUsePathname.mockReturnValue("/");
    renderNavigation({ activeSection: "about", scrollToSection: () => {} });

    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    for (const link of blogLinks) {
      expect(link.className).not.toContain("text-accent");
      expect(link.className).toContain("text-ink-dim");
    }
  });

  it("shows the inactive style for another non-blog pathname", () => {
    mockUsePathname.mockReturnValue("/somewhere-else");
    renderNavigation({ activeSection: "contact", scrollToSection: () => {} });

    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    for (const link of blogLinks) {
      expect(link.className).not.toContain("text-accent");
    }
  });

  it("closes the mobile menu when the mobile Blog link is clicked", () => {
    mockUsePathname.mockReturnValue("/");
    renderNavigation({ activeSection: "about", scrollToSection: () => {} });

    const toggle = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggle);

    const mobileMenuContainer = document.querySelector(".md\\:hidden.overflow-hidden");
    expect(mobileMenuContainer?.className).toContain("max-h-[320px]");

    const blogLinks = screen.getAllByRole("link", { name: /blog/i });
    // The second Blog link (index 1) is the mobile one, rendered after the
    // desktop one in document order.
    fireEvent.click(blogLinks[1]);

    expect(mobileMenuContainer?.className).toContain("max-h-0");
  });
});
