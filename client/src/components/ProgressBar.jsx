export default function ProgressBar({ label }) {
  return (
    <div className="mx-auto mb-10 w-full max-w-3xl text-center" role="status" aria-live="polite">
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full w-2/5 animate-pulse rounded-full bg-indigo-600 dark:bg-indigo-400" />
      </div>
      <span className="mt-3 block font-mono text-sm text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}
