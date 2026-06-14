"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, string> = {
  google_access_denied: "Google sign-in was cancelled. Please try again.",
  invalid_state: "Security validation failed. Please try again.",
  google_auth_failed: "Google authentication failed. Please try again.",
  google_token_failed: "Failed to verify with Google. Please try again.",
  google_profile_failed: "Could not retrieve your Google profile. Please try again.",
  google_signup_failed: "Account creation failed. Please try again.",
  auth_required_wishlist: "Please sign in to add items to your wishlist.",
  auth_required_liked: "Please sign in to like products.",
};


function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = error ? ERROR_MESSAGES[error] || "Something went wrong. Please try again." : null;

  return (
    <div className="min-h-screen bg-[#F1EFE7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
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
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Thread-aura
          </Link>
        </div>

        {/* Card */}
        <div
          className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-black/[0.04] p-8 sm:p-10"
          style={{
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.03)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-medium tracking-wide text-[#0f3a2a] mb-2"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Welcome
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to your Thread-aura account
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <a
            href="/api/auth/google"
            id="google-signin-button"
            className="group flex items-center justify-center gap-3 w-full rounded-xl border border-black/[0.08] bg-white px-5 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-black/[0.12] hover:bg-gray-50 active:scale-[0.98]"
          >
            {/* Google "G" icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white/60 px-4 text-slate-400 uppercase tracking-widest">
                or
              </span>
            </div>
          </div>

          {/* Future: Manual email/password form placeholder */}
          <div className="rounded-xl bg-[#F1EFE7]/60 border border-black/[0.04] px-5 py-4 text-center">
            <p className="text-xs text-slate-400">
              Email &amp; password login coming soon
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          By signing in, you agree to our{" "}
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F1EFE7] flex items-center justify-center">
          <div className="animate-pulse text-slate-400 text-sm">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
