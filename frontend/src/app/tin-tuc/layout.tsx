import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức thị trường bất động sản | VietRealty",
  description: "Cập nhật tin tức thị trường bất động sản mới nhất, phân tích xu hướng, pháp lý và đầu tư BĐS tại Việt Nam.",
  keywords: ["tin tức bất động sản", "thị trường bất động sản", "phân tích BĐS", "đầu tư bất động sản", "tin tức nhà đất"],
  openGraph: {
    title: "Tin tức thị trường bất động sản | VietRealty",
    description: "Cập nhật tin tức, phân tích thị trường và xu hướng đầu tư bất động sản Việt Nam.",
    type: "website",
  },
};

export default function TinTucLayout({ children }: { children: React.ReactNode }) {
  return children;
}
