import { useState } from "react";

export default function RepoForm({ onSubmit, loading }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
  }

  return (
    <form className="mb-10 flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-5 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900">
        <span className="whitespace-nowrap font-mono text-sm text-emerald-600 dark:text-emerald-400">codelens ~</span>
        <input
          className="flex-1 border-0 bg-transparent py-4 font-mono text-base text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-100 dark:placeholder:text-slate-500"
          placeholder="Paste a GitHub repository URL"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={loading}
          spellCheck={false}
          autoFocus
        />
      </div>
      <button className="cursor-pointer whitespace-nowrap rounded-xl bg-indigo-600 px-7 py-4 font-mono text-base font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-default disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400" type="submit" disabled={loading}>
        {loading ? "analyzing…" : "run review →"}
      </button>
    </form>
  );
}
