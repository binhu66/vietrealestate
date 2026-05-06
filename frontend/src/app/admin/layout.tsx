"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Building2, Users, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT, type Locale } from "@/i18n";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAILS = ["condosmore66@gmail.com", "admin@vietrealestate.vn"];

const LAYOUT_T = {
  vi: { lightMode: "Chế độ sáng", darkMode: "Chế độ tối", switchToLight: "Chuyển sang sáng", switchToDark: "Chuyển sang tối", adminFallback: "Quản trị" },
  en: { lightMode: "Light Mode", darkMode: "Dark Mode", switchToLight: "Switch to Light", switchToDark: "Switch to Dark", adminFallback: "Admin" },
  zh: { lightMode: "浅色模式", darkMode: "深色模式", switchToLight: "切换为浅色", switchToDark: "切换为深色", adminFallback: "管理" },
} as const;

// Keep context for backwards compat with admin/page.tsx
type AuthCtx = { token: string | null; setToken: (t: string | null) => void };
export const AdminAuthContext = createContext<AuthCtx>({ token: null, setToken: () => {} });
export const useAdminAuth = () => useContext(AdminAuthContext);

type ThemeCtx = { dark: boolean; toggleDark: () => void };
export const AdminThemeContext = createContext<ThemeCtx>({ dark: false, toggleDark: () => {} });
export const useAdminTheme = () => useContext(AdminThemeContext);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { locale, setLocale } = useLocale();
  const t = getT(locale);
  const lt = LAYOUT_T[locale];
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Use Supabase session instead of localStorage token
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && ADMIN_EMAILS.includes(session.user.email ?? "")) {
        setToken(session.access_token);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session && ADMIN_EMAILS.includes(session.user.email ?? "")) {
        setToken(session.access_token);
      } else {
        setToken(null);
      }
    });
    const storedTheme = localStorage.getItem("admin_theme");
    setDark(storedTheme === "dark");
    return () => subscription.unsubscribe();
  }, []);

  function toggleDark() {
    setDark((d) => {
      const next = !d;
      localStorage.setItem("admin_theme", next ? "dark" : "light");
      return next;
    });
  }

  // Redirect non-admins away from protected pages
  if (!token && pathname !== "/admin") {
    if (typeof window !== "undefined") router.replace("/admin");
    return (
      <AdminAuthContext.Provider value={{ token, setToken }}>
        <AdminThemeContext.Provider value={{ dark, toggleDark }}>
          {children}
        </AdminThemeContext.Provider>
      </AdminAuthContext.Provider>
    );
  }

  if (!token) {
    return (
      <AdminAuthContext.Provider value={{ token, setToken }}>
        <AdminThemeContext.Provider value={{ dark, toggleDark }}>
          {children}
        </AdminThemeContext.Provider>
      </AdminAuthContext.Provider>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: t.admin.dashboard },
    { href: "/admin/bat-dong-san", icon: <Building2 className="w-5 h-5" />, label: t.admin.properties },
    { href: "/admin/nguoi-dung", icon: <Users className="w-5 h-5" />, label: t.admin.users },
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    setToken(null);
    router.push("/admin");
  }

  const langs: { code: Locale; flag: string; label: string }[] = [
    { code: "vi", flag: "🇻🇳", label: "VI" },
    { code: "en", flag: "🇺🇸", label: "EN" },
    { code: "zh", flag: "🇨🇳", label: "ZH" },
  ];

  return (
    <AdminAuthContext.Provider value={{ token, setToken }}>
      <AdminThemeContext.Provider value={{ dark, toggleDark }}>
        <div className={`${dark ? "dark" : ""} flex h-screen overflow-hidden`}>
          <div className="flex w-full h-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white overflow-hidden">

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-50 w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-200`}>
              {/* Logo */}
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="font-black text-xs text-white">VR</span>
                    </div>
                    <div>
                      <div className="font-black text-sm text-gray-900 dark:text-white">VietRealty</div>
                      <div className="text-gray-400 text-[10px]">Admin Panel</div>
                    </div>
                  </Link>
                  <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Lang + Theme + Logout */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                {/* Language */}
                <div className="flex gap-1">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLocale(l.code)}
                      className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${
                        locale === l.code
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                          : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>

                {/* Theme toggle */}
                <button
                  onClick={toggleDark}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-white transition-colors"
                >
                  <span>{dark ? lt.lightMode : lt.darkMode}</span>
                  {dark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  {t.admin.logout}
                </button>
              </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Topbar */}
              <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 shrink-0">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-gray-700 dark:hover:text-white">
                  <Menu className="w-5 h-5" />
                </button>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {navItems.find((n) => n.href === pathname)?.label || lt.adminFallback}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleDark}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title={dark ? lt.switchToLight : lt.switchToDark}
                  >
                    {dark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold text-white">A</div>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
                {children}
              </main>
            </div>

          </div>
        </div>
      </AdminThemeContext.Provider>
    </AdminAuthContext.Provider>
  );
}
