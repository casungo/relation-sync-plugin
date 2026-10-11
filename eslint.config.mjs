import js from "@eslint/js";
import tseslint from "typescript-eslint";
import obsidianPlugin from "eslint-plugin-obsidianmd";
import globals from "globals";
import { fileURLToPath } from "node:url";

const tsconfigRootDir = fileURLToPath(new URL(".", import.meta.url));

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			obsidianmd: obsidianPlugin,
		},
		rules: {
			...obsidianPlugin.ruleConfigs.recommended,
			...obsidianPlugin.ruleConfigs.recommendedTypeChecked,
			"@typescript-eslint/no-floating-promises": "warn",
			"@typescript-eslint/no-unsafe-assignment": "warn",
			"@typescript-eslint/no-unsafe-return": "warn",
			"@typescript-eslint/no-unnecessary-type-assertion": "warn",
		},
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir,
			},
			globals: globals.browser,
		},
	},
	{
		ignores: ["main.js", "node_modules/**", "*.mjs"],
	},
);
