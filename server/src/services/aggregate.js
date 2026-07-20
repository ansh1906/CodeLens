const SEVERITY_WEIGHT = { low: 1, medium: 3, high: 6, critical: 10 };

/**
 * Combines per-file review results into a single repo-level report:
 * totals by category/severity, an overall score, and the highest-signal
 * findings across the whole repo.
 */
function aggregateReport(fileReviews) {
  const totals = { bug: 0, security: 0, quality: 0 };
  const bySeverity = { low: 0, medium: 0, high: 0, critical: 0 };
  let weightedSum = 0;
  let findingCount = 0;
  const scored = [];

  for (const file of fileReviews) {
    if (typeof file.score === "number") scored.push(file.score);
    for (const f of file.findings) {
      totals[f.category] = (totals[f.category] ?? 0) + 1;
      bySeverity[f.severity] = (bySeverity[f.severity] ?? 0) + 1;
      weightedSum += SEVERITY_WEIGHT[f.severity] ?? 1;
      findingCount += 1;
    }
  }

  const avgFileScore = scored.length
    ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
    : null;

  // Penalize the average by how much high-severity noise came up, floor at 0.
  const penalty = Math.min(40, weightedSum);
  const overallScore = avgFileScore !== null ? Math.max(0, avgFileScore - penalty * 0.3) : null;

  const topFindings = fileReviews
    .flatMap((file) => file.findings.map((f) => ({ ...f, file: file.path })))
    .sort((a, b) => (SEVERITY_WEIGHT[b.severity] ?? 0) - (SEVERITY_WEIGHT[a.severity] ?? 0))
    .slice(0, 10);

  return {
    filesAnalyzed: fileReviews.length,
    findingCount,
    totalsByCategory: totals,
    totalsBySeverity: bySeverity,
    averageFileScore: avgFileScore,
    overallScore: overallScore !== null ? Math.round(overallScore) : null,
    topFindings,
  };
}

module.exports = {
  aggregateReport,
};
