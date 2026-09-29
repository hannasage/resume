import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ScrollWorldPreviewPage from "../page";

describe("ScrollWorldPreviewPage", () => {
  it("renders without throwing", () => {
    expect(() => render(<ScrollWorldPreviewPage />)).not.toThrow();
  });

  it("renders the ScrollWorld scaffold", () => {
    const { getByTestId } = render(<ScrollWorldPreviewPage />);
    expect(getByTestId("scroll-world")).toBeInTheDocument();
  });
});
