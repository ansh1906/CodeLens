const GITHUB_API = "https://api.github.com";

function authHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "codelens-app",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/** Parses a GitHub URL (or "owner/repo") into { owner, repo }. */
function parseRepoUrl(input) {
  const trimmed = input.trim().replace(/\.git$/, "");
  const shorthand = /^[\w.-]+\/[\w.-]+$/;
  if (shorthand.test(trimmed)) {
    const [owner, repo] = trimmed.split("/");
    return { owner, repo };
  }
  try {
    const url = new URL(trimmed);
    if (!url.hostname.includes("github.com")) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

async function ghFetch(path) {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const err = new Error(`GitHub API ${res.status} for ${path}: ${body.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/** Fetches repo metadata, mainly to discover the default branch. */
async function getRepoInfo(owner, repo) {
  return ghFetch(`/repos/${owner}/${repo}`);
}

/** Recursively fetches the full file tree for the default branch. */
async function getRepoTree(owner, repo, branch) {
  const data = await ghFetch(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  if (data.truncated) {
    console.warn(`Tree for ${owner}/${repo} was truncated by the GitHub API`);
  }
  return (data.tree || []).filter((entry) => entry.type === "blob");
}

/** Fetches raw text content of a single file via the contents API. */
async function getFileContent(owner, repo, path, branch) {
  const data = await ghFetch(
    `/repos/${owner}/${repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`
  );
  if (data.encoding === "base64" && data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return "";
}

module.exports = {
  parseRepoUrl,
  getRepoInfo,
  getRepoTree,
  getFileContent,
};
