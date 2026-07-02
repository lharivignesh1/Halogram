/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  User as UserIcon, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Lock,
  PhoneCall
} from "lucide-react";

interface OnboardingProps {
  onComplete: (userData: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
  }) => void;
  verificationSettings: {
    requireEmail: boolean;
    requirePhone: boolean;
    requireUsername: boolean;
    enableOtpVerification: boolean;
    smsOtpCode: string;
    emailOtpCode: string;
  };
}

export default function Onboarding({ onComplete, verificationSettings }: OnboardingProps) {
  const [step, setStep] = useState<"welcome" | "register" | "verify" | "success">("welcome");
  
  // Registration Form State
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // OTP Verification State
  const [enteredSmsOtp, setEnteredSmsOtp] = useState("");
  const [enteredEmailOtp, setEnteredEmailOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [showOtpHint, setShowOtpHint] = useState(false);

  const handleStartRegistration = () => {
    setStep("register");
  };

  const validateAndSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate Full Name
    if (!fullName.trim()) {
      setError("Holographic identity signature (Full Name) is required.");
      return;
    }

    // Validate Username
    if (verificationSettings.requireUsername) {
      if (!username.trim()) {
        setError("Quantum node tag (Username) is required.");
        return;
      }
      if (username.length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }
      if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
        setError("Username can only contain letters, numbers, underscores, and dots.");
        return;
      }
    }

    // Validate Email
    if (verificationSettings.requireEmail) {
      if (!email.trim()) {
        setError("Active communications channel (Email) is required.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid holographic email address.");
        return;
      }
    }

    // Validate Phone Number
    if (verificationSettings.requirePhone) {
      if (!phone.trim()) {
        setError("Cellular uplink route (Phone Number) is required.");
        return;
      }
      if (phone.replace(/\D/g, "").length < 8) {
        setError("Uplink phone number must be at least 8 digits.");
        return;
      }
    }

    // If verification is enabled, go to verification step, otherwise go straight to success!
    if (verificationSettings.enableOtpVerification) {
      setStep("verify");
    } else {
      setStep("success");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    let smsMatch = true;
    let emailMatch = true;

    if (verificationSettings.requirePhone) {
      if (enteredSmsOtp.trim() !== verificationSettings.smsOtpCode) {
        smsMatch = false;
      }
    }

    if (verificationSettings.requireEmail) {
      if (enteredEmailOtp.trim() !== verificationSettings.emailOtpCode) {
        emailMatch = false;
      }
    }

    if (!smsMatch && !emailMatch) {
      setOtpError("Both phone and email verification keys are incorrect.");
      return;
    } else if (!smsMatch) {
      setOtpError("Quantum SMS verification key does not match.");
      return;
    } else if (!emailMatch) {
      setOtpError("Quantum email verification key does not match.");
      return;
    }

    // Verified successfully!
    setStep("success");
  };

  const handleFinishOnboarding = () => {
    onComplete({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim(),
      phone: phone.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4 overflow-y-auto font-sans text-white">
      {/* Immersive Starfield background simulation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.22),rgba(255,255,255,0))]" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#1f1f1f12_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f12_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-30" />

      {/* Main Container Card */}
      <div className="relative bg-zinc-950/90 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
        
        {/* Progress Tracker (Steps indicator) */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "welcome" ? "w-8 bg-cyan-500" : "w-3 bg-zinc-800"}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "register" ? "w-8 bg-cyan-500" : "w-3 bg-zinc-800"}`} />
          {verificationSettings.enableOtpVerification && (
            <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "verify" ? "w-8 bg-cyan-500" : "w-3 bg-zinc-800"}`} />
          )}
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === "success" ? "w-8 bg-cyan-500" : "w-3 bg-zinc-800"}`} />
        </div>

        {/* STEP 1: WELCOME SCREEN */}
        {step === "welcome" && (
          <div className="text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-purple-500 p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight uppercase font-mono bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Sync with Halogram
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto">
                Welcome to the next generation of visual communication. Before linking with our holographic channels, let's configure your quantum identity credentials.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 text-left space-y-3.5">
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block font-mono">
                SECURITY REQUIREMENTS DEFINED
              </span>
              
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <UserIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Unique quantum username registration</span>
                </div>
                {verificationSettings.requireEmail && (
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <Mail className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span>Holographic email verification protocol</span>
                  </div>
                )}
                {verificationSettings.requirePhone && (
                  <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                    <Smartphone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <span>2-Factor cellular SMS uplink verification</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>End-to-End symmetric key handshake active</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartRegistration}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-98 cursor-pointer"
            >
              <span>Initialize Node Sync</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* STEP 2: REGISTRATION FORM */}
        {step === "register" && (
          <form onSubmit={validateAndSubmitRegistration} className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight uppercase font-mono text-cyan-400">
                Identity Profile
              </h3>
              <p className="text-[11px] text-zinc-500">
                Input your true registration matrix. These credentials secure your direct telemetry syncs.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-mono">
                  Holographic Signature (Full Name) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your real full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Username */}
              {verificationSettings.requireUsername && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-mono">
                    Quantum Node Tag (Username) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-500/60 text-xs font-mono font-bold">
                      @
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="vignesh.mesh"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-8 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              {verificationSettings.requireEmail && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-mono">
                    Uplink Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="vignesh@halo.net"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Phone Number */}
              {verificationSettings.requirePhone && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-mono">
                    Cellular Uplink Router (Phone Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-98 cursor-pointer"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: OTP VERIFICATION CODE */}
        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight uppercase font-mono text-cyan-400">
                Quantum Handshake Verification
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Security protocol initialized. Simulated cryptographic handshake codes have been generated.
              </p>
            </div>

            {otpError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{otpError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* SMS Code */}
              {verificationSettings.requirePhone && (
                <div className="space-y-1.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-850">
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono font-bold uppercase mb-1">
                    <Smartphone className="w-3.5 h-3.5 text-orange-500" />
                    <span>CELLULAR SMS CHALLENGE CODE</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mb-2">
                    Enter the OTP code received on <span className="text-zinc-300 font-mono">{phone}</span>.
                  </p>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="Enter SMS OTP code"
                    value={enteredSmsOtp}
                    onChange={(e) => setEnteredSmsOtp(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-center font-mono font-bold tracking-widest text-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              )}

              {/* Email Code */}
              {verificationSettings.requireEmail && (
                <div className="space-y-1.5 bg-zinc-900/40 p-3 rounded-xl border border-zinc-850">
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono font-bold uppercase mb-1">
                    <Mail className="w-3.5 h-3.5 text-pink-500" />
                    <span>UPLINK EMAIL CHALLENGE CODE</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mb-2">
                    Enter the OTP code received on <span className="text-zinc-300 font-mono">{email}</span>.
                  </p>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="Enter Email OTP code"
                    value={enteredEmailOtp}
                    onChange={(e) => setEnteredEmailOtp(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-center font-mono font-bold tracking-widest text-pink-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              )}
            </div>

            {/* Simulated Debug Tools */}
            <div className="bg-cyan-950/25 border border-cyan-500/20 rounded-xl p-3 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" /> Simulated Router Logs
                </span>
                <button
                  type="button"
                  onClick={() => setShowOtpHint(!showOtpHint)}
                  className="text-[9px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-800"
                >
                  {showOtpHint ? "Hide Codes" : "Reveal Challenge Keys"}
                </button>
              </div>
              {showOtpHint && (
                <div className="text-[10px] font-mono text-cyan-300 bg-zinc-950/60 p-2 rounded border border-zinc-800/80 leading-relaxed space-y-1 animate-in slide-in-from-top-1">
                  {verificationSettings.requirePhone && (
                    <div>⚡ Quantum SMS OTP: <span className="bg-cyan-500 text-zinc-950 font-bold px-1 rounded">{verificationSettings.smsOtpCode}</span></div>
                  )}
                  {verificationSettings.requireEmail && (
                    <div>⚡ Quantum Email OTP: <span className="bg-pink-500 text-zinc-950 font-bold px-1 rounded">{verificationSettings.emailOtpCode}</span></div>
                  )}
                  <div className="text-[8px] text-zinc-500 mt-1">Copy and paste these codes directly above to confirm identity sync.</div>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStep("register")}
                className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <span>Verify Quantum Sync</span>
                <ShieldCheck className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: REGISTRATION SUCCESS */}
        {step === "success" && (
          <div className="text-center space-y-6 animate-in fade-in duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 p-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight text-white uppercase font-mono">
                Handshake Established!
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
                Identity verified on the blockchain. Your unique signature <span className="text-cyan-400 font-mono">@{username || "pioneer"}</span> is now online.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 text-left font-mono text-[10px] text-zinc-400 space-y-1">
              <div>🛰️ UPLINK TARGET: <span className="text-zinc-200">HALONET_PROD_V4</span></div>
              <div>🔑 IDENT_TAG: <span className="text-cyan-400">@{username || "vignesh.mesh"}</span></div>
              {verificationSettings.requireEmail && (
                <div>📧 SECURE_EMAIL: <span className="text-zinc-200">{email}</span></div>
              )}
              {verificationSettings.requirePhone && (
                <div>📱 SMS_ROUTING: <span className="text-zinc-200">{phone}</span></div>
              )}
              <div className="text-emerald-400 mt-2 font-bold">● CONNECTION STATUS: SECURE_SYNCED</div>
            </div>

            <button
              onClick={handleFinishOnboarding}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-98 cursor-pointer"
            >
              <span>Enter Halogram Portal</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
