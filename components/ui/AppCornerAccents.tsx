import type { HTMLAttributes } from "react";

export type CornerPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type CornerPreset =
  | "all"
  | "top"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface AppCornerAccentsProps extends HTMLAttributes<HTMLSpanElement> {
  position?: CornerPreset;
  corners?: CornerPosition[];
  className?: string;
  borderColor?: string;
  size?: string;
}

const CORNER_STYLES: Record<CornerPosition, string> = {
  "top-left": "-top-0.5 -left-0.5 border-t-3 border-l-3",
  "top-right": "-top-0.5 -right-0.5 border-t-3 border-r-3",
  "bottom-left": "-bottom-0.5 -left-0.5 border-b-3 border-l-3",
  "bottom-right": "-bottom-0.5 -right-0.5 border-b-3 border-r-3",
};

export function AppCornerAccents({
  position = "all",
  corners,
  className = "",
  borderColor = "border-foreground",
  size = "w-2.5 h-2.5",
}: AppCornerAccentsProps) {
  let activeCorners: CornerPosition[];

  if (corners && corners.length > 0) {
    activeCorners = corners;
  } else if (position === "top") {
    activeCorners = ["top-left", "top-right"];
  } else if (position === "bottom") {
    activeCorners = ["bottom-left", "bottom-right"];
  } else if (position === "all") {
    activeCorners = [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ];
  } else {
    activeCorners = [position as CornerPosition];
  }

  return (
    <>
      {activeCorners.map((corner) => (
        <span
          key={corner}
          className={`absolute ${size} ${borderColor} ${CORNER_STYLES[corner]} pointer-events-none z-10 ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export default AppCornerAccents;
