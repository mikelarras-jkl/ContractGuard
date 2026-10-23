import eslint from "@eslint/js";
import jest from "eslint-plugin-jest";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["contractGuard/", "coverage/", "node_modules/"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["tests/**/*.test.ts"],
    ...jest.configs["flat/recommended"],
  },
);
