import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { ErrorAlert, SuccessAlert, PrimaryButton } from "../components/AuthControls.jsx";
import { verifyOTP, resendOTP } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

const BULLETS = [
    "File-by-file review, not a wall of diffs.",
    "Bugs, security, and quality in one pass.",
    "Paste a repo, get a structured report.",
];

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

function VerifyOTP({ email, onSuccess, onNavigateLogin }) {
    const location = useLocation();
    const userEmail = email || location.state?.email;
    const navigate = useNavigate();
    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [formError, setFormError] = useState(null);
    const [resent, setResent] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputsRef = useRef([]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    function handleChange(index, value) {
        const char = value.replace(/\D/g, "").slice(-1);
        setDigits((d) => {
            const next = [...d];
            next[index] = char;
            return next;
        });
        if (char && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index, e) {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    }

    function handlePaste(e) {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        setDigits((d) => {
            const next = [...d];
            for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
            return next;
        });
        inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);
        const code = digits.join("");
        if (code.length !== OTP_LENGTH) {
            setFormError(`Enter all ${OTP_LENGTH} digits.`);
            return;
        }
        setLoading(true);
        try {
            const data = await verifyOTP(userEmail, code);
            onSuccess?.(data);
            navigate("/dashboard");
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        setFormError(null);
        setResent(false);
        setResending(true);
        try {
            await resendOTP(userEmail);
            setResent(true);
            setCooldown(RESEND_SECONDS);
            setDigits(Array(OTP_LENGTH).fill(""));
            inputsRef.current[0]?.focus();
        } catch (err) {
            setFormError(err.message);
        } finally {
            setResending(false);
        }
    }

    return (
        <AuthLayout
            eyebrow="One more step."
            bullets={BULLETS}
            title="Verify your email"
            subtitle={
                userEmail ? (
                    <>
                        Enter the {OTP_LENGTH}-digit code we sent to{" "}
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{userEmail}</span>.
                    </>
                ) : (
                    `Enter the ${OTP_LENGTH}-digit code we sent you.`
                )
            }
            footer={
                <>
                    Wrong email?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Back to register
                    </button>
                </>
            }
        >
            <ErrorAlert>{formError}</ErrorAlert>
            <SuccessAlert>{resent ? "New code sent." : null}</SuccessAlert>
            <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputsRef.current[i] = el)}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className="h-16 w-12 rounded-xl border-2 border-slate-300 bg-white text-center text-2xl font-bold text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:h-20 sm:w-14"
                        />
                    ))}
                </div>

                <PrimaryButton type="submit" loading={loading}>
                    {loading ? "Verifying…" : "Verify"}
                </PrimaryButton>

                <p className="text-center text-base text-slate-600 dark:text-slate-400">
                    {cooldown > 0 ? (
                        <>Resend code in {cooldown}s</>
                    ) : (
                        <>
                            Didn&apos;t get a code?{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className="font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-60 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                {resending ? "Sending…" : "Resend"}
                            </button>
                        </>
                    )}
                </p>
            </form>
        </AuthLayout>
    );
}

export default VerifyOTP;
