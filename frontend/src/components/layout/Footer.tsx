"use client";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

const ZALO_PHONE = "0901234567";

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
            <div className="mt-4 space-y-2 text-sm text-gray-400">
              <p>📞 Hotline: <a href="tel:18006834" className="text-white hover:text-red-400">1800 6834</a></p>
              <p>
                💬 Zalo:{" "}
                <a
                  href={`https://zalo.me/${ZALO_PHONE.replace(/^0/, "84")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0068FF] hover:text-blue-400"
                >
                  {ZALO_PHONE}
                </a>
              </p>
              <p>✉️ <a href="mailto:info@vietrealty.vn" className="hover:text-red-400">info@vietrealty.vn</a></p>
            </div>
          </div>

          {/* Mua bán */}
          <div>
            <h4 className="text-white font-semibold mb-3">Mua bán</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/bat-dong-san?category=can-ho-chung-cu" className="hover:text-red-400 transition-colors">Căn hộ chung cư</Link></li>
              <li><Link href="/bat-dong-san?category=nha-rieng"       className="hover:text-red-400 transition-colors">Nhà riêng</Link></li>
              <li><Link href="/bat-dong-san?category=nha-biet-thu"    className="hover:text-red-400 transition-colors">Biệt thự</Link></li>
              <li><Link href="/bat-dong-san?category=dat-nen"         className="hover:text-red-400 transition-colors">Đất nền</Link></li>
              <li><Link href="/thuong-mai"                            className="hover:text-red-400 transition-colors">Bất động sản thương mại</Link></li>
            </ul>
          </div>

          {/* Cho thuê + Môi giới */}
          <div>
            <h4 className="text-white font-semibold mb-3">Cho thuê</h4>
            <ul className="space-y-2 text-sm mb-5">
              <li><Link href="/cho-thue?category=can-ho-chung-cu" className="hover:text-red-400 transition-colors">Căn hộ cho thuê</Link></li>
              <li><Link href="/cho-thue?category=nha-rieng"       className="hover:text-red-400 transition-colors">Nhà cho thuê</Link></li>
              <li><Link href="/cho-thue?category=van-phong"       className="hover:text-red-400 transition-colors">Văn phòng</Link></li>
              <li><Link href="/cho-thue?category=mat-bang"        className="hover:text-red-400 transition-colors">Mặt bằng</Link></li>
            </ul>
            <h4 className="text-white font-semibold mb-3">Khám phá</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ban-do"    className="hover:text-red-400 transition-colors">Tìm trên bản đồ</Link></li>
              <li><Link href="/moi-gioi" className="hover:text-red-400 transition-colors">Môi giới uy tín</Link></li>
              <li><Link href="/tin-tuc"  className="hover:text-red-400 transition-colors">Tin tức thị trường</Link></li>
            </ul>
          </div>

          {/* Company + post listing */}
          <div>
            <h4 className="text-white font-semibold mb-3">Đăng tin</h4>
            <Link
              href="/dang-tin"
              className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors mb-5"
            >
              + Đăng tin miễn phí
            </Link>
            <h4 className="text-white font-semibold mb-3">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-red-400 transition-colors">{t.footer.about}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition-colors">{t.footer.contact}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="#" className="hover:text-red-400 transition-colors">{t.footer.privacy}</Link></li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">Chứng nhận ĐKKD: 0316012345</p>
              <p className="text-xs text-gray-400 mt-1">Cấp 01/01/2026 tại TP.HCM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>{t.footer.copyright}</p>
          <p>🇻🇳 Made in Vietnam · Powered by Cloudflare & Supabase</p>
        </div>
      </div>
    </footer>
  );
}
