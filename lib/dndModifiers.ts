import type { Modifier } from "@dnd-kit/core";

/**
 * Modifier that restricts drag movement to the vertical (Y) axis only,
 * preventing any horizontal (X) translation and stopping horizontal scrolling.
 */
export const restrictToVerticalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    x: 0,
  };
};
