import type { Metadata } from "next";
import "./globals.css";
import LocaleProvider from "@/components/layout/LocaleProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "VietRealty - Bất động sản Việt Nam",
  description: "Sàn giao dịch bất động sản hàng đầu Việt Nam - Mua bán, cho thuê nhà đất, căn hộ, biệt thự",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <LocaleProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
