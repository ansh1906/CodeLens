import { useState } from "react";

const severityClasses = {
  low: "bg-emerald-500 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500 text-amber-600 dark:text-amber-400",
  high: "bg-orange-500 text-orange-600 dark:text-orange-400",
  critical: "bg-red-500 text-red-600 dark:text-red-400",
};

const categoryClasses = {
  bug: "border-orange-300 text-orange-700 dark:border-orange-800 dark:text-orange-300",
  security: "border-red-300 text-red-700 dark:border-red-800 dark:text-red-300",
  quality: "border-indigo-300 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300",
};

function Finding({ finding }) {
  return (
    <div className="flex border-b border-slate-200 last:border-b-0 dark:border-slate-800">
      <div className="flex w-[46px] shrink-0 flex-col items-center border-r border-slate-200 bg-slate-50 py-3 font-mono dark:border-slate-800 dark:bg-slate-900">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">{finding.line ?? "—"}</span>
        <span className={`mt-1.5 size-2 rounded-full ${severityClasses[finding.severity]?.split(" ")[0] ?? "bg-slate-400"}`} />
      </div>
      <div className="flex-1 bg-white px-4 py-3 dark:bg-slate-900">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className={`rounded border bg-slate-50 px-[7px] py-0.5 font-mono text-[10.5px] uppercase tracking-[0.03em] dark:bg-slate-800 ${categoryClasses[finding.category] ?? "border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-400"}`}>{finding.category}</span>
          <span className={`rounded border border-slate-300 bg-slate-50 px-[7px] py-0.5 font-mono text-[10.5px] uppercase tracking-[0.03em] dark:border-slate-700 dark:bg-slate-800 ${severityClasses[finding.severity]?.split(" ")[1] ?? "text-slate-500 dark:text-slate-400"}`}>{finding.severity}</span>
          <span className="text-[13.5px] font-semibold">{finding.title}</span>
        </div>
        <p className="mb-2 text-[13.5px] leading-5 text-slate-700 dark:text-slate-200">{finding.description}</p>
        <p className="text-[13px] leading-5 text-slate-500 dark:text-slate-400">
          <span className="mr-1.5 font-mono text-[10.5px] uppercase text-emerald-600 dark:text-emerald-400">fix</span> {finding.suggestion}
        </p>
      </div>
    </div>
  );
}

function FileRow({ file }) {
  const [open, setOpen] = useState(file.findings.length > 0);

  return (
    <div className="mb-2 overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-800">
      <button className="flex w-full cursor-pointer items-center gap-2.5 border-0 bg-white px-3.5 py-3 text-left font-mono text-[13px] text-slate-900 transition hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen((o) => !o)}>
        <span className="w-2.5 text-slate-500 dark:text-slate-400">{open ? "▾" : "▸"}</span>
        <span className="flex-1 font-semibold">{file.path}</span>
        <span className="hidden max-w-80 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-xs text-slate-500 dark:text-slate-400 min-[700px]:block">{file.summary}</span>
        <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">{file.findings.length} finding{file.findings.length === 1 ? "" : "s"}</span>
        <span className="w-[30px] text-right font-bold">{file.score ?? "—"}</span>
      </button>
      {open && file.findings.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-800">
          {file.findings.map((f, i) => (
            <Finding key={i} finding={f} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileFindings({ files }) {
  return (
    <section>
      <div className="flex justify-between px-3.5 pb-2 font-mono text-[11px] uppercase tracking-[0.04em] text-slate-500 dark:text-slate-400">
        <span>file</span>
        <span>score</span>
      </div>
      {files.map((file) => (
        <FileRow key={file.path} file={file} />
      ))}
    </section>
  );
}
