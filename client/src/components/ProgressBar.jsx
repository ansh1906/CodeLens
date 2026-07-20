export default function ProgressBar({ label }) {
  return (
    <div className="mx-auto mb-10 w-full max-w-3xl text-center" role="status" aria-live="polite">
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full animate-progress rounded-full bg-blue-600 dark:bg-blue-400" />
      </div>
      <span className="mt-3 block font-mono text-lg text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}
