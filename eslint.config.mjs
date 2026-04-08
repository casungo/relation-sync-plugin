import js from "@eslint/js";
import tseslint from "typescript-eslint";
import obsidianPlugin from "eslint-plugin-obsidianmd";
import globals from "globals";

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	obsidianPlugin.configs.recommended,
	{
		languageOptions: {
			globals: globals.browser,
		},
	},
	{
		ignores: ["main.js", "node_modules/**", "*.mjs"],
	},
);
