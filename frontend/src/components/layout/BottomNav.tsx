"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MapPin, PlusCircle, User } from "lucide-react";
import { useLocale } from "@/lib/locale";

const NAV = [
  { href: "/",            icon: Home,       label: { vi: "Trang chủ", en: "Home",   zh: "首页" } },
  { href: "/bat-dong-san",icon: Search,     label: { vi: "Tìm kiếm",  en: "Search", zh: "搜索" } },
  { href: "/dang-tin",    icon: PlusCircle, label: { vi: "Đăng tin",  en: "Post",   zh: "发布" }, accent: true },
  { href: "/ban-do",      icon: MapPin,     label: { vi: "Bản đồ",    en: "Map",    zh: "地图" } },
  { href: "/tai-khoan",   icon: User,       label: { vi: "Tài khoản", en: "Account",zh: "账号" } },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { locale } = useLocale();

  // Hide on admin pages and map (map has its own full-screen layout)
  if (pathname.startsWith("/admin") || pathname === "/ban-do") return null;

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex items-stretch h-14">
        {NAV.map(item => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const label = item.label[locale as keyof typeof item.label] ?? item.label.vi;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors
                ${item.accent
                  ? "text-white"
                  : isActive
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
            >
              {item.accent ? (
                <span className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg -mt-4">
                  <Icon className="w-5 h-5 text-white" />
                </span>
              ) : (
                <Icon className={`w-5 h-5 ${isActive ? "text-red-600" : "text-gray-400"}`} />
              )}
              <span className={item.accent ? "text-gray-500 mt-0.5" : ""}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
