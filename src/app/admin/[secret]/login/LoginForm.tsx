"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Lock, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";

export default function LoginForm({ secret }: { secret: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [otp, setOtp] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfoMessage("");

    try {
      const payload = mfaRequired
        ? { username: formData.username, password: formData.password, otp }
        : { username: formData.username, password: formData.password };

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.mfaRequired) {
          setMfaRequired(true);
          setInfoMessage("A verification code has been sent to your registered email address.");
        } else {
          // After login, the cookie is set — redirect to secret path
          router.push(`/admin/${secret}/dashboard`);
          router.refresh();
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resending) return;
    setResending(true);
    setError("");
    setInfoMessage("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.mfaRequired) {
        setInfoMessage("A new verification code has been sent to your email address.");
      } else {
        setError(data.error || "Failed to resend verification code.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleBackToCredentials = () => {
    setMfaRequired(false);
    setOtp("");
    setError("");
    setInfoMessage("");
  };

  return (
    <div className="min-h-screen bg-[#F1EFE7] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full overflow-hidden mb-4 cursor-pointer border border-black/[0.06] shadow-sm">
              <Image
                src="/logo.png"
                alt="Thread-aura Logo"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          </Link>
          <h1 className="font-serif text-[24px] font-medium text-[#0f3a2a] tracking-wide">
            Thread-aura Admin
          </h1>
          <p className="text-[12px] text-slate-500 mt-1 font-light">
            Sign in to manage your store
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-8 shadow-lg shadow-black/[0.04]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-[#8C2323]/[0.06] border border-[#8C2323]/15 text-[#8C2323] px-3 py-2 rounded-lg text-[12px] font-medium">
                {error}
              </div>
            )}

            {infoMessage && (
              <div className="bg-[#073623]/[0.06] border border-[#073623]/15 text-[#073623] px-3 py-2 rounded-lg text-[12px] font-medium">
                {infoMessage}
              </div>
            )}

            {!mfaRequired ? (
              // Stage 1: Credentials (Username & Password)
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                      placeholder="Enter username"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F1EFE7]/60 border border-black/[0.08] text-slate-800 rounded-lg placeholder-slate-400 focus:outline-none focus:border-[#073623] focus:ring-1 focus:ring-[#073623]/30 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      placeholder="Enter password"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F1EFE7]/60 border border-black/[0.08] text-slate-800 rounded-lg placeholder-slate-400 focus:outline-none focus:border-[#073623] focus:ring-1 focus:ring-[#073623]/30 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#073623] hover:bg-[#0c4a31] text-white py-2.5 rounded-lg text-[13px] font-medium transition-all disabled:opacity-50 mt-2 shadow-sm active:scale-[0.98] cursor-pointer tracking-wide"
                >
                  {loading ? "Verifying..." : "Sign In"}
                </button>
              </>
            ) : (
              // Stage 2: Multi-Factor Authentication (OTP verification)
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Verification Code (OTP)
                    </label>
                    <button
                      type="button"
                      onClick={handleBackToCredentials}
                      className="text-[11px] text-[#073623] hover:text-[#0c4a31] flex items-center gap-1 transition-colors cursor-pointer font-medium"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back
                    </button>
                  </div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      required
                      placeholder="Enter 6-digit code"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#F1EFE7]/60 border border-black/[0.08] text-slate-800 rounded-lg placeholder-slate-400 focus:outline-none focus:border-[#073623] focus:ring-1 focus:ring-[#073623]/30 transition-colors tracking-[0.2em] font-mono text-center text-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-[11px] text-[#073623] hover:text-[#0c4a31] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 font-medium"
                  >
                    <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                    {resending ? "Sending..." : "Resend Verification Code"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#073623] hover:bg-[#0c4a31] text-white py-2.5 rounded-lg text-[13px] font-medium transition-all disabled:opacity-50 mt-2 shadow-sm active:scale-[0.98] cursor-pointer tracking-wide"
                >
                  {loading ? "Verifying OTP..." : "Verify & Sign In"}
                </button>
              </>
            )}
          </form>
        </div>

        {/* Bottom text */}
        <p className="text-center text-[11px] text-slate-400 mt-6 font-light">
          &copy; {new Date().getFullYear()} Thread-aura. Crafted with elegance.
        </p>
      </div>
    </div>
  );
}
