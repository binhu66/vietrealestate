import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bất động sản thương mại | VietRealty",
  description: "Tìm văn phòng cho thuê, mặt bằng kinh doanh, kho xưởng, khách sạn trên toàn quốc. Bất động sản thương mại uy tín tại VietRealty.",
  keywords: ["văn phòng cho thuê", "mặt bằng kinh doanh", "kho xưởng", "khách sạn", "bất động sản thương mại"],
  openGraph: {
    title: "Bất động sản thương mại | VietRealty",
    description: "Văn phòng, mặt bằng, kho xưởng, khách sạn — bất động sản thương mại toàn quốc.",
    type: "website",
  },
};

export default function ThuongMaiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
