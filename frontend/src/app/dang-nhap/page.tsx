"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, LogIn, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/locale";

const T = {
  vi: {
    title: "Đăng nhập",
    subtitle: "Đăng nhập để đăng tin và quản lý bất động sản",
    continueGoogle: "Tiếp tục với Google",
    continueFacebook: "Tiếp tục với Facebook",
    or: "hoặc",
    email: "Email",
    phoneTab: "📱 Số điện thoại",
    password: "Mật khẩu",
    submit: "Đăng nhập",
    submitting: "Đang đăng nhập...",
    noAccount: "Chưa có tài khoản?",
    signupNow: "Đăng ký ngay",
    invalidCreds: "Email hoặc mật khẩu không đúng.",
    sendOtp: "Gửi mã OTP",
    confirm: "Xác nhận",
    otpSentPrefix: "Nhập mã OTP đã gửi đến",
    otpPlaceholder: "6 chữ số",
    changePhone: "← Đổi số điện thoại",
    phonePlaceholder: "901 234 567",
  },
  en: {
    title: "Sign in",
    subtitle: "Sign in to post and manage your listings",
    continueGoogle: "Continue with Google",
    continueFacebook: "Continue with Facebook",
    or: "or",
    email: "Email",
    phoneTab: "📱 Phone number",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in...",
    noAccount: "No account yet?",
    signupNow: "Sign up now",
    invalidCreds: "Invalid email or password.",
    sendOtp: "Send OTP",
    confirm: "Confirm",
    otpSentPrefix: "Enter the OTP sent to",
    otpPlaceholder: "6 digits",
    changePhone: "← Change phone number",
    phonePlaceholder: "901 234 567",
  },
  zh: {
    title: "登录",
    subtitle: "登录以发布和管理您的房源",
    continueGoogle: "使用 Google 继续",
    continueFacebook: "使用 Facebook 继续",
    or: "或",
    email: "邮箱",
    phoneTab: "📱 手机号",
    password: "密码",
    submit: "登录",
    submitting: "登录中...",
    noAccount: "还没有账户？",
    signupNow: "立即注册",
    invalidCreds: "邮箱或密码错误。",
    sendOtp: "发送验证码",
    confirm: "确认",
    otpSentPrefix: "输入发送至以下号码的验证码",
    otpPlaceholder: "6 位数字",
    changePhone: "← 更换手机号",
    phonePlaceholder: "901 234 567",
  },
} as const;

async function signInWithGoogle(redirect: string) {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${location.origin}/auth/callback?next=${redirect}` },
  });
}
async function signInWithFacebook(redirect: string) {
  await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: { redirectTo: `${location.origin}/auth/callback?next=${redirect}` },
  });
}

function PhoneOTPForm({ redirect }: { redirect: string }) {
  const { locale } = useLocale();
  const L = T[locale];
  const router = useRouter();
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState("");
  const [step, setStep]       = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function sendOTP() {
    setError(""); setLoading(true);
    const e164 = phone.startsWith("0") ? "+84" + phone.slice(1) : phone;
    const { error } = await supabase.auth.signInWithOtp({ phone: e164 });
    if (error) { setError(error.message); setLoading(false); return; }
    setStep("otp"); setLoading(false);
  }

  async function verifyOTP() {
    setError(""); setLoading(true);
    const e164 = phone.startsWith("0") ? "+84" + phone.slice(1) : phone;
    const { error } = await supabase.auth.verifyOtp({ phone: e164, token: otp, type: "sms" });
    if (error) { setError(error.message); setLoading(false); return; }
    router.replace(redirect);
  }

  return (
    <div className="space-y-3">
      {step === "phone" ? (
        <>
          <div className="flex gap-2">
            <span className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-l-xl text-sm text-gray-600 border-r-0">+84</span>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder={L.phonePlaceholder} maxLength={12}
              className="flex-1 border border-gray-300 rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition"
            />
          </div>
          <button onClick={sendOTP} disabled={loading || phone.length < 9}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
            {L.sendOtp}
          </button>
        </>
      ) : (
        <>
          <p className="text-xs text-gray-500">{L.otpSentPrefix} <strong>{phone}</strong></p>
          <input
            type="text" value={otp} onChange={e => setOtp(e.target.value)}
            placeholder={L.otpPlaceholder} maxLength={6}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-center text-xl tracking-widest font-mono focus:outline-none focus:border-blue-400 transition"
          />
          <button onClick={verifyOTP} disabled={loading || otp.length < 6}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {L.confirm}
          </button>
          <button onClick={() => setStep("phone")} className="w-full text-xs text-gray-400 hover:text-gray-600">{L.changePhone}</button>
        </>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function LoginForm() {
  const { locale } = useLocale();
  const L = T[locale];
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") || "/";

  const [tab, setTab]           = useState<"email" | "phone">("email");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(null);
  const [error, setError]       = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(redirect);
    });
  }, [redirect, router]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === "Invalid login credentials" ? L.invalidCreds : error.message);
      setLoading(false); return;
    }
    router.replace(redirect);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-xl font-black text-gray-900 mb-6">{L.title}</h1>

      <div className="space-y-3 mb-6">
        <button
          onClick={() => { setOauthLoading("google"); signInWithGoogle(redirect); }}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          {oauthLoading === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          )}
          {L.continueGoogle}
        </button>
        <button
          onClick={() => { setOauthLoading("facebook"); signInWithFacebook(redirect); }}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#166FE5] transition-colors disabled:opacity-60"
        >
          {oauthLoading === "facebook" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          )}
          {L.continueFacebook}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">{L.or}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1">
        <button onClick={() => setTab("email")} className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${tab === "email" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
          {L.email}
        </button>
        <button onClick={() => setTab("phone")} className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${tab === "phone" ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
          {L.phoneTab}
        </button>
      </div>

      {tab === "phone" ? (
        <PhoneOTPForm redirect={redirect} />
      ) : (
        <>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{L.email}</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{L.password}</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition pr-12"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? L.submitting : L.submit}
            </button>
          </form>
        </>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        {L.noAccount}{" "}
        <Link href={`/dang-ky${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="text-red-600 font-semibold hover:underline">
          {L.signupNow}
        </Link>
      </div>
    </div>
  );
}

function PageHeader() {
  const { locale } = useLocale();
  const L = T[locale];
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-flex items-center gap-2">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-black">VR</span>
        </div>
        <span className="font-black text-red-600 text-2xl">VietRealty</span>
      </Link>
      <p className="text-gray-500 mt-2 text-sm">{L.subtitle}</p>
    </div>
  );
}

export default function DangNhapPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <PageHeader />
        <Suspense fallback={<div className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse" style={{height: 480}} />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
