import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Không tìm thấy trang | VietRealty",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-red-600 mb-4">404</div>
        <div className="text-5xl mb-6">🏠</div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Trang không tồn tại</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.<br />
          Hãy thử tìm bất động sản phù hợp trên VietRealty.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="bg-red-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/bat-dong-san"
            className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:border-red-400 hover:text-red-600 transition-colors"
          >
            Xem nhà đất
          </Link>
        </div>
      </div>
    </div>
  );
}
