import { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import { ErrorAlert, TextField, PasswordField, PrimaryButton } from "../components/AuthControls.jsx";
import { loginUser } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

const BULLETS = [
    "File-by-file review, not a wall of diffs.",
    "Bugs, security, and quality in one pass.",
    "Paste a repo, get a structured report.",
];

function Login({ onSuccess, onNavigateRegister }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();

    function update(field) {
        return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
    }

    function validate() {
        const next = {};
        if (!form.email.trim()) next.email = "Enter your email.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
        if (!form.password) next.password = "Enter your password.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setFormError(null);
        if (!validate()) return;
        setLoading(true);
        try {
            const data = await loginUser(form.email.trim(), form.password);
            onSuccess?.(data);
            navigate("/dashboard");
        } catch (err) {
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            eyebrow="Welcome back to CodeLens~"
            bullets={BULLETS}
            title="Log in"
            subtitle="Pick up your reviews where you left off."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        onClick={()=> navigate("/register")}
                        className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >

                        Create one
                    </button>
                </>
            }
        >
            <ErrorAlert>{formError}</ErrorAlert>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <TextField
                    id="login-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update("email")}
                    error={errors.email}
                />
                <PasswordField
                    id="login-password"
                    label="Password"
                    autoComplete="current-password"
                    placeholder="Enter password here"
                    value={form.password}
                    onChange={update("password")}
                    error={errors.password}
                />
                <PrimaryButton type="submit" loading={loading}>
                    {loading ? "Logging in…" : "Log in"}
                </PrimaryButton>
            </form>
        </AuthLayout>
    );
}

export default Login;
