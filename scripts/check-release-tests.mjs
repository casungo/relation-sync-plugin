import assert from "node:assert/strict";
import { test } from "node:test";
import { validateReleaseMetadata } from "./check-release.mjs";

const pkg = { version: "2.0.1" };
const manifest = { version: "2.0.1", minAppVersion: "1.7.2" };
const versions = { "2.0.1": "1.7.2" };

test("accepts matching metadata and tag", () => {
  validateReleaseMetadata(pkg, manifest, versions, "2.0.1");
  validateReleaseMetadata(pkg, manifest, versions);
});
test("rejects a package version mismatch", () => {
  assert.throws(() => validateReleaseMetadata({ version: "2.0.0" }, manifest, versions), /versions differ/);
});
test("rejects an absent or stale minimum version entry", () => {
  assert.throws(() => validateReleaseMetadata(pkg, manifest, {}), /minAppVersion/);
  assert.throws(() => validateReleaseMetadata(pkg, manifest, { "2.0.1": "1.4.4" }), /minAppVersion/);
});
test("rejects mismatched and prefixed tags", () => {
  for (const tag of ["2.0.0", "v2.0.1", ""]) {
    assert.throws(() => validateReleaseMetadata(pkg, manifest, versions, tag), /tag must match/);
  }
});
test("rejects prerelease and malformed versions", () => {
  for (const version of ["2.0.1-beta", "v2.0.1", "2.0"]) {
    assert.throws(() => validateReleaseMetadata(pkg, { ...manifest, version }, versions), /numeric components/);
  }
});

test("rejects a missing or malformed minimum app version", () => {
  assert.throws(() => validateReleaseMetadata(pkg, { version: "2.0.1" }, versions));
  assert.throws(() => validateReleaseMetadata(pkg, { ...manifest, minAppVersion: "latest" }, versions), /Minimum app version/);
});
