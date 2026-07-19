function scoreClass(score) {
  if (score === null || score === undefined) return "text-slate-500 dark:text-slate-400";
  if (score >= 80) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

const severityClasses = {
  critical: "border-red-300 text-red-700 dark:border-red-800 dark:text-red-300",
  high: "border-orange-300 text-orange-700 dark:border-orange-800 dark:text-orange-300",
  medium: "border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-300",
  low: "border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300",
};

export default function SummaryPanel({ repo, branch, report, filesConsidered }) {
  const { overallScore, findingCount, filesAnalyzed, totalsBySeverity, totalsByCategory } = report;

  return (
    <section className="mb-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-8 sm:py-7">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="font-mono text-xl font-bold sm:text-2xl">{repo}</div>
          <div className="mt-1.5 font-mono text-sm text-slate-500 dark:text-slate-400">branch: {branch} · {filesAnalyzed}/{filesConsidered} files reviewed</div>
        </div>
        <div className="flex items-baseline gap-0.5 font-mono">
          <span className={`text-4xl font-extrabold sm:text-5xl ${scoreClass(overallScore)}`}>{overallScore ?? "—"}</span>
          <span className="text-base text-slate-500 dark:text-slate-400">/100</span>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
          <span className="font-mono text-2xl font-bold">{findingCount}</span>
          <span className="text-xs uppercase tracking-[0.04em] text-slate-500 dark:text-slate-400">findings</span>
        </div>
        <div className="flex flex-col rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
          <span className="font-mono text-2xl font-bold">{totalsByCategory.bug ?? 0}</span>
          <span className="text-xs uppercase tracking-[0.04em] text-slate-500 dark:text-slate-400">bugs</span>
        </div>
        <div className="flex flex-col rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
          <span className="font-mono text-2xl font-bold">{totalsByCategory.security ?? 0}</span>
          <span className="text-xs uppercase tracking-[0.04em] text-slate-500 dark:text-slate-400">security</span>
        </div>
        <div className="flex flex-col rounded-xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
          <span className="font-mono text-2xl font-bold">{totalsByCategory.quality ?? 0}</span>
          <span className="text-xs uppercase tracking-[0.04em] text-slate-500 dark:text-slate-400">quality</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {["critical", "high", "medium", "low"].map((sev) => (
          <span key={sev} className={`rounded-full border px-3 py-1.5 font-mono text-xs ${severityClasses[sev]}`}>
            {sev} · {totalsBySeverity[sev] ?? 0}
          </span>
        ))}
      </div>
    </section>
  );
}
