import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bug,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .refine(
        (value) => new TextEncoder().encode(value).length <= 72,
        "Password must not exceed 72 bytes",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register: createAccount } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError("");

    try {
      await createAccount(
        values.name.trim(),
        values.email.trim(),
        values.password,
      );

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.error?.message ??
            "Unable to create your account. Please try again.",
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
          Already have an account?{" "}
          <Link to="/login" className="auth-top-link">
            Sign in
          </Link>
        </p>
      </header>

      <section className="auth-layout register-layout">
        <div className="auth-intro">
          <div className="eyebrow">
            <span className="status-dot" />
            START BUILDING BETTER
          </div>

          <h1>
            Debug smarter.
            <br />
            Ship with <span className="gradient-text">confidence.</span>
          </h1>

          <p className="auth-description">
            Bring your bug reports, code changes, and engineering activity
            together. Give every issue a clear history.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">
                <Check size={18} />
              </span>
              <div>
                <strong>One place for your bugs</strong>
                <p>Track issues, priorities, and resolutions.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon cyan">
                <Check size={18} />
              </span>
              <div>
                <strong>Built for engineering teams</strong>
                <p>Connect your workflow as your team grows.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card register-card">
          <div className="card-heading">
            <div className="card-icon">
              <UserRound size={21} />
            </div>
            <h2>Create your account</h2>
            <p>Get started with your BugTrail workspace.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <div className="input-wrapper">
                <UserRound size={18} className="input-icon" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  aria-invalid={!!errors.name}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="field-error">{errors.name.message}</p>
              )}
            </div>

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
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <LockKeyhole size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="input-wrapper">
                <LockKeyhole size={18} className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="field-error">{errors.confirmPassword.message}</p>
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
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="secure-note">
            <ShieldCheck size={16} />
            Your password is securely hashed on the server.
          </div>

          <p className="auth-switch">
            Already registered? <Link to="/login">Sign in</Link>
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
