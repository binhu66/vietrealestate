"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Globe, Bell, User, ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT, type Locale } from "@/i18n";

export default function Header() {
  const { locale, setLocale } = useLocale();
  const t = getT(locale);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const langs: { code: Locale; label: string; flag: string }[] = [
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
  ];

  const navLinks = [
    { href: "/bat-dong-san", label: t.nav.mua },
    { href: "/cho-thue", label: t.nav.thue },
    { href: "/thuong-mai", label: t.nav.thuongMai },
    { href: "/ban-do", label: t.nav.banDo },
    { href: "/tin-tuc", label: t.nav.tinTuc },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-red-600 text-white text-xs py-1 px-4 flex justify-between items-center">
        <span>📞 Hotline: 1800 6834 | 08:00 - 21:00 mỗi ngày</span>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hover:text-yellow-300 transition-colors">
            {t.nav.admin}
          </Link>
          <Link href="#" className="hover:text-yellow-300 transition-colors">
            {t.nav.dangnhap}
          </Link>
          <Link href="#" className="hover:text-yellow-300 transition-colors">
            {t.nav.dangky}
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm">VR</span>
          </div>
          <div className="leading-none">
            <div className="font-black text-red-600 text-lg tracking-tight">VietRealty</div>
            <div className="text-gray-400 text-[10px] leading-tight">Bất động sản</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Lang switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{langs.find((l) => l.code === locale)?.flag}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44 z-50">
                {langs.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLocale(l.code); setLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${locale === l.code ? "text-red-600 font-semibold" : "text-gray-700"}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                    {locale === l.code && <span className="ml-auto text-red-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/dang-tin"
            className="hidden sm:flex items-center gap-1 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            + {t.nav.dangTin}
          </Link>

          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dang-tin"
            className="block mt-2 text-center bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={() => setMobileOpen(false)}
          >
            + {t.nav.dangTin}
          </Link>
        </div>
      )}
    </header>
  );
}
