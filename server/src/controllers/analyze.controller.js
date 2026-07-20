const { parseRepoUrl, getRepoInfo, getRepoTree, getFileContent } = require('../services/github');
const { selectFilesForReview, chunkContent } = require('../services/fileFilter');
const { reviewFileWithGroq } = require('../services/groq');
const { aggregateReport } = require('../services/aggregate');

const MAX_FILES = Number(process.env.MAX_FILES || 25);
const MAX_FILE_CHARS = Number(process.env.MAX_FILE_CHARS || 12000);

async function analyzeRepo(req, res) {
  const { repoUrl } = req.body ?? {};
  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({ error: 'repoUrl is required' });
  }

  const parsed = parseRepoUrl(repoUrl);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const info = await getRepoInfo(parsed.owner, parsed.repo);
    const branch = info.default_branch;
    const tree = await getRepoTree(parsed.owner, parsed.repo, branch);
    const selected = selectFilesForReview(tree, MAX_FILES);

    if (selected.length === 0) {
      return res.json({
        repo: `${parsed.owner}/${parsed.repo}`,
        branch,
        files: [],
        report: aggregateReport([]),
        message: 'No reviewable source files were found (after filtering vendored/binary/lock files).',
      });
    }

    const fileReviews = [];
    for (const entry of selected) {
      let content;
      try {
        content = await getFileContent(parsed.owner, parsed.repo, entry.path, branch);
      } catch (e) {
        fileReviews.push({ path: entry.path, score: null, summary: `Skipped: ${e.message}`, findings: [] });
        continue;
      }

      const chunks = chunkContent(content, MAX_FILE_CHARS);
      if (chunks.length === 1) {
        const review = await reviewFileWithGroq(entry.path, chunks[0]);
        fileReviews.push({ path: entry.path, ...review });
      } else {
        const merged = { summary: '', score: 0, findings: [] };
        for (let i = 0; i < chunks.length; i++) {
          const chunkReview = await reviewFileWithGroq(entry.path, chunks[i], { index: i, total: chunks.length });
          merged.findings.push(...chunkReview.findings);
          merged.score += chunkReview.score ?? 0;
        }
        merged.score = Math.round(merged.score / chunks.length);
        merged.summary = `Large file reviewed in ${chunks.length} chunks; ${merged.findings.length} findings total.`;
        fileReviews.push({ path: entry.path, ...merged });
      }
    }

    const report = aggregateReport(fileReviews);

    res.json({
      repo: `${parsed.owner}/${parsed.repo}`,
      branch,
      filesConsidered: tree.length,
      files: fileReviews,
      report,
    });
  } catch (err) {
    const status = err.status && err.status < 500 ? err.status : 500;
    res.status(status).json({ error: err.message });
  }
}

module.exports = {
  analyzeRepo,
};
