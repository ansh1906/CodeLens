const CODE_EXTENSIONS = new Set([
  "js", "jsx", "ts", "tsx", "mjs", "cjs",
  "py", "rb", "go", "rs", "java", "kt", "swift",
  "c", "cc", "cpp", "h", "hpp", "cs",
  "php", "sh", "sql", "vue", "svelte",
]);

const IGNORED_DIR_SEGMENTS = [
  "node_modules/", "dist/", "build/", "vendor/", ".git/", "coverage/",
  "__pycache__/", ".next/", "out/", "target/", "venv/", ".venv/",
];

const IGNORED_FILE_PATTERNS = [
  /package-lock\.json$/, /yarn\.lock$/, /pnpm-lock\.yaml$/,
  /\.min\.(js|css)$/, /\.map$/, /\.lock$/,
];

const MAX_BLOB_BYTES = 200_000; // skip very large generated/data files

function extensionOf(path) {
  const m = path.match(/\.([a-zA-Z0-9]+)$/);
  return m ? m[1].toLowerCase() : "";
}

function isIgnored(path) {
  if (IGNORED_DIR_SEGMENTS.some((seg) => path.includes(seg))) return true;
  if (IGNORED_FILE_PATTERNS.some((re) => re.test(path))) return true;
  return false;
}

/**
 * Filters the raw GitHub tree down to a bounded, representative set of
 * source files worth sending to the model.
 */
function selectFilesForReview(tree, maxFiles) {
  const candidates = tree.filter((entry) => {
    if (isIgnored(entry.path)) return false;
    if (!CODE_EXTENSIONS.has(extensionOf(entry.path))) return false;
    if (typeof entry.size === "number" && entry.size > MAX_BLOB_BYTES) return false;
    return true;
  });

  // Prioritize likely-important files (entry points, source dirs) over
  // deeply nested test fixtures / config, then fall back to size desc.
  const priority = (p) => {
    if (/^(src|app|lib|server|client)\//.test(p)) return 0;
    if (/test|spec|fixture|example/i.test(p)) return 2;
    return 1;
  };

  candidates.sort((a, b) => priority(a.path) - priority(b.path) || (b.size ?? 0) - (a.size ?? 0));

  return candidates.slice(0, maxFiles);
}
/**
 * Splits file content into chunks under maxChars, breaking on line
 * boundaries so a chunk never cuts a line in half.
 */
function chunkContent(content, maxChars) {
  if (content.length <= maxChars) return [content];
  const lines = content.split("\n");
  const chunks = [];
  let current = "";
  for (const line of lines) {
    if ((current + line + "\n").length > maxChars) {
      if (current) chunks.push(current);
      current = line + "\n";
    } else {
      current += line + "\n";
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

module.exports = {
  selectFilesForReview,
  chunkContent,
};
