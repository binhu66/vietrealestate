"use client";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { ZALO_PHONE, HOTLINE, COMPANY_EMAIL } from "@/lib/config";

const FOOTER_T = {
  vi: {
    forSale: "Mua bán", apartment: "Căn hộ chung cư", house: "Nhà riêng", villa: "Biệt thự", land: "Đất nền", commercial: "Bất động sản thương mại",
    forRent: "Cho thuê", aptRent: "Căn hộ cho thuê", houseRent: "Nhà cho thuê", office: "Văn phòng", retail: "Mặt bằng",
    explore: "Khám phá", searchMap: "Tìm trên bản đồ", finance: "💰 Tính vay & lợi suất", brokers: "Môi giới uy tín", news: "Tin tức thị trường",
    postListing: "Đăng tin", postFree: "+ Đăng tin miễn phí",
    license: "Chứng nhận ĐKKD: 0316012345", licenseDate: "Cấp 01/01/2026 tại TP.HCM",
    madeIn: "🇻🇳 Made in Vietnam · Powered by Cloudflare & Supabase",
  },
  en: {
    forSale: "For Sale", apartment: "Apartments", house: "Houses", villa: "Villas", land: "Land plots", commercial: "Commercial real estate",
    forRent: "For Rent", aptRent: "Apartments for rent", houseRent: "Houses for rent", office: "Offices", retail: "Retail space",
    explore: "Explore", searchMap: "Search by map", finance: "💰 Mortgage & ROI", brokers: "Trusted brokers", news: "Market news",
    postListing: "Post Listing", postFree: "+ Post for free",
    license: "Business license: 0316012345", licenseDate: "Issued 01/01/2026 in HCMC",
    madeIn: "🇻🇳 Made in Vietnam · Powered by Cloudflare & Supabase",
  },
  zh: {
    forSale: "出售", apartment: "公寓", house: "独栋住宅", villa: "别墅", land: "地块", commercial: "商业地产",
    forRent: "出租", aptRent: "公寓出租", houseRent: "独栋出租", office: "办公室", retail: "商铺",
    explore: "探索", searchMap: "地图搜索", finance: "💰 按揭与回报率", brokers: "可信经纪人", news: "市场资讯",
    postListing: "发布房源", postFree: "+ 免费发布",
    license: "营业执照：0316012345", licenseDate: "2026年01月01日颁发于胡志明市",
    madeIn: "🇻🇳 越南制造 · 由 Cloudflare 与 Supabase 提供支持",
  },
};

export default function Footer() {
  const { locale } = useLocale();
  const t = getT(locale);
  const f = FOOTER_T[locale];

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
              <p>📞 Hotline: <a href={`tel:${HOTLINE.replace(/\s/g, "")}`} className="text-white hover:text-red-400">{HOTLINE}</a></p>
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
              <p>✉️ <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-red-400">{COMPANY_EMAIL}</a></p>
            </div>
          </div>

          {/* For sale */}
          <div>
            <h4 className="text-white font-semibold mb-3">{f.forSale}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/bat-dong-san?category=can-ho-chung-cu" className="hover:text-red-400 transition-colors">{f.apartment}</Link></li>
              <li><Link href="/bat-dong-san?category=nha-rieng"       className="hover:text-red-400 transition-colors">{f.house}</Link></li>
              <li><Link href="/bat-dong-san?category=nha-biet-thu"    className="hover:text-red-400 transition-colors">{f.villa}</Link></li>
              <li><Link href="/bat-dong-san?category=dat-nen"         className="hover:text-red-400 transition-colors">{f.land}</Link></li>
              <li><Link href="/thuong-mai"                            className="hover:text-red-400 transition-colors">{f.commercial}</Link></li>
            </ul>
          </div>

          {/* For rent + Explore */}
          <div>
            <h4 className="text-white font-semibold mb-3">{f.forRent}</h4>
            <ul className="space-y-2 text-sm mb-5">
              <li><Link href="/cho-thue?category=can-ho-chung-cu" className="hover:text-red-400 transition-colors">{f.aptRent}</Link></li>
              <li><Link href="/cho-thue?category=nha-rieng"       className="hover:text-red-400 transition-colors">{f.houseRent}</Link></li>
              <li><Link href="/cho-thue?category=van-phong"       className="hover:text-red-400 transition-colors">{f.office}</Link></li>
              <li><Link href="/cho-thue?category=mat-bang"        className="hover:text-red-400 transition-colors">{f.retail}</Link></li>
            </ul>
            <h4 className="text-white font-semibold mb-3">{f.explore}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ban-do"    className="hover:text-red-400 transition-colors">{f.searchMap}</Link></li>
              <li><Link href="/tai-chinh" className="hover:text-red-400 transition-colors">{f.finance}</Link></li>
              <li><Link href="/moi-gioi" className="hover:text-red-400 transition-colors">{f.brokers}</Link></li>
              <li><Link href="/tin-tuc"  className="hover:text-red-400 transition-colors">{f.news}</Link></li>
            </ul>
          </div>

          {/* Company + post listing */}
          <div>
            <h4 className="text-white font-semibold mb-3">{f.postListing}</h4>
            <Link
              href="/dang-tin"
              className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors mb-5"
            >
              {f.postFree}
            </Link>
            <h4 className="text-white font-semibold mb-3">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/gioi-thieu"          className="hover:text-red-400 transition-colors">{t.footer.about}</Link></li>
              <li><a   href={`mailto:${COMPANY_EMAIL}`} className="hover:text-red-400 transition-colors">{t.footer.contact}</a></li>
              <li><Link href="/dieu-khoan"          className="hover:text-red-400 transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="/chinh-sach-bao-mat"  className="hover:text-red-400 transition-colors">{t.footer.privacy}</Link></li>
            </ul>
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">{f.license}</p>
              <p className="text-xs text-gray-400 mt-1">{f.licenseDate}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>{t.footer.copyright}</p>
          <p>{f.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
