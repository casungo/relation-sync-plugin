import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function validateReleaseMetadata(pkg, manifest, versions, tag) {
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/, "Release version must use three numeric components");
  assert.match(manifest.minAppVersion, /^\d+\.\d+\.\d+$/, "Minimum app version must use three numeric components");
  assert.equal(pkg.version, manifest.version, "Package and manifest versions differ");
  assert.equal(versions[manifest.version], manifest.minAppVersion, "versions.json does not match minAppVersion");
  if (tag !== undefined) assert.equal(tag, manifest.version, "Release tag must match manifest.version without a prefix");
}

function checkRelease() {
  const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
  const tag = process.env.GITHUB_REF_TYPE === "tag" ? process.env.GITHUB_REF_NAME : undefined;
  validateReleaseMetadata(readJson("package.json"), readJson("manifest.json"), readJson("versions.json"), tag);
  const assets = ["main.js", "manifest.json", "styles.css"];
  const digest = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
  const before = assets.map(digest);
  execFileSync(process.execPath, ["esbuild.config.mjs", "production"], { stdio: "inherit" });
  assert.deepEqual(assets.map(digest), before, "Rebuilding changed release assets");
  console.log("Release metadata matches and the production build is reproducible.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) checkRelease();
