"use client";
import Link from "next/link";
import { Calendar, User, Tag, ChevronRight, TrendingUp, Home, Building2, MapPin } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

interface Article {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  titleZh: string;
  excerpt: string;
  excerptEn: string;
  excerptZh: string;
  category: string;
  categoryEn: string;
  categoryZh: string;
  author: string;
  date: string;
  readMin: number;
  image: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    id: "1",
    slug: "thi-truong-bds-tphcm-q1-2026",
    title: "Thị trường BĐS TP.HCM Q1/2026: Phân khúc căn hộ phục hồi mạnh, giao dịch tăng 35%",
    titleEn: "HCMC Real Estate Q1/2026: Apartment Segment Rebounds Strongly, Transactions Up 35%",
    titleZh: "胡志明市2026年第一季度房地产：公寓市场强劲复苏，交易量增长35%",
    excerpt: "Theo báo cáo từ CBRE Việt Nam, phân khúc căn hộ tại TP.HCM ghi nhận lượng giao dịch tăng 35% trong Q1/2026 so với cùng kỳ năm ngoái. Lãi suất hạ nhiệt và nguồn cung mới từ các dự án lớn đã thúc đẩy thị trường.",
    excerptEn: "According to CBRE Vietnam, the HCMC apartment segment saw a 35% increase in transactions in Q1/2026 compared to the same period last year, driven by lower interest rates and new supply from major projects.",
    excerptZh: "据CBRE越南报告，2026年第一季度胡志明市公寓交易量同比增长35%，受益于利率下降和主要项目新供应的推动。",
    category: "Thị trường",
    categoryEn: "Market",
    categoryZh: "市场",
    author: "Nguyễn Minh Tuấn",
    date: "2026-04-28",
    readMin: 5,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
    featured: true,
  },
  {
    id: "2",
    slug: "nghi-dinh-mua-nha-nguoi-nuoc-ngoai-2026",
    title: "Nghị định mới mở rộng quyền mua nhà cho người nước ngoài tại Việt Nam",
    titleEn: "New Decree Expands Property Rights for Foreigners in Vietnam",
    titleZh: "新法令扩大外国人在越南的购房权利",
    excerpt: "Chính phủ Việt Nam vừa ban hành nghị định cho phép người nước ngoài sở hữu căn hộ tại Việt Nam lên đến 70 năm, tăng từ mức 50 năm trước đó. Người mua cũng được phép gia hạn thêm một lần nữa.",
    excerptEn: "The Vietnamese government has issued a new decree allowing foreigners to own apartments in Vietnam for up to 70 years, increased from the previous 50-year limit, with an option for one renewal.",
    excerptZh: "越南政府新发布法令，允许外国人持有越南公寓产权最长70年，从此前的50年提高，并可续期一次。",
    category: "Pháp lý",
    categoryEn: "Legal",
    categoryZh: "法规",
    author: "Trần Thu Hà",
    date: "2026-04-22",
    readMin: 4,
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    featured: true,
  },
  {
    id: "3",
    slug: "dat-nen-ngoai-thanh-ha-noi-2026",
    title: "Đất nền ngoại thành Hà Nội: Cơ hội đầu tư cuối 2026 hay bẫy thanh khoản?",
    titleEn: "Hanoi Suburban Land: Investment Opportunity in Late 2026 or Liquidity Trap?",
    titleZh: "河内郊区土地：2026年末投资机会还是流动性陷阱？",
    excerpt: "Giá đất nền tại các huyện ngoại thành Hà Nội như Mê Linh, Sóc Sơn, Hoài Đức đang có dấu hiệu phục hồi nhờ hạ tầng giao thông được đầu tư mạnh. Tuy nhiên, chuyên gia cảnh báo về thanh khoản thấp.",
    excerptEn: "Land prices in Hanoi's suburban districts like Me Linh, Soc Son, and Hoai Duc are showing recovery signs as infrastructure improves. However, experts warn of low liquidity risks.",
    excerptZh: "随着交通基础设施改善，河内美灵、朔山等郊区地价出现回暖迹象，但专家警告流动性风险较低。",
    category: "Đầu tư",
    categoryEn: "Investment",
    categoryZh: "投资",
    author: "Lê Quang Hào",
    date: "2026-04-19",
    readMin: 6,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    featured: false,
  },
  {
    id: "4",
    slug: "van-phong-cho-thue-quan-1-hcm",
    title: "Văn phòng hạng A quận 1 TP.HCM: Tỷ lệ lấp đầy đạt 92%, giá thuê tăng nhẹ",
    titleEn: "Grade A Offices in District 1 HCMC: 92% Occupancy, Rental Rates Edge Up",
    titleZh: "胡志明市第一区A级写字楼：入住率达92%，租金小幅上涨",
    excerpt: "Thị trường văn phòng hạng A tại trung tâm TP.HCM tiếp tục ổn định với tỷ lệ lấp đầy ở mức cao 92%. Giá thuê trung bình đạt 45-55 USD/m²/tháng, tăng nhẹ 3-5% so với năm trước.",
    excerptEn: "The Grade A office market in central HCMC remains stable with a high 92% occupancy rate. Average rental prices reach $45-55/sqm/month, up 3-5% year-on-year.",
    excerptZh: "胡志明市中心A级写字楼市场保持稳定，入住率高达92%，平均租金为45-55美元/平方米/月，同比上涨3-5%。",
    category: "Thương mại",
    categoryEn: "Commercial",
    categoryZh: "商业",
    author: "Phạm Hương Giang",
    date: "2026-04-15",
    readMin: 3,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    featured: false,
  },
  {
    id: "5",
    slug: "phu-my-hung-q7-bien-dong-gia",
    title: "Biệt thự Phú Mỹ Hưng quận 7: Giá neo cao, giao dịch chậm nhưng sóng mới đang đến",
    titleEn: "Phu My Hung District 7 Villas: Prices Stay High, Slow Transactions but New Wave Coming",
    titleZh: "第七区富美兴别墅：价格坚挺，交易缓慢但新一波行情即将到来",
    excerpt: "Phân khúc biệt thự tại Phú Mỹ Hưng vẫn neo giá cao từ 25-45 tỷ đồng/căn. Giao dịch chậm nhưng theo nhiều chuyên gia, sóng cơ sở hạ tầng mới sắp hoàn thiện sẽ thúc đẩy giá trong cuối năm.",
    excerptEn: "Phu My Hung villas remain priced at 25-45 billion VND per unit. While transactions are slow, experts believe upcoming infrastructure completions will drive prices up by year-end.",
    excerptZh: "富美兴别墅价格坚挺在250-450亿越南盾区间。交易虽然缓慢，但专家预计年底基础设施完工将推动价格上涨。",
    category: "Thị trường",
    categoryEn: "Market",
    categoryZh: "市场",
    author: "Nguyễn Thanh Phong",
    date: "2026-04-10",
    readMin: 4,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
    featured: false,
  },
  {
    id: "6",
    slug: "kien-thuc-mua-nha-lan-dau",
    title: "Hướng dẫn toàn diện cho người mua nhà lần đầu tại Việt Nam năm 2026",
    titleEn: "Complete Guide for First-Time Home Buyers in Vietnam 2026",
    titleZh: "2026年越南首次购房完全指南",
    excerpt: "Mua nhà lần đầu có thể gây choáng ngợp. Bài viết này tổng hợp từ A đến Z: kiểm tra pháp lý sổ đỏ/hồng, thủ tục vay ngân hàng, phí trước bạ, thuế TNCN và những lưu ý khi ký hợp đồng.",
    excerptEn: "Buying your first home can be overwhelming. This comprehensive guide covers everything from red/pink book legal checks, bank loan procedures, registration fees, personal income tax, and contract signing tips.",
    excerptZh: "首次购房可能令人不知所措。本文从A到Z全面介绍：红书/粉书法律检查、银行贷款手续、过户费、个人所得税及签约注意事项。",
    category: "Kiến thức",
    categoryEn: "Knowledge",
    categoryZh: "知识",
    author: "VietRealty Team",
    date: "2026-04-05",
    readMin: 10,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    featured: false,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Thị trường": "bg-red-50 text-red-700",
  "Market": "bg-red-50 text-red-700",
  "市场": "bg-red-50 text-red-700",
  "Pháp lý": "bg-purple-50 text-purple-700",
  "Legal": "bg-purple-50 text-purple-700",
  "法规": "bg-purple-50 text-purple-700",
  "Đầu tư": "bg-green-50 text-green-700",
  "Investment": "bg-green-50 text-green-700",
  "投资": "bg-green-50 text-green-700",
  "Thương mại": "bg-amber-50 text-amber-700",
  "Commercial": "bg-amber-50 text-amber-700",
  "商业": "bg-amber-50 text-amber-700",
  "Kiến thức": "bg-blue-50 text-blue-700",
  "Knowledge": "bg-blue-50 text-blue-700",
  "知识": "bg-blue-50 text-blue-700",
};

