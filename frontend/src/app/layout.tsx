import type { Metadata } from "next";
import "./globals.css";
import LocaleProvider from "@/components/layout/LocaleProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AgentWidget from "@/components/AgentWidget";
import BottomNav from "@/components/layout/BottomNav";
import { SavedProvider } from "@/lib/savedContext";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://binhorizon.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BinHorizon - Bất động sản Việt Nam",
    template: "%s | BinHorizon",
  },
  description: "Sàn giao dịch bất động sản hàng đầu Việt Nam. Mua bán, cho thuê nhà đất, căn hộ chung cư, biệt thự, đất nền trên toàn quốc.",
  keywords: ["bất động sản", "nhà đất", "căn hộ", "cho thuê", "mua bán nhà", "Vietnam real estate", "binhorizon"],
  openGraph: {
    type: "website",
    siteName: "BinHorizon",
    locale: "vi_VN",
    url: BASE_URL,
    title: "BinHorizon - Bất động sản Việt Nam",
    description: "Sàn giao dịch bất động sản hàng đầu Việt Nam",
    images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@binhorizon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "vi": `${BASE_URL}`,
      "en": `${BASE_URL}`,
      "zh": `${BASE_URL}`,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <LocaleProvider>
          <SavedProvider>
            <Header />
            <main className="flex-1 pb-14 sm:pb-0">{children}</main>
            <Footer />
            <BottomNav />
            <AgentWidget />
          </SavedProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
