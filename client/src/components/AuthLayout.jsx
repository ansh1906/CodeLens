import Strands from "./Strands.jsx";

function AuthLayout({ eyebrow, title, subtitle, bullets = [], footer, children }) {
    return (
        <div className="relative min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-gray-800 dark:text-slate-100 lg:flex">
            {/* Brand panel — desktop only */}
            <div className="relative hidden overflow-hidden bg-slate-900 lg:flex lg:w-[44%] lg:flex-col lg:justify-between lg:px-14 lg:py-16">
                <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
                    <Strands
                        colors={["#F97316", "#7C3AED", "#06B6D4"]}
                        count={3}
                        speed={1.1}
                        amplitude={0.22}
                        waviness={7}
                        thickness={0.7}
                        glow={1}
                        taper={0.2}
                        spread={9}
                        intensity={0.4}
                        saturation={1}
                        opacity={0.55}
                        scale={5}
                    />
                </div>

                <div className="relative z-10 flex items-center gap-3 font-mono text-3xl font-extrabold tracking-tight text-white">
                    CodeLens
                    <span className="font-bold text-indigo-400">{"~"}</span>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="font-mono text-4xl font-bold leading-tight text-white">{eyebrow}</h2>
                    {bullets.length > 0 && (
                        <ul className="mt-8 space-y-4">
                            {bullets.map((bullet, i) => (
                                <li key={i} className="flex items-start gap-3 text-lg text-slate-300">
                                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                                    {bullet}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="relative z-10 text-sm text-slate-500">
                    Structured, file-by-file reviews — bugs, security, and quality.
                </div>
            </div>

            {/* Form panel */}
            <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-14 sm:px-10 lg:px-16">
                {/* Mobile brand header */}
                <div className="mb-10 flex items-center justify-center gap-3 font-mono text-3xl font-extrabold tracking-tight lg:hidden">
                    CodeLens
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{"~"}</span>
                </div>

                <div className="mx-auto w-full max-w-md">
                    <div className="relative">
                        <div className="pointer-events-none absolute -inset-x-10 -top-16 h-40 bg-gradient-to-r from-orange-400/20 via-violet-500/20 to-cyan-400/20 blur-3xl" />
                        <div className="relative rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none sm:px-10 sm:py-12">
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
                            {subtitle && <p className="mt-3 text-base text-slate-600 dark:text-slate-400">{subtitle}</p>}
                            <div className="mt-8">{children}</div>
                        </div>
                    </div>

                    {footer && <div className="mt-8 text-center text-base text-slate-600 dark:text-slate-400">{footer}</div>}
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;