const allCategories = [
  { vi: "Thị trường", en: "Market", zh: "市场" },
  { vi: "Pháp lý", en: "Legal", zh: "法规" },
  { vi: "Đầu tư", en: "Investment", zh: "投资" },
  { vi: "Thương mại", en: "Commercial", zh: "商业" },
  { vi: "Kiến thức", en: "Knowledge", zh: "知识" },
];

function formatDate(d: string, locale: string) {
  const date = new Date(d);
  if (locale === "en") return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  if (locale === "zh") return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
}

export default function TinTucPage() {
  const { locale } = useLocale();

  function articleTitle(a: Article) {
    if (locale === "en") return a.titleEn;
    if (locale === "zh") return a.titleZh;
    return a.title;
  }
  function articleExcerpt(a: Article) {
    if (locale === "en") return a.excerptEn;
    if (locale === "zh") return a.excerptZh;
    return a.excerpt;
  }
  function catLabel(a: Article) {
    if (locale === "en") return a.categoryEn;
    if (locale === "zh") return a.categoryZh;
    return a.category;
  }

  const featured = articles.filter(a => a.featured);
  const rest = articles.filter(a => !a.featured);

  const labels = {
    vi: { heading: "Tin tức & Thị trường", subheading: "Cập nhật mới nhất về bất động sản Việt Nam", readMore: "Đọc thêm", minRead: "phút đọc", all: "Tất cả", latest: "Mới nhất" },
    en: { heading: "News & Market", subheading: "Latest updates on Vietnam real estate", readMore: "Read more", minRead: "min read", all: "All", latest: "Latest" },
    zh: { heading: "新闻与市场", subheading: "越南房地产最新动态", readMore: "阅读更多", minRead: "分钟", all: "全部", latest: "最新" },
  }[locale] ?? {
    heading: "Tin tức & Thị trường", subheading: "Cập nhật mới nhất về bất động sản Việt Nam", readMore: "Đọc thêm", minRead: "phút đọc", all: "Tất cả", latest: "Mới nhất"
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">{labels.heading}</h1>
        <p className="text-gray-500">{labels.subheading}</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: <TrendingUp className="w-5 h-5" />, label: locale === "zh" ? "市场趋势" : locale === "en" ? "Market Trends" : "Xu hướng thị trường", color: "text-red-600 bg-red-50" },
          { icon: <Home className="w-5 h-5" />, label: locale === "zh" ? "购房指南" : locale === "en" ? "Buyer Guides" : "Cẩm nang mua nhà", color: "text-blue-600 bg-blue-50" },
          { icon: <Building2 className="w-5 h-5" />, label: locale === "zh" ? "投资分析" : locale === "en" ? "Investment Analysis" : "Phân tích đầu tư", color: "text-green-600 bg-green-50" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
              {item.icon}
            </div>
            <span className="text-sm font-semibold text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Featured articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {featured.map((a) => (
          <Link
            key={a.id}
            href={`/tin-tuc/${a.slug}`}
            className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={a.image}
                alt={articleTitle(a)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${CATEGORY_COLORS[catLabel(a)] ?? "bg-gray-100 text-gray-700"}`}>
                  {catLabel(a)}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug mb-2 line-clamp-2">
                {articleTitle(a)}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{articleExcerpt(a)}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{a.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.date, locale)}</span>
                </div>
                <span>{a.readMin} {labels.minRead}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Section title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">{labels.latest}</h2>
        <div className="flex gap-2 flex-wrap">
          {allCategories.map(cat => {
            const label = locale === "zh" ? cat.zh : locale === "en" ? cat.en : cat.vi;
            return (
              <span
                key={cat.vi}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-colors ${CATEGORY_COLORS[label] ?? "bg-gray-100 text-gray-600"}`}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Article list */}
      <div className="space-y-4 mb-10">
        {rest.map((a) => (
          <Link
            key={a.id}
            href={`/tin-tuc/${a.slug}`}
            className="group flex gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
          >
            <div className="relative w-28 h-20 shrink-0 overflow-hidden rounded-xl">
              <img
                src={a.image}
                alt={articleTitle(a)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[catLabel(a)] ?? "bg-gray-100 text-gray-700"}`}>
                  {catLabel(a)}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-1">
                {articleTitle(a)}
              </h3>
              <p className="text-xs text-gray-400 line-clamp-1 mb-2">{articleExcerpt(a)}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{a.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.date, locale)}</span>
                <span className="ml-auto flex items-center gap-1 text-red-600 font-medium">
                  {labels.readMore} <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-xl font-black mb-2">
          {locale === "zh" ? "订阅市场快讯" : locale === "en" ? "Subscribe to Market Updates" : "Đăng ký nhận bản tin thị trường"}
        </h3>
        <p className="text-red-100 text-sm mb-6 max-w-md mx-auto">
          {locale === "zh" ? "每周接收越南房产市场最新动态，无垃圾邮件" : locale === "en" ? "Weekly updates on Vietnam real estate market. No spam." : "Nhận cập nhật thị trường BĐS Việt Nam hàng tuần. Không spam."}
        </p>
        <div className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            placeholder={locale === "zh" ? "您的邮箱地址" : locale === "en" ? "Your email address" : "Địa chỉ email của bạn"}
            className="flex-1 px-4 py-2.5 rounded-xl text-gray-900 text-sm focus:outline-none"
          />
          <button className="bg-white text-red-600 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors whitespace-nowrap">
            {locale === "zh" ? "订阅" : locale === "en" ? "Subscribe" : "Đăng ký"}
          </button>
        </div>
      </div>
    </div>
  );
}
