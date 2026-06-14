export function isExcludedPath(filePath: string, excludePaths: string): boolean {
  const raw = excludePaths ?? "";
  if (!raw.trim()) return false;
  const patterns = raw.split(",").map((p) => p.trim().toLowerCase()).filter(Boolean);
  const lower = filePath.toLowerCase();
  return patterns.some((p) => lower === p || lower.startsWith(p + "/") || lower.startsWith(p + "\\"));
}
