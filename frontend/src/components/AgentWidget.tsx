"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X, Phone, MessageCircle, ChevronDown } from "lucide-react";

export default function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  // Hide on property detail pages — those have their own sticky contact bar
  const isDetailPage = /^\/bat-dong-san\/.+/.test(pathname);
  if (dismissed || isDetailPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Chat card */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="bg-red-600 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold text-sm">Tư vấn bất động sản</span>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Agent info */}
          <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
            <div className="relative">
              <Image
                src="/images/agent-avatar.jpg"
                alt="Chuyên viên tư vấn"
                width={52}
                height={52}
                className="rounded-full object-cover w-13 h-13 border-2 border-red-100"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Nguyễn Thị Lan</p>
              <p className="text-xs text-gray-500">Chuyên viên tư vấn</p>
              <p className="text-xs text-green-600 font-medium">● Đang trực tuyến</p>
            </div>
          </div>

          {/* Message bubble */}
          <div className="px-4 py-3 bg-gray-50">
            <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed">
              Xin chào! Bạn cần tư vấn về bất động sản? Tôi sẵn sàng hỗ trợ bạn tìm căn nhà phù hợp nhất 🏠
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 flex gap-2">
            <a
              href="tel:18006834"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Gọi ngay
            </a>
            <a
              href="https://zalo.me/84933272169"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Zalo
            </a>
          </div>

          {/* Hours */}
          <p className="text-center text-xs text-gray-400 pb-3">
            Hỗ trợ 08:00 – 21:00 mỗi ngày
          </p>
        </div>
      )}

      {/* FAB button */}
      <div className="relative">
        {/* Dismiss button */}
        {!open && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center z-10 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}

        <button
          onClick={() => setOpen(v => !v)}
          className="relative flex items-center gap-2.5 bg-white rounded-full shadow-xl border border-gray-100 pr-4 hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Image
              src="/images/agent-avatar.jpg"
              alt="Tư vấn viên"
              width={48}
              height={48}
              className="rounded-full object-cover w-12 h-12 border-2 border-red-500"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          {!open && (
            <div className="text-left py-2">
              <p className="text-xs font-bold text-gray-900 leading-tight">Cần tư vấn?</p>
              <p className="text-xs text-gray-500 leading-tight">Chat với chúng tôi</p>
            </div>
          )}
        </button>

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-20 pointer-events-none" />
        )}
      </div>
    </div>
  );
}
