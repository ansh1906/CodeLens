import { useState } from "react";

export function ErrorAlert({ children }) {
    if (!children) return null;
    return (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center text-base text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
            <span className="mr-1.5 font-semibold uppercase">error</span> {children}
        </div>
    );
}

export function SuccessAlert({ children }) {
    if (!children) return null;
    return (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-base text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
            {children}
        </div>
    );
}

export function Spinner({ className = "h-5 w-5" }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

const baseInput =
    "w-full rounded-xl border bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 dark:bg-slate-800 dark:text-slate-100";

const inputState = (error) =>
    error
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700";

export function TextField({ label, id, error, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </label>
            <input id={id} className={`${baseInput} ${inputState(error)}`} {...props} />
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

export function PasswordField({ label, id, error, ...props }) {
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? "text" : "password"}
                    className={`${baseInput} ${inputState(error)} pr-12`}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    {visible ? (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.774 3.162 10.066 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

export function PrimaryButton({ loading, children, className = "", ...props }) {
    return (
        <button
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-lg font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-400 ${className}`}
            disabled={loading}
            {...props}
        >
            {loading && <Spinner />}
            {children}
        </button>
    );
}
