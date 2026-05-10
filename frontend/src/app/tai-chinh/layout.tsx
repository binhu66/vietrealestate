import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tính vay & lợi suất đầu tư | BinHorizon",
  description: "Công cụ tính vay mua nhà, so sánh lãi suất ngân hàng và tính lợi suất đầu tư bất động sản. Miễn phí, nhanh chóng và chính xác.",
  keywords: ["tính vay mua nhà", "lãi suất ngân hàng", "lợi suất đầu tư bất động sản", "tính lãi vay", "ROI bất động sản"],
  openGraph: {
    title: "Tính vay & lợi suất đầu tư BĐS | BinHorizon",
    description: "Tính toán khoản vay mua nhà, so sánh lãi suất ngân hàng, và đánh giá lợi suất đầu tư bất động sản.",
    type: "website",
  },
};

export default function TaiChinhLayout({ children }: { children: React.ReactNode }) {
  return children;
}
