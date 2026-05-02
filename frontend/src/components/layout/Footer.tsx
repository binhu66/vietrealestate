"use client";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

export default function Footer() {
  const { locale } = useLocale();
  const t = getT(locale);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">VR</span>
              </div>
              <span className="font-black text-white text-lg">VietRealty</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t.footer.desc}</p>
            <div className="flex gap-3 mt-4">
              {["f", "in", "yt"].map((s) => (
                <div key={s} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs hover:bg-red-600 cursor-pointer transition-colors">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Mua bán */}
          <div>
            <h4 className="text-white font-semibold mb-3">Mua bán</h4>
            <ul className="space-y-2 text-sm">
              {["Căn hộ chung cư", "Nhà riêng", "Biệt thự", "Đất nền", "Nhà mặt tiền"].map((item) => (
                <li key={item}>
                  <Link href="/bat-dong-san" className="hover:text-red-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cho thuê */}
          <div>
            <h4 className="text-white font-semibold mb-3">Cho thuê</h4>
            <ul className="space-y-2 text-sm">
              {["Căn hộ cho thuê", "Nhà cho thuê", "Văn phòng", "Mặt bằng", "Kho xưởng"].map((item) => (
                <li key={item}>
                  <Link href="/cho-thue" className="hover:text-red-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3">Công ty</h4>
            <ul className="space-y-2 text-sm">
              {[t.footer.about, t.footer.contact, t.footer.terms, t.footer.privacy].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-red-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Chứng nhận ĐKKD số: 0316012345</p>
              <p className="text-xs text-gray-400 mt-1">Cấp ngày 01/01/2026 tại TP.HCM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>{t.footer.copyright}</p>
          <p>🇻🇳 Made in Vietnam</p>
        </div>
      </div>
    </footer>
  );
}
