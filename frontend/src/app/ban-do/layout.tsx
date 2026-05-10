import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm bất động sản trên bản đồ | BinHorizon",
  description: "Khám phá bất động sản trên bản đồ tương tác. Vẽ vùng tìm kiếm, lọc theo khu vực và tìm nhà đất theo vị trí địa lý chính xác.",
  keywords: ["tìm nhà trên bản đồ", "bản đồ bất động sản", "tìm nhà theo vị trí", "bản đồ nhà đất"],
  openGraph: {
    title: "Tìm bất động sản trên bản đồ | BinHorizon",
    description: "Khám phá bất động sản theo vị trí địa lý với bản đồ tương tác của BinHorizon.",
    type: "website",
  },
};

export default function BanDoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
