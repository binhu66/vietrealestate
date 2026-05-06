"use client";
import { useLocale } from "@/lib/locale";

const LAST_UPDATED = "01/01/2026";

type Section = {
  heading: string;
  intro?: string;
  items?: string[];
  outro?: string;
};

type T = {
  title: string;
  updated: string;
  sections: Section[];
  contactPrefix: string;
};

const TERMS_T: Record<"vi" | "en" | "zh", T> = {
  vi: {
    title: "Điều khoản sử dụng",
    updated: "Cập nhật lần cuối",
    contactPrefix: "Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ:",
    sections: [
      {
        heading: "1. Chấp nhận điều khoản",
        intro:
          "Bằng cách truy cập và sử dụng VietRealty, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.",
      },
      {
        heading: "2. Quy định đăng tin",
        items: [
          "Thông tin đăng tải phải trung thực, chính xác và không gây nhầm lẫn.",
          "Nghiêm cấm đăng tin giả mạo, lừa đảo hoặc vi phạm pháp luật.",
          "Người đăng tin chịu trách nhiệm về tính hợp pháp của bất động sản.",
          "VietRealty có quyền xóa bất kỳ tin đăng nào vi phạm quy định.",
        ],
      },
      {
        heading: "3. Trách nhiệm của người dùng",
        items: [
          "Bảo mật thông tin tài khoản và không chia sẻ với bên thứ ba.",
          "Không sử dụng dịch vụ cho mục đích phi pháp hoặc gây hại.",
          "Tự chịu trách nhiệm về các giao dịch thực hiện thông qua nền tảng.",
        ],
      },
      {
        heading: "4. Giới hạn trách nhiệm",
        intro:
          "VietRealty là nền tảng kết nối và không chịu trách nhiệm về tính xác thực của thông tin do người dùng cung cấp. Mọi giao dịch bất động sản cần được thực hiện theo đúng quy định pháp luật Việt Nam.",
      },
      {
        heading: "5. Quyền sở hữu trí tuệ",
        intro:
          "Toàn bộ nội dung, thiết kế và tính năng của VietRealty được bảo vệ bởi quyền sở hữu trí tuệ. Nghiêm cấm sao chép, phân phối mà không có sự đồng ý bằng văn bản.",
      },
      {
        heading: "6. Thay đổi điều khoản",
        intro:
          "VietRealty có quyền cập nhật điều khoản này bất cứ lúc nào. Người dùng sẽ được thông báo về các thay đổi quan trọng qua email đã đăng ký.",
      },
      { heading: "7. Liên hệ" },
    ],
  },
  en: {
    title: "Terms of Service",
    updated: "Last updated",
    contactPrefix: "For any questions about these terms, please contact us:",
    sections: [
      {
        heading: "1. Acceptance of terms",
        intro:
          "By accessing or using VietRealty you agree to be bound by these terms and conditions. If you do not agree, please do not use the service.",
      },
      {
        heading: "2. Listing rules",
        items: [
          "All published information must be truthful, accurate, and not misleading.",
          "Fake, fraudulent, or unlawful listings are strictly prohibited.",
          "The poster is responsible for the legal status of the property.",
          "VietRealty reserves the right to remove any listing that violates these rules.",
        ],
      },
      {
        heading: "3. User responsibilities",
        items: [
          "Keep your account credentials secure and do not share them with third parties.",
          "Do not use the service for any unlawful or harmful purpose.",
          "You are solely responsible for transactions you complete through the platform.",
        ],
      },
      {
        heading: "4. Limitation of liability",
        intro:
          "VietRealty is a connection platform and is not responsible for the accuracy of information provided by users. All real estate transactions must comply with Vietnamese law.",
      },
      {
        heading: "5. Intellectual property",
        intro:
          "All content, design, and features of VietRealty are protected by intellectual property law. Copying or redistribution without written consent is prohibited.",
      },
      {
        heading: "6. Changes to these terms",
        intro:
          "VietRealty may update these terms at any time. Users will be notified of material changes via the email address on file.",
      },
      { heading: "7. Contact" },
    ],
  },
  zh: {
    title: "服务条款",
    updated: "最近更新",
    contactPrefix: "如对本条款有任何疑问，请联系我们：",
    sections: [
      {
        heading: "1. 条款的接受",
        intro:
          "访问或使用 VietRealty 即表示您同意接受本条款的约束。如不同意，请勿使用我们的服务。",
      },
      {
        heading: "2. 房源发布规则",
        items: [
          "所发布的信息必须真实、准确，不得误导他人。",
          "严禁发布虚假、欺诈或违法房源。",
          "发布者须对房产的合法性自行负责。",
          "VietRealty 有权删除任何违反规定的房源。",
        ],
      },
      {
        heading: "3. 用户责任",
        items: [
          "妥善保管账户信息，不得与第三方共享。",
          "不得将服务用于任何违法或有害目的。",
          "通过本平台完成的交易由用户自行负责。",
        ],
      },
      {
        heading: "4. 责任限制",
        intro:
          "VietRealty 是连接平台，不对用户提供信息的真实性负责。所有房产交易须遵守越南法律。",
      },
      {
        heading: "5. 知识产权",
        intro:
          "VietRealty 的全部内容、设计与功能均受知识产权法保护。未经书面同意，严禁复制或分发。",
      },
      {
        heading: "6. 条款变更",
        intro:
          "VietRealty 可随时更新本条款。重大变更将通过您注册的邮箱通知您。",
      },
      { heading: "7. 联系我们" },
    ],
  },
};

export default function DieuKhoanPage() {
  const { locale } = useLocale();
  const L = TERMS_T[locale];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-2">{L.title}</h1>
      <p className="text-gray-400 text-sm mb-10">{L.updated}: {LAST_UPDATED}</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        {L.sections.map((s, i) => {
          const isContact = i === L.sections.length - 1;
          return (
            <section key={i}>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{s.heading}</h2>
              {s.intro && <p>{s.intro}</p>}
              {s.items && (
                <ul className="list-disc pl-5 space-y-1">
                  {s.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              )}
              {isContact && (
                <p>
                  {L.contactPrefix}{" "}
                  <a href="mailto:info@vietrealty.vn" className="text-red-600 hover:underline">info@vietrealty.vn</a>
                </p>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
