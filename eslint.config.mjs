import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";

const sharedGlobals = {
  AbortController: "readonly",
  Blob: "readonly",
  Buffer: "readonly",
  console: "readonly",
  CustomEvent: "readonly",
  DOMParser: "readonly",
  document: "readonly",
  fetch: "readonly",
  FormData: "readonly",
  Headers: "readonly",
  HTMLElement: "readonly",
  importMeta: "readonly",
  localStorage: "readonly",
  navigator: "readonly",
  process: "readonly",
  Request: "readonly",
  Response: "readonly",
  sessionStorage: "readonly",
  setInterval: "readonly",
  setTimeout: "readonly",
  clearInterval: "readonly",
  clearTimeout: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  window: "readonly",
};

const testGlobals = {
  ...sharedGlobals,
  afterAll: "readonly",
  afterEach: "readonly",
  beforeAll: "readonly",
  beforeEach: "readonly",
  describe: "readonly",
  expect: "readonly",
  it: "readonly",
  vi: "readonly",
};

const typescriptRules = {
  ...tseslintPlugin.configs.recommended.rules,
  "@typescript-eslint/ban-ts-comment": "warn",
  "@typescript-eslint/no-empty-object-type": "off",
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrorsIgnorePattern: "^_",
    },
  ],
  "no-console": ["warn", { allow: ["warn", "error"] }],
};

export default [
  {
    ignores: [
      ".github/**",
      ".manus-logs/**",
      ".playwright-mcp/**",
      ".pnpm-store/**",
      ".qodo/**",
      ".vscode/**",
      "Momentumscrapper/**",
      "benchmark/**",
      "build/**",
      "dist/**",
      "node_modules/**",
      "reports/**",
      "research/**",
      "scripts/**",
      "v2/**",
      "xpost/**",
      "C:*",
    ],
  },
  {
    files: ["client/src/**/*.{ts,tsx}", "server/**/*.ts", "shared/**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: sharedGlobals,
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: typescriptRules,
  },
  {
    files: ["tests/**/*.ts"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: testGlobals,
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: typescriptRules,
  },
];
