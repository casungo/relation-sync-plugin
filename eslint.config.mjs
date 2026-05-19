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
		rules: obsidianPlugin.configs.recommended,
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
