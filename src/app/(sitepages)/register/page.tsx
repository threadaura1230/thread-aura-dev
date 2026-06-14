"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  google_access_denied: "Google sign-in was cancelled. Please try again.",
  invalid_state: "Security validation failed. Please try again.",
  google_auth_failed: "Google authentication failed. Please try again.",
  google_token_failed: "Failed to verify with Google. Please try again.",
  google_profile_failed: "Could not retrieve your Google profile. Please try again.",
  google_signup_failed: "Account creation failed. Please try again.",
};

function RegisterContent() {
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const initialErrorMessage = oauthError ? ERROR_MESSAGES[oauthError] || "Something went wrong. Please try again." : null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(initialErrorMessage);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to register. Please try again.");
      } else {
        // Successful registration, perform hard navigation to home to reload state
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1EFE7] flex flex-col items-center justify-start px-4 pt-24 pb-12">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="mb-4 text-center relative z-[60]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Thread-aura
          </Link>
        </div>

        {/* Card */}
        <div
          className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-black/[0.04] p-6 sm:p-8"
          style={{
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.03)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-5">
            <h1
              className="text-2xl font-medium tracking-wide text-[#0f3a2a] mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Create Account
            </h1>
            <p className="text-xs text-slate-500">
              Sign up to unlock wishlist, likes, and more
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-xs text-red-700 flex items-start gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-[10px] font-medium text-slate-600 mb-1 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-black/[0.08] bg-white/80 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-medium text-slate-600 mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-black/[0.08] bg-white/80 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-medium text-slate-600 mb-1 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/[0.08] bg-white/80 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] font-medium text-slate-600 mb-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-black/[0.08] bg-white/80 px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0f3a2a] focus:ring-1 focus:ring-[#0f3a2a] focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 rounded-xl bg-[#0f3a2a] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#134a31] hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-transparent px-3 text-slate-400 uppercase tracking-widest text-[10px]">
                or
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <a
            href="/api/auth/google"
            id="google-signup-button"
            className="group flex items-center justify-center gap-2.5 w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-black/[0.12] hover:bg-gray-50 active:scale-[0.98]"
          >
            {/* Google "G" icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 48 48"
              className="flex-shrink-0"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span>Continue with Google</span>
          </a>

          {/* Already have an account? */}
          <div className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-[#0f3a2a] hover:text-[#134a31] underline underline-offset-2 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          By signing up, you agree to our{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-slate-600 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-slate-600 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F1EFE7] flex items-center justify-center">
          <div className="animate-pulse text-slate-400 text-sm">Loading...</div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
