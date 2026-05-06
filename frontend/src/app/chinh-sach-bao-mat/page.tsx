"use client";
import Link from "next/link";
import { useLocale } from "@/lib/locale";

const LAST_UPDATED = "01/05/2026";

type Section = {
  heading: string;
  intro?: string;
  items?: Array<{ label?: string; text: string }>;
  outro?: string;
};

type T = {
  back: string;
  title: string;
  updated: string;
  contactBlock: { email: string; hotline: string; address: string };
  sections: Section[];
  cta: { home: string; signup: string };
};

const PRIVACY_T: Record<"vi" | "en" | "zh", T> = {
  vi: {
    back: "← Trang chủ",
    title: "Chính sách bảo mật",
    updated: "Cập nhật lần cuối",
    contactBlock: {
      email: "Email",
      hotline: "Hotline",
      address: "Địa chỉ: TP. Hồ Chí Minh, Việt Nam",
    },
    cta: { home: "Về trang chủ", signup: "Đăng ký tài khoản" },
    sections: [
      {
        heading: "1. Giới thiệu",
        intro:
          "VietRealty (vietrealty.vn) cam kết bảo vệ quyền riêng tư của người dùng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân khi bạn sử dụng nền tảng và ứng dụng di động của chúng tôi.",
      },
      {
        heading: "2. Thông tin chúng tôi thu thập",
        items: [
          { label: "Thông tin tài khoản", text: "Tên, địa chỉ email, số điện thoại khi đăng ký." },
          { label: "Thông tin đăng tin", text: "Địa chỉ, giá, mô tả, hình ảnh bất động sản bạn đăng tải." },
          { label: "Dữ liệu sử dụng", text: "Trang bạn xem, tìm kiếm, thao tác trong ứng dụng." },
          { label: "Vị trí", text: "Chỉ khi bạn cho phép, dùng để hiển thị bất động sản gần bạn." },
          { label: "Thiết bị", text: "Loại thiết bị, hệ điều hành, phiên bản ứng dụng." },
        ],
      },
      {
        heading: "3. Mục đích sử dụng thông tin",
        items: [
          { text: "Cung cấp và cải thiện dịch vụ tìm kiếm, đăng tin bất động sản." },
          { text: "Gửi thông báo về tin đăng phù hợp với nhu cầu của bạn." },
          { text: "Xác thực danh tính và bảo mật tài khoản." },
          { text: "Phân tích xu hướng thị trường bất động sản (dữ liệu ẩn danh)." },
          { text: "Liên lạc hỗ trợ khi bạn cần." },
        ],
      },
      {
        heading: "4. Chia sẻ thông tin",
        intro:
          "Chúng tôi không bán thông tin cá nhân của bạn cho bên thứ ba. Thông tin liên hệ (tên, số điện thoại) trong tin đăng bất động sản sẽ hiển thị công khai theo yêu cầu của bạn. Chúng tôi có thể chia sẻ dữ liệu ẩn danh với đối tác phân tích.",
        items: [
          { text: "Supabase (lưu trữ dữ liệu, xác thực) — tuân thủ GDPR." },
          { text: "Cloudflare (CDN, bảo mật mạng) — tuân thủ GDPR." },
          { text: "Mapbox (bản đồ) — chỉ nhận dữ liệu vị trí ẩn danh." },
          { text: "Google (đăng nhập OAuth) — theo chính sách Google." },
        ],
        outro: "Các đối tác dịch vụ:",
      },
      {
        heading: "5. Quyền của bạn",
        items: [
          { label: "Truy cập", text: "Xem dữ liệu cá nhân trong mục \"Tài khoản\"." },
          { label: "Chỉnh sửa", text: "Cập nhật thông tin hồ sơ bất kỳ lúc nào." },
          { label: "Xóa", text: "Yêu cầu xóa tài khoản qua email info@vietrealty.vn." },
          { label: "Từ chối", text: "Tắt thông báo push trong cài đặt thiết bị." },
          { label: "Vị trí", text: "Từ chối cấp quyền vị trí mà vẫn dùng được ứng dụng." },
        ],
      },
      {
        heading: "6. Bảo mật dữ liệu",
        intro:
          "Dữ liệu được mã hóa TLS/HTTPS khi truyền tải. Mật khẩu được băm (không lưu plaintext). Chúng tôi áp dụng Row Level Security (RLS) để mỗi người dùng chỉ truy cập dữ liệu của mình. Không ai trong đội ngũ có thể xem mật khẩu của bạn.",
      },
      {
        heading: "7. Cookie và theo dõi",
        intro:
          "Chúng tôi dùng cookie để duy trì phiên đăng nhập và ghi nhớ ngôn ngữ của bạn. Không dùng cookie quảng cáo bên thứ ba. Bạn có thể xóa cookie trong cài đặt trình duyệt.",
      },
      {
        heading: "8. Quyền riêng tư trẻ em",
        intro:
          "Dịch vụ không dành cho người dưới 18 tuổi. Chúng tôi không cố ý thu thập thông tin của trẻ em. Nếu phát hiện, vui lòng liên hệ ngay để xóa.",
      },
      {
        heading: "9. Thay đổi chính sách",
        intro:
          "Khi chính sách thay đổi, chúng tôi sẽ cập nhật ngày và thông báo qua email hoặc thông báo trong ứng dụng. Tiếp tục sử dụng đồng nghĩa với việc chấp nhận chính sách mới.",
      },
      {
        heading: "10. Liên hệ",
        intro: "Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ:",
      },
    ],
  },
  en: {
    back: "← Home",
    title: "Privacy Policy",
    updated: "Last updated",
    contactBlock: {
      email: "Email",
      hotline: "Hotline",
      address: "Address: Ho Chi Minh City, Vietnam",
    },
    cta: { home: "Back to home", signup: "Create an account" },
    sections: [
      {
        heading: "1. Introduction",
        intro:
          "VietRealty (vietrealty.vn) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard personal information when you use our website and mobile app.",
      },
      {
        heading: "2. Information we collect",
        items: [
          { label: "Account info", text: "Name, email address, and phone number provided at signup." },
          { label: "Listing info", text: "Address, price, description, and photos of properties you publish." },
          { label: "Usage data", text: "Pages viewed, searches run, and interactions inside the app." },
          { label: "Location", text: "Only with your permission, used to surface properties near you." },
          { label: "Device", text: "Device type, operating system, and app version." },
        ],
      },
      {
        heading: "3. How we use information",
        items: [
          { text: "Operate and improve property search and listing services." },
          { text: "Send notifications about listings that match your interests." },
          { text: "Verify identity and keep your account secure." },
          { text: "Analyze real estate market trends using anonymized data." },
          { text: "Provide customer support when you need help." },
        ],
      },
      {
        heading: "4. How we share information",
        intro:
          "We do not sell your personal data to third parties. Contact details (name, phone) inside a property listing are published publicly at your request. We may share anonymized data with analytics partners.",
        items: [
          { text: "Supabase (data storage, authentication) — GDPR compliant." },
          { text: "Cloudflare (CDN, network security) — GDPR compliant." },
          { text: "Mapbox (maps) — receives anonymized location data only." },
          { text: "Google (OAuth sign-in) — subject to Google's policies." },
        ],
        outro: "Service partners:",
      },
      {
        heading: "5. Your rights",
        items: [
          { label: "Access", text: "View your personal data under \"Account\"." },
          { label: "Edit", text: "Update your profile at any time." },
          { label: "Delete", text: "Request account deletion by emailing info@vietrealty.vn." },
          { label: "Opt out", text: "Disable push notifications in your device settings." },
          { label: "Location", text: "Decline location permission and still use the app." },
        ],
      },
      {
        heading: "6. Data security",
        intro:
          "Data is encrypted in transit via TLS/HTTPS. Passwords are hashed (never stored in plaintext). We enforce Row Level Security (RLS) so each user can only access their own data. Nobody on the team can see your password.",
      },
      {
        heading: "7. Cookies and tracking",
        intro:
          "We use cookies to keep you signed in and remember your language preference. We do not use third-party advertising cookies. You can clear cookies from your browser settings at any time.",
      },
      {
        heading: "8. Children's privacy",
        intro:
          "The service is not intended for anyone under 18. We do not knowingly collect information from minors. If you discover that we have, please contact us so we can remove it.",
      },
      {
        heading: "9. Policy changes",
        intro:
          "When this policy changes, we will update the date above and notify you by email or via an in-app message. Continued use of the service means you accept the updated policy.",
      },
      {
        heading: "10. Contact",
        intro: "For any privacy questions, please reach out:",
      },
    ],
  },
  zh: {
    back: "← 返回首页",
    title: "隐私政策",
    updated: "最近更新",
    contactBlock: {
      email: "邮箱",
      hotline: "服务热线",
      address: "地址：越南胡志明市",
    },
    cta: { home: "返回首页", signup: "注册账号" },
    sections: [
      {
        heading: "1. 简介",
        intro:
          "VietRealty（vietrealty.vn）致力于保护用户隐私。本政策说明在您使用我们的网站和移动应用时，我们如何收集、使用和保护您的个人信息。",
      },
      {
        heading: "2. 我们收集的信息",
        items: [
          { label: "账户信息", text: "注册时提供的姓名、邮箱地址和电话号码。" },
          { label: "房源信息", text: "您发布的房源地址、价格、描述与图片。" },
          { label: "使用数据", text: "您查看的页面、搜索内容以及在应用中的操作。" },
          { label: "位置", text: "仅在您授权后使用，用于显示您附近的房源。" },
          { label: "设备", text: "设备类型、操作系统和应用版本。" },
        ],
      },
      {
        heading: "3. 信息使用目的",
        items: [
          { text: "提供并改进房源搜索与发布服务。" },
          { text: "推送与您需求匹配的房源通知。" },
          { text: "验证身份并保护您的账户安全。" },
          { text: "基于匿名数据分析房地产市场趋势。" },
          { text: "在您需要时提供客户支持。" },
        ],
      },
      {
        heading: "4. 信息共享",
        intro:
          "我们绝不向第三方出售您的个人信息。房源中按您的要求公开的联系方式（姓名、电话）将公开显示。我们可能与分析合作伙伴共享匿名数据。",
        items: [
          { text: "Supabase（数据存储与身份验证）——符合 GDPR。" },
          { text: "Cloudflare（CDN 与网络安全）——符合 GDPR。" },
          { text: "Mapbox（地图服务）——仅接收匿名位置数据。" },
          { text: "Google（OAuth 登录）——遵循 Google 政策。" },
        ],
        outro: "服务合作伙伴：",
      },
      {
        heading: "5. 您的权利",
        items: [
          { label: "查看", text: "在\"账户\"中查看您的个人数据。" },
          { label: "编辑", text: "随时更新您的个人资料。" },
          { label: "删除", text: "通过 info@vietrealty.vn 申请注销账户。" },
          { label: "拒绝", text: "在设备设置中关闭推送通知。" },
          { label: "位置", text: "拒绝位置权限后仍可正常使用应用。" },
        ],
      },
      {
        heading: "6. 数据安全",
        intro:
          "传输过程中使用 TLS/HTTPS 加密。密码经过哈希处理（不保存明文）。我们启用行级安全（RLS），确保每位用户只能访问自己的数据。团队成员无法查看您的密码。",
      },
      {
        heading: "7. Cookie 与追踪",
        intro:
          "我们使用 Cookie 保持登录状态并记忆语言偏好。不使用第三方广告 Cookie。您可随时在浏览器设置中清除 Cookie。",
      },
      {
        heading: "8. 未成年人隐私",
        intro:
          "本服务不面向 18 岁以下用户。我们不会有意收集未成年人的信息。如发现此类情况，请立即联系我们删除。",
      },
      {
        heading: "9. 政策变更",
        intro:
          "当政策发生变化时，我们将更新上方的日期，并通过邮件或应用内通知告知您。继续使用即表示您接受更新后的政策。",
      },
      {
        heading: "10. 联系我们",
        intro: "如对隐私有任何疑问，请联系我们：",
      },
    ],
  },
};

