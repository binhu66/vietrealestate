import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Môi giới bất động sản uy tín | VietRealty",
  description: "Kết nối với mạng lưới môi giới bất động sản uy tín trên toàn quốc. Chuyên viên được xác minh, kinh nghiệm cao, hỗ trợ 24/7.",
  keywords: ["môi giới bất động sản", "chuyên viên bất động sản", "tìm môi giới", "môi giới uy tín"],
  openGraph: {
    title: "Môi giới bất động sản uy tín | VietRealty",
    description: "Kết nối với mạng lưới môi giới bất động sản uy tín, được xác minh tại VietRealty.",
    type: "website",
  },
};

export default function MoiGioiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
