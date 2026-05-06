"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/locale";

const T = {
  vi: {
    title: "Tạo tài khoản miễn phí",
    subtitle: "Đăng ký miễn phí — Google, Facebook hoặc Email",
    signupGoogle: "Đăng ký với Google",
    signupFacebook: "Đăng ký với Facebook",
    orEmail: "hoặc đăng ký bằng email",
    name: "Họ tên",
    namePlaceholder: "Nguyễn Văn A",
    email: "Email",
    password: "Mật khẩu",
    passwordPlaceholder: "Tối thiểu 6 ký tự",
    confirmPassword: "Xác nhận mật khẩu",
    confirmPlaceholder: "Nhập lại mật khẩu",
    submit: "Đăng ký",
    submitting: "Đang tạo tài khoản...",
    haveAccount: "Đã có tài khoản?",
    signin: "Đăng nhập",
    mismatch: "Mật khẩu xác nhận không khớp.",
    tooShort: "Mật khẩu tối thiểu 6 ký tự.",
    checkEmailTitle: "Kiểm tra email",
    checkEmailBody1: "Gửi link xác nhận đến",
    checkEmailBody2: ". Nhấp vào link để kích hoạt.",
    backToSignin: "Quay lại đăng nhập",
  },
  en: {
    title: "Create a free account",
    subtitle: "Sign up free — Google, Facebook or Email",
    signupGoogle: "Sign up with Google",
    signupFacebook: "Sign up with Facebook",
    orEmail: "or sign up with email",
    name: "Full name",
    namePlaceholder: "John Doe",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "Minimum 6 characters",
    confirmPassword: "Confirm password",
    confirmPlaceholder: "Re-enter password",
    submit: "Sign up",
    submitting: "Creating account...",
    haveAccount: "Already have an account?",
    signin: "Sign in",
    mismatch: "Passwords do not match.",
    tooShort: "Password must be at least 6 characters.",
    checkEmailTitle: "Check your email",
    checkEmailBody1: "We sent a confirmation link to",
    checkEmailBody2: ". Click the link to activate.",
    backToSignin: "Back to sign in",
  },
  zh: {
    title: "创建免费账户",
    subtitle: "免费注册 — Google、Facebook 或邮箱",
    signupGoogle: "使用 Google 注册",
    signupFacebook: "使用 Facebook 注册",
    orEmail: "或使用邮箱注册",
    name: "姓名",
    namePlaceholder: "张三",
    email: "邮箱",
    password: "密码",
    passwordPlaceholder: "至少 6 个字符",
    confirmPassword: "确认密码",
    confirmPlaceholder: "再次输入密码",
    submit: "注册",
    submitting: "创建账户中...",
    haveAccount: "已有账户？",
    signin: "登录",
    mismatch: "两次输入的密码不一致。",
    tooShort: "密码至少 6 个字符。",
    checkEmailTitle: "请检查邮箱",
    checkEmailBody1: "确认链接已发送至",
    checkEmailBody2: "。点击链接以激活账户。",
    backToSignin: "返回登录",
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

function RegisterForm() {
  const { locale } = useLocale();
  const L = T[locale];
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") || "/";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [name, setName]         = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(null);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace(redirect);
    });
  }, [redirect, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError(L.mismatch); return; }
    if (password.length < 6)  { setError(L.tooShort); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: name || email.split("@")[0] } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.session) { router.replace(redirect); return; }
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-black text-gray-900 mb-2">{L.checkEmailTitle}</h2>
        <p className="text-gray-500 text-sm mb-6">
          {L.checkEmailBody1} <strong>{email}</strong>{L.checkEmailBody2}
        </p>
        <Link href="/dang-nhap" className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">
          {L.backToSignin}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-xl font-black text-gray-900 mb-6">{L.title}</h1>

      <div className="space-y-3 mb-6">
        <button onClick={() => { setOauthLoading("google"); signInWithGoogle(redirect); }} disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          {oauthLoading === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          )}
          {L.signupGoogle}
        </button>
        <button onClick={() => { setOauthLoading("facebook"); signInWithFacebook(redirect); }} disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#166FE5] transition-colors disabled:opacity-60"
        >
          {oauthLoading === "facebook" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          )}
          {L.signupFacebook}
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">{L.orEmail}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{L.name}</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={L.namePlaceholder}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{L.email}</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{L.password}</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder={L.passwordPlaceholder}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition pr-12"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{L.confirmPassword}</label>
          <input type={showPw ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder={L.confirmPlaceholder}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition"
          />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          {loading ? L.submitting : L.submit}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        {L.haveAccount}{" "}
        <Link href="/dang-nhap" className="text-red-600 font-semibold hover:underline">{L.signin}</Link>
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

export default function DangKyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <PageHeader />
        <Suspense fallback={<div className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse" style={{height: 560}} />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
