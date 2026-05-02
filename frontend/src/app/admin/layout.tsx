"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, BarChart3,
  LogOut, Menu, X, Globe, ChevronDown
} from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT, type Locale } from "@/i18n";

type AuthCtx = { token: string | null; setToken: (t: string | null) => void };
export const AdminAuthContext = createContext<AuthCtx>({ token: null, setToken: () => {} });
export const useAdminAuth = () => useContext(AdminAuthContext);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { locale, setLocale } = useLocale();
  const t = getT(locale);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    setToken(stored);
  }, []);

  if (!token && pathname !== "/admin") {
    return (
      <AdminAuthContext.Provider value={{ token, setToken }}>
        {children}
      </AdminAuthContext.Provider>
    );
  }

  if (!token) {
    return (
      <AdminAuthContext.Provider value={{ token, setToken }}>
        {children}
      </AdminAuthContext.Provider>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: t.admin.dashboard },
    { href: "/admin/bat-dong-san", icon: <Building2 className="w-5 h-5" />, label: t.admin.properties },
    { href: "/admin/nguoi-dung", icon: <Users className="w-5 h-5" />, label: t.admin.users },
  ];

  function handleLogout() {
    localStorage.removeItem("admin_token");
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
      <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-50 w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-200`}>
          {/* Logo */}
          <div className="p-5 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="font-black text-xs">VR</span>
                </div>
                <div>
                  <div className="font-black text-sm">VietRealty</div>
                  <div className="text-gray-500 text-[10px]">Admin Panel</div>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-500">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === item.href ? "bg-red-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Lang + Logout */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            <div className="flex gap-1">
              {langs.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLocale(l.code)}
                  className={`flex-1 py-1 text-xs rounded-lg transition-colors ${locale === l.code ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              {t.admin.logout}
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-gray-400">
              {navItems.find((n) => n.href === pathname)?.label || "Admin"}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold">A</div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-950 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthContext.Provider>
  );
}
