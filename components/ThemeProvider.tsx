"use client";

import * as React from "react";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    orig.apply(console, args);
  };
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
