import { useState } from "react";
import RepoForm from "../components/RepoForm.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import SummaryPanel from "../components/SummaryPanel.jsx";
import FileFindings from "../components/FileFindings.jsx";
import { analyzeRepo } from "../api/api.js";

function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    async function handleSubmit(repoUrl) {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
        const data = await analyzeRepo(repoUrl);
        setResult(data);
        } catch (e) {
        setError(e.message);
        } finally {
        setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-gray-800 dark:text-slate-100">
          <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 sm:px-10 sm:py-20">
          <header className="mx-auto mb-12 max-w-3xl text-center">
            <div className="flex items-center justify-center gap-3 font-mono text-4xl font-extrabold tracking-tight sm:text-5xl">
              CodeLens
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{"~"}</span>
            </div>
            <p className="mt-4 text-2xl text-slate-600 dark:text-slate-300">AI-powered repository review — bugs, security, quality, file by file.</p>
          </header>
    
          <div className="mx-auto w-full max-w-3xl">
            <RepoForm onSubmit={handleSubmit} loading={loading} />
          </div>
    
          {loading && <ProgressBar label="fetching tree · filtering files · running review model…" />}
    
          {error && (
            <div className="mx-auto mb-8 w-full max-w-3xl rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-base text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
              <span className="mr-1.5 font-semibold uppercase">error</span> {error}
            </div>
          )}
    
          {result && !loading && (
            <div className="mx-auto w-full max-w-5xl">
              {result.message && <div className="mb-6 text-center text-base text-slate-600 dark:text-slate-400">{result.message}</div>}
              <SummaryPanel
                repo={result.repo}
                branch={result.branch}
                report={result.report}
                filesConsidered={result.filesConsidered}
              />
              {result.files.length > 0 && <FileFindings files={result.files} />}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="mx-auto flex min-h-80 w-full max-w-3xl flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 text-center text-lg shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p>Paste a public GitHub repository URL above to get a structured, file-by-file review.</p>
              <p className="mt-3 text-base text-slate-500 dark:text-slate-400">Try something small first — reviews run one file at a time.</p>
            </div>
          )}
          </main>
        </div>
    );
}

export default Dashboard
