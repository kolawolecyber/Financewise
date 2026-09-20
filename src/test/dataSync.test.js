import { notifyDataChanged } from "../utils/dataSync";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("data synchronization", () => {
  beforeEach(() => localStorage.clear());

  it("notifies the current tab and records a cross-tab change marker", () => {
    const listener = vi.fn();
    window.addEventListener("financewise:data-changed", listener);

    notifyDataChanged();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(Number(localStorage.getItem("financewise:last-change"))).toBeGreaterThan(0);
    window.removeEventListener("financewise:data-changed", listener);
  });
});
