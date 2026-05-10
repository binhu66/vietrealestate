import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mua bán bất động sản | BinHorizon",
  description: "Hàng nghìn tin mua bán nhà đất, căn hộ chung cư, biệt thự, đất nền trên toàn quốc. Tìm ngôi nhà mơ ước với BinHorizon.",
  keywords: ["mua bán nhà đất", "căn hộ chung cư", "biệt thự", "đất nền", "nhà riêng", "mua nhà TP HCM", "mua nhà Hà Nội"],
  openGraph: {
    title: "Mua bán bất động sản | BinHorizon",
    description: "Hàng nghìn tin mua bán nhà đất, căn hộ, biệt thự, đất nền trên toàn quốc.",
    type: "website",
  },
};

export default function BatDongSanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
