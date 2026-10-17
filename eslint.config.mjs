// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Minified vendor files
    "public/**/*.mjs",
    "public/**/*.js",
    // Agent worktree checkouts — not source to lint
    ".claude/worktrees/**",
    // Throwaway scripts and the Storybook init template
    "scratch/**",
    "stories/**",
  ]),
  {
    // Generic table/formatter/pdfjs/i18n-mock typings are intentionally loose
    files: [
      "components/ui/AppTable.tsx",
      "lib/pdfExtractImages.ts",
      "utils/formatters/types.ts",
      "tests/integration/TextTools.test.tsx",
    ],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
  ...storybook.configs["flat/recommended"],
  {
    // Project uses @storybook/react directly (see .storybook/main.ts)
    files: ["**/*.stories.@(ts|tsx)"],
    rules: { "storybook/no-renderer-packages": "off" },
  },
]);

export default eslintConfig;
