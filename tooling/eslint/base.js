const config = {
  env: {
    es2022: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    // TypeScript specific
    "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports
    "@typescript-eslint/no-explicit-any": "off", // Allow using explicit any
    "@typescript-eslint/no-namespace": "off", // Allow using namespace
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-require-imports": "off",
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",

    // Other rules
    "no-use-before-define": "off",
    "no-restricted-imports": ["error"],
    "import/order": "off",
  },
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.cjs",
    "**/.eslintrc.cjs",
    ".next",
    "dist",
    "generated",
    "pnpm-lock.yaml",
  ],
  reportUnusedDisableDirectives: true,
};

module.exports = config;
