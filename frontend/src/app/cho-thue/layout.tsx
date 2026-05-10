import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cho thuê bất động sản | BinHorizon",
  description: "Tìm nhà cho thuê, căn hộ cho thuê, văn phòng cho thuê, mặt bằng kinh doanh trên toàn quốc. Hàng nghìn tin cho thuê uy tín tại BinHorizon.",
  keywords: ["cho thuê nhà", "cho thuê căn hộ", "cho thuê văn phòng", "cho thuê mặt bằng", "nhà cho thuê", "thuê nhà TP HCM", "thuê nhà Hà Nội"],
  openGraph: {
    title: "Cho thuê bất động sản | BinHorizon",
    description: "Tìm nhà cho thuê, căn hộ, văn phòng và mặt bằng kinh doanh trên toàn quốc.",
    type: "website",
  },
};

export default function ChoThueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
