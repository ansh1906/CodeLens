import { useState } from "react";
import AuthLayout from "../components/AuthLayout.jsx";
import { ErrorAlert, TextField, PasswordField, PrimaryButton } from "../components/AuthControls.jsx";
import { registerUser } from "../services/authService.js";
import { useNavigate } from "react-router-dom";
const BULLETS = [
    "File-by-file review, not a wall of diffs.",
    "Bugs, security, and quality in one pass.",
    "Paste a repo, get a structured report.",
];

function Register({ onSuccess, onNavigateLogin }) {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();

    function update(field) {
        return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
    }

    function validate() {
        const next = {};
        if (!form.name.trim()) next.name = "Enter your name.";
        if (!form.email.trim()) next.email = "Enter your email.";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
        if (!form.password) next.password = "Choose a password.";
        else if (form.password.length < 8) next.password = "Use at least 8 characters.";
        if (form.confirm && form.confirm !== form.password) {
            next.confirm = "Passwords don't match.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e) {
        console.log("Submit clicked");
        e.preventDefault();
        setFormError(null);
        if (!validate()){
            console.log("valid failed");
          return;
        }
            
        setLoading(true);
        try {
            const data = await registerUser(
                form.name.trim(),
                form.email.trim(),
                form.password
            );
            onSuccess?.(data, form.email.trim());
            navigate("/verify-otp", { state: { email: form.email.trim() } });
        } catch (err) {
                console.error("Register error:", err);
            setFormError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            eyebrow="Start reviewing smarter."
            bullets={BULLETS}
            title="Create your account"
            subtitle="Set up CodeLens in under a minute."
            footer={
                <>
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Log in
                    </button>
                </>
            }
        >
            <ErrorAlert>{formError}</ErrorAlert>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <TextField
                    id="register-name"
                    label="Name"
                    autoComplete="name"
                    placeholder=""
                    value={form.name}
                    onChange={update("name")}
                    error={errors.name}
                />
                <TextField
                    id="register-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update("email")}
                    error={errors.email}
                />
                <PasswordField
                    id="register-password"
                    label="Password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={update("password")}
                    error={errors.password}
                />
                {/* <PasswordField
                    id="register-confirm"
                    label="Confirm password"
                    autoComplete="new-password"
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={update("confirm")}
                    error={errors.confirm}
                /> */}
                <PrimaryButton type="submit" loading={loading}>
                    {loading ? "Creating account…" : "Create account"}
                </PrimaryButton>
            </form>
        </AuthLayout>
    );
}

export default Register;
