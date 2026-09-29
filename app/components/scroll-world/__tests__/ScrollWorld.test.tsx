import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ScrollWorld from "../ScrollWorld";

describe("ScrollWorld", () => {
  it("renders exactly 5 dive sections and 4 connector sections", () => {
    const { container } = render(<ScrollWorld />);

    const dives = container.querySelectorAll('[data-slot-kind="dive"]');
    const connectors = container.querySelectorAll('[data-slot-kind="connector"]');

    expect(dives).toHaveLength(5);
    expect(connectors).toHaveLength(4);
  });

  it("alternates dive/connector, starting and ending on a dive", () => {
    const { container } = render(<ScrollWorld />);

    const sections = Array.from(
      container.querySelectorAll("[data-slot-kind]")
    ).map((el) => el.getAttribute("data-slot-kind"));

    expect(sections).toEqual([
      "dive",
      "connector",
      "dive",
      "connector",
      "dive",
      "connector",
      "dive",
      "connector",
      "dive",
    ]);
  });

  it("labels each section with its own 1-based placeholder", () => {
    const { container } = render(<ScrollWorld />);

    const diveIds = Array.from(
      container.querySelectorAll('[data-slot-kind="dive"]')
    ).map((el) => el.getAttribute("data-slot-id"));
    const connectorIds = Array.from(
      container.querySelectorAll('[data-slot-kind="connector"]')
    ).map((el) => el.getAttribute("data-slot-id"));

    expect(diveIds).toEqual([
      "dive-1",
      "dive-2",
      "dive-3",
      "dive-4",
      "dive-5",
    ]);
    expect(connectorIds).toEqual([
      "connector-1",
      "connector-2",
      "connector-3",
      "connector-4",
    ]);

    expect(container).toHaveTextContent("Dive 1");
    expect(container).toHaveTextContent("Dive 5");
    expect(container).toHaveTextContent("Connector 1");
    expect(container).toHaveTextContent("Connector 4");
  });
});
