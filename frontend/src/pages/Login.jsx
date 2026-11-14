import { ArrowRight, Eye, EyeOff, KeyRound, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo, ForensicFingerprintGraphic } from '../components/BrandLogo';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signInDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('aswin@evidenceai.demo');
  const [password, setPassword] = useState('demo-forensics-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both an email address and password.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      signInDemo({ email, rememberMe });
      toast.success('Signed in to EVIDENCE AI demonstration workspace.');
      navigate(redirectPath, { replace: true });
    }, 300);
  };

  const handleDemoLogin = () => {
    setSubmitting(true);
    setTimeout(() => {
      signInDemo({ email: 'aswin@evidenceai.demo', rememberMe: true });
      toast.success('Entered Demonstration Mode as Aswin (AC).');
      navigate('/dashboard', { replace: true });
    }, 220);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error('Enter your account email to preview reset instructions.');
      return;
    }
    toast.success('Demo Notice: Password reset requires a connected authentication backend.');
    setForgotOpen(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-screen bg-[#F5F6FC] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl bg-white border border-[#E5E7F0] rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Login Form */}
        <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <BrandLogo />

            <div className="mt-8">
              <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
                Welcome Back
              </h1>
              <p className="mt-1.5 text-sm text-[#64748B]">
                Sign in to access your digital forensics &amp; evidence intelligence workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-[#172554] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investigator@agency.org"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#7656E8] focus:ring-2 focus:ring-[#F0EBFF]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-[#172554] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#F5F6FC] border border-[#E5E7F0] text-sm text-[#172554] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#7656E8] focus:ring-2 focus:ring-[#F0EBFF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#172554]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[#7656E8] focus:ring-[#7656E8]"
                  />
                  <span className="text-xs font-medium text-[#64748B]">Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotOpen((prev) => !prev)}
                  className="text-xs font-semibold text-[#7656E8] hover:text-[#5b3cd6]"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#7656E8] to-[#367FEA] text-white text-sm font-semibold shadow-sm hover:opacity-95 disabled:opacity-60 transition-opacity flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {forgotOpen && (
              <form
                onSubmit={handleForgotSubmit}
                className="mt-4 p-4 rounded-2xl bg-[#F5F6FC] border border-[#E5E7F0] space-y-2.5"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-[#172554]">
                  <KeyRound className="w-3.5 h-3.5 text-[#7656E8]" />
                  <span>Password Recovery (Demo Preview)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter investigator email"
                    className="flex-1 h-9 px-3 rounded-lg bg-white border border-[#E5E7F0] text-xs text-[#172554] focus:outline-none focus:border-[#7656E8]"
                  />
                  <button
                    type="submit"
                    className="px-3 h-9 rounded-lg bg-[#172554] text-white text-xs font-medium whitespace-nowrap"
                  >
                    Send Reset
                  </button>
                </div>
              </form>
            )}

            {/* Explicit Hackathon Demo Login Box */}
            <div className="mt-6 pt-5 border-t border-[#E5E7F0]">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={submitting}
                className="w-full h-11 rounded-xl bg-[#F0EBFF] hover:bg-[#e5dcff] border border-[#7656E8]/20 text-[#7656E8] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>One-Click Demo Login (Aswin)</span>
              </button>
              <p className="mt-2.5 text-[11px] text-[#64748B] leading-relaxed">
                Demonstration Access: This frontend prototype runs locally without a live authentication server. Connect your Flask backend at <span className="font-mono">http://localhost:5000</span> for production auth.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Forensics Visual Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#F0EBFF] via-[#F5F6FC] to-[#EAF2FF] border-t lg:border-t-0 lg:border-l border-[#E5E7F0] p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-medium text-[#64748B]">
            <span>Digital Forensics Workspace</span>
            <span className="font-mono text-[#7656E8]">SHA-256 · Timeline · Graph</span>
          </div>

          <div className="my-8 flex flex-col items-center text-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white/80 border border-[#E5E7F0] shadow-sm flex items-center justify-center p-6">
              <ForensicFingerprintGraphic className="w-full h-full" />
            </div>

            <h2 className="mt-7 text-xl font-bold text-[#172554] max-w-sm text-balance">
              Smarter Investigation. Stronger Justice.
            </h2>
            <p className="mt-2 text-sm text-[#64748B] max-w-md leading-relaxed">
              Organize multi-format artifacts, compute cryptographic SHA-256 digests in-browser, and explore chronological evidence links in one unified console.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white/90 border border-[#E5E7F0] rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F0EBFF] text-[#7656E8] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#172554]">Client-Side Integrity</div>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Real Web Crypto SHA-256 hashing for newly uploaded files.
                </p>
              </div>
            </div>

            <div className="bg-white/90 border border-[#E5E7F0] rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#EAF2FF] text-[#367FEA] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#172554]">Transparent Leads</div>
                <p className="text-[11px] text-[#64748B] mt-0.5">
                  Separates extracted evidence text from AI hypotheses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
