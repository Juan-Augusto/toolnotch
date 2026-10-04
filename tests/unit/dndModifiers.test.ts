import { restrictToVerticalAxis } from "@/lib/dndModifiers";

describe("restrictToVerticalAxis modifier", () => {
  it("restricts horizontal movement by setting x to 0", () => {
    const inputTransform = {
      x: 150,
      y: 80,
      scaleX: 1,
      scaleY: 1,
    };

    const result = restrictToVerticalAxis({
      transform: inputTransform,
      activatorEvent: null,
      active: null,
      activeNodeRect: null,
      draggingNodeRect: null,
      containerNodeRect: null,
      over: null,
      overlayNodeRect: null,
      scrollableAncestors: [],
      scrollableAncestorRects: [],
      windowRect: null,
    });

    expect(result).toEqual({
      x: 0,
      y: 80,
      scaleX: 1,
      scaleY: 1,
    });
  });

  it("zeros negative x movements while preserving negative y", () => {
    const inputTransform = {
      x: -250,
      y: -120,
      scaleX: 0.95,
      scaleY: 0.95,
    };

    const result = restrictToVerticalAxis({
      transform: inputTransform,
      activatorEvent: null,
      active: null,
      activeNodeRect: null,
      draggingNodeRect: null,
      containerNodeRect: null,
      over: null,
      overlayNodeRect: null,
      scrollableAncestors: [],
      scrollableAncestorRects: [],
      windowRect: null,
    });

    expect(result).toEqual({
      x: 0,
      y: -120,
      scaleX: 0.95,
      scaleY: 0.95,
    });
  });
});
