import globals from "globals";
import obsidianPlugin from "eslint-plugin-obsidianmd";
import { fileURLToPath } from "node:url";

export default [
	...obsidianPlugin.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ["eslint.config.mjs", "esbuild.config.mjs", "version-bump.mjs", "vitest.config.mjs"],
				},
				tsconfigRootDir: fileURLToPath(new URL(".", import.meta.url)),
			},
		},
	},
	{
		files: ["*.mjs"],
		languageOptions: { globals: globals.node },
		// These files run in Node during development, not inside Obsidian.
		rules: { "obsidianmd/no-nodejs-modules": "off" },
	},
	{
		ignores: ["main.js", "node_modules/**", "scripts/**", "src/*.test.ts", "src/mocks/**"],
	},
];
