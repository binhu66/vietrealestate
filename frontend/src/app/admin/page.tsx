"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAILS = ["condosmore66@gmail.com", "admin@vietrealestate.vn"];

export default function AdminLoginPage() {
  const { locale } = useLocale();
  const t = getT(locale);
  const router = useRouter();

  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && ADMIN_EMAILS.includes(session.user.email ?? "")) {
        router.replace("/admin/dashboard");
      }
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Email hoặc mật khẩu không đúng");
      setLoading(false);
      return;
    }
    if (!ADMIN_EMAILS.includes(data.user?.email ?? "")) {
      await supabase.auth.signOut();
      setError("Tài khoản không có quyền admin");
      setLoading(false);
      return;
    }
    router.replace("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200">
            <span className="text-white font-black text-2xl">VR</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">VietRealty Admin</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t.admin.login}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">{t.admin.email}</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@vietrealestate.vn"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">{t.admin.password}</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn className="w-5 h-5" />}
              {t.admin.loginBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
