'use client'

// Theme is managed by a blocking <script> in <head> (reads localStorage before first paint)
// and by DarkModeToggle (direct DOM manipulation). No React Provider needed.
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
