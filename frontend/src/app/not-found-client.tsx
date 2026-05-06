"use client";
import Link from "next/link";
import { useLocale } from "@/lib/locale";

const NOT_FOUND_T = {
  vi: {
    heading: "Trang không tồn tại",
    body: "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
    bodyExtra: "Hãy thử tìm bất động sản phù hợp trên VietRealty.",
    home: "Về trang chủ",
    listings: "Xem nhà đất",
  },
  en: {
    heading: "Page not found",
    body: "The page you are looking for does not exist or has been removed.",
    bodyExtra: "Try searching for properties on VietRealty.",
    home: "Back to home",
    listings: "Browse listings",
  },
  zh: {
    heading: "页面不存在",
    body: "您查找的页面不存在或已被删除。",
    bodyExtra: "可在 VietRealty 上搜索合适的房产。",
    home: "返回首页",
    listings: "浏览房源",
  },
};

export default function NotFoundClient() {
  const { locale } = useLocale();
  const T = NOT_FOUND_T[locale as keyof typeof NOT_FOUND_T] ?? NOT_FOUND_T.vi;
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-red-600 mb-4">404</div>
        <div className="text-5xl mb-6">🏠</div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">{T.heading}</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {T.body}<br />
          {T.bodyExtra}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            {T.home}
          </Link>
          <Link
            href="/bat-dong-san"
            className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-red-400 hover:text-red-600 transition-colors"
          >
            {T.listings}
          </Link>
        </div>
      </div>
    </div>
  );
}
