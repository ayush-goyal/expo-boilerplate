// Merged ESLint configuration for React Native
module.exports = {
  extends: [
    // Base recommendations
    "eslint:recommended",

    // React & React Native specific
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "airbnb/hooks",
    "universe/native",
    "universe/shared/typescript-analysis",
    "expo",

    // TypeScript support
    "plugin:@typescript-eslint/recommended",

    // Other plugins
    "plugin:@tanstack/eslint-plugin-query/recommended",

    // Prettier should always be last to avoid conflicts
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "import",
    "react",
    "react-native",
    "unused-imports",
    "reactotron",
  ],
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.d.ts"],
      parserOptions: {
        project: "**/tsconfig.json",
      },
    },
  ],
  rules: {
    // React related rules
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",

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

    // Unused imports handling (from FILE 1)
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn", // Using warn instead of error to be less strict
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],

    // React Native
    "react-native/no-raw-text": "off",

    // Reactotron
    "reactotron/no-tron-in-production": "error",

    // Other rules from FILE 2
    "no-use-before-define": "off",
    "no-restricted-imports": ["error"],
  },
};