export default function ChinhSachBaoMatPage() {
  const { locale } = useLocale();
  const L = PRIVACY_T[locale];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-red-600 text-sm hover:underline">{L.back}</Link>
        <h1 className="text-3xl font-black text-gray-900 mt-4 mb-2">{L.title}</h1>
        <p className="text-gray-500 text-sm">{L.updated}: {LAST_UPDATED}</p>
      </div>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 text-sm leading-relaxed">
        {L.sections.map((s, i) => {
          const isContact = i === L.sections.length - 1;
          return (
            <section key={i}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{s.heading}</h2>
              {s.intro && <p>{s.intro}</p>}
              {s.outro && <p className="mt-2">{s.outro}</p>}
              {s.items && (
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  {s.items.map((it, j) => (
                    <li key={j}>
                      {it.label && <strong>{it.label}: </strong>}
                      {it.text}
                    </li>
                  ))}
                </ul>
              )}
              {isContact && (
                <p className="mt-2">
                  📧 {L.contactBlock.email}: <a href="mailto:info@vietrealty.vn" className="text-red-600 hover:underline">info@vietrealty.vn</a><br />
                  📞 {L.contactBlock.hotline}: <a href="tel:18006834" className="text-red-600 hover:underline">1800 6834</a><br />
                  {L.contactBlock.address}
                </p>
              )}
            </section>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
        <Link href="/" className="text-center text-sm bg-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">
          {L.cta.home}
        </Link>
        <Link href="/dang-ky" className="text-center text-sm border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
          {L.cta.signup}
        </Link>
      </div>
    </div>
  );
}
