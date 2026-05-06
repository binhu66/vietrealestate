"use client";
import { useLocale } from "@/lib/locale";

const ABOUT_T = {
  vi: {
    title: "Giới thiệu về VietRealty",
    subtitle: "Sàn giao dịch bất động sản hàng đầu Việt Nam",
    missionTitle: "Sứ mệnh của chúng tôi",
    missionBody:
      "VietRealty được thành lập với sứ mệnh đơn giản nhưng mạnh mẽ: giúp mọi người Việt Nam dễ dàng tìm được ngôi nhà mơ ước của mình. Chúng tôi kết nối người mua, người bán và các chuyên gia môi giới uy tín trên toàn quốc thông qua nền tảng công nghệ hiện đại.",
    whyTitle: "Tại sao chọn VietRealty?",
    why: [
      { icon: "🏠", title: "125,000+ Tin đăng", desc: "Cơ sở dữ liệu bất động sản lớn nhất Việt Nam" },
      { icon: "✅", title: "Xác minh uy tín", desc: "Mọi tin đăng và môi giới đều được kiểm duyệt" },
      { icon: "🗺️", title: "Tìm kiếm trên bản đồ", desc: "Công nghệ GIS tiên tiến hỗ trợ tìm nhà theo vị trí" },
    ],
    servicesTitle: "Các dịch vụ của chúng tôi",
    services: [
      "Mua bán nhà đất, căn hộ, biệt thự trên toàn quốc",
      "Cho thuê nhà ở và bất động sản thương mại",
      "Kết nối với mạng lưới môi giới uy tín",
      "Công cụ tài chính: tính vay mua nhà, lợi suất đầu tư",
      "Tin tức và phân tích thị trường bất động sản",
      "Tìm kiếm bất động sản trên bản đồ tương tác",
    ],
    contactTitle: "Liên hệ",
    hotlineLabel: "Hotline:",
    hotlineHours: "(miễn phí, 8:00–21:00)",
    emailLabel: "Email:",
    addressLabel: "Địa chỉ:",
    addressValue: "TP. Hồ Chí Minh, Việt Nam",
  },
  en: {
    title: "About VietRealty",
    subtitle: "Vietnam's leading real estate marketplace",
    missionTitle: "Our mission",
    missionBody:
      "VietRealty was founded with a simple but powerful mission: to help every Vietnamese family find the home of their dreams. We connect buyers, sellers, and trusted real estate professionals across the country through a modern technology platform.",
    whyTitle: "Why choose VietRealty?",
    why: [
      { icon: "🏠", title: "125,000+ listings", desc: "The largest real estate database in Vietnam" },
      { icon: "✅", title: "Verified for trust", desc: "Every listing and agent is reviewed and verified" },
      { icon: "🗺️", title: "Map-based search", desc: "Advanced GIS technology to find homes by location" },
    ],
    servicesTitle: "Our services",
    services: [
      "Buying and selling houses, apartments, and villas nationwide",
      "Residential and commercial property rentals",
      "Access to a network of trusted agents",
      "Finance tools: mortgage calculator, investment yield",
      "Real estate news and market analysis",
      "Interactive map-based property search",
    ],
    contactTitle: "Contact",
    hotlineLabel: "Hotline:",
    hotlineHours: "(toll-free, 8:00 AM – 9:00 PM)",
    emailLabel: "Email:",
    addressLabel: "Address:",
    addressValue: "Ho Chi Minh City, Vietnam",
  },
  zh: {
    title: "关于 VietRealty",
    subtitle: "越南领先的房地产交易平台",
    missionTitle: "我们的使命",
    missionBody:
      "VietRealty 的使命简单而有力：让每一位越南人都能轻松找到心仪的家。我们通过现代化的技术平台，连接全国的买家、卖家和值得信赖的房产经纪人。",
    whyTitle: "为什么选择 VietRealty？",
    why: [
      { icon: "🏠", title: "125,000+ 房源", desc: "越南最大的房地产数据库" },
      { icon: "✅", title: "信誉认证", desc: "所有房源和经纪人均经审核" },
      { icon: "🗺️", title: "地图找房", desc: "先进 GIS 技术，按位置精准搜索" },
    ],
    servicesTitle: "我们的服务",
    services: [
      "全国范围房屋、公寓、别墅买卖",
      "住宅与商业地产租赁",
      "对接可靠的经纪人网络",
      "金融工具：房贷计算、投资收益",
      "房地产资讯与市场分析",
      "互动地图房源搜索",
    ],
    contactTitle: "联系我们",
    hotlineLabel: "热线：",
    hotlineHours: "（免费，8:00–21:00）",
    emailLabel: "邮箱：",
    addressLabel: "地址：",
    addressValue: "越南胡志明市",
  },
};

export default function GioiThieuPage() {
  const { locale } = useLocale();
  const L = ABOUT_T[locale];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-3">{L.title}</h1>
      <p className="text-gray-500 mb-10">{L.subtitle}</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">{L.missionTitle}</h2>
          <p className="text-gray-600 leading-relaxed">{L.missionBody}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">{L.whyTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {L.why.map(item => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">{L.servicesTitle}</h2>
          <ul className="space-y-2 text-gray-600">
            {L.services.map(s => (
              <li key={s} className="flex items-start gap-2"><span className="text-red-500 mt-1">•</span>{s}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">{L.contactTitle}</h2>
          <div className="bg-red-50 rounded-xl p-5 border border-red-100">
            <p className="text-gray-700 mb-1">📞 {L.hotlineLabel} <strong>1800 6834</strong> {L.hotlineHours}</p>
            <p className="text-gray-700 mb-1">✉️ {L.emailLabel} <a href="mailto:info@vietrealty.vn" className="text-red-600 hover:underline">info@vietrealty.vn</a></p>
            <p className="text-gray-700">📍 {L.addressLabel} {L.addressValue}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
