import { renderHook } from "@testing-library/react";
import { useClickOutside } from "@/composables/useClickOutside";

describe("useClickOutside", () => {
  let insideElement: HTMLDivElement;
  let outsideElement: HTMLDivElement;

  beforeEach(() => {
    insideElement = document.createElement("div");
    outsideElement = document.createElement("div");
    document.body.appendChild(insideElement);
    document.body.appendChild(outsideElement);
  });

  afterEach(() => {
    document.body.removeChild(insideElement);
    document.body.removeChild(outsideElement);
  });

  it("triggers handler when clicking outside target element", () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    Object.defineProperty(result.current, "current", {
      value: insideElement,
      writable: true,
    });

    outsideElement.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does not trigger handler when clicking inside target element", () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler));

    Object.defineProperty(result.current, "current", {
      value: insideElement,
      writable: true,
    });

    insideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it("does not trigger handler when disabled", () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useClickOutside(handler, false));

    Object.defineProperty(result.current, "current", {
      value: insideElement,
      writable: true,
    });

    outsideElement.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true }),
    );
    expect(handler).not.toHaveBeenCalled();
  });
});
