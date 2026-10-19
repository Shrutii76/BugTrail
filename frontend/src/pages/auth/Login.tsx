import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bug,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
// import { authService } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");

    try {
      await login(values.email, values.password);
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.error?.message ??
            "Unable to log in. Check your connection and try again.",
        );
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <header className="auth-topbar">
        <Link to="/login" className="brand">
          <span className="brand-icon">
            <Bug size={22} />
          </span>
          <span>
            BugTrail<span className="brand-period">.</span>
          </span>
        </Link>

        <p>
          New to BugTrail?{" "}
          <Link to="/register" className="auth-top-link">
            Create account
          </Link>
        </p>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <div className="eyebrow">
            <span className="status-dot" />
            YOUR ENGINEERING WORKSPACE
          </div>

          <h1>
            Every bug has
            <br />a <span className="gradient-text">story.</span>
          </h1>

          <p className="auth-description">
            Trace issues from first report to final fix. Connect your bugs,
            commits, pull requests, and deployments in one place.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">
                <Bug size={18} />
              </span>
              <div>
                <strong>Understand every issue</strong>
                <p>Keep bug reports and discussions organized.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon cyan">
                <ArrowRight size={18} />
              </span>
              <div>
                <strong>Follow the complete timeline</strong>
                <p>Connect changes to the bugs they resolve.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="card-heading">
            <div className="card-icon">
              <LockKeyhole size={21} />
            </div>
            <h2>Welcome back</h2>
            <p>Sign in to continue to your workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="field-error">{errors.email.message}</p>
              )}
            </div>

            <div className="form-field">
              <div className="label-row">
                <label htmlFor="password">Password</label>
              </div>

              <div className="input-wrapper">
                <LockKeyhole size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="field-error">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="form-alert" role="alert">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={18} className="spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to BugTrail
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="secure-note">
            <ShieldCheck size={16} />
            Your session is protected with secure authentication.
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Sign up for free</Link>
          </p>
        </div>
      </section>

      <footer className="auth-footer">
        <span>© {new Date().getFullYear()} BugTrail</span>
        <span>Built for better debugging.</span>
      </footer>
    </main>
  );
}
