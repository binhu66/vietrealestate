"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ZALO_PHONE } from "@/lib/config";

const ZALO_URL = `https://zalo.me/${ZALO_PHONE.replace(/^0/, "84")}`;

export default function ZaloFloat() {
  const [pulse, setPulse] = useState(true);
  const pathname = usePathname();

  // Hide on property detail pages (mobile has sticky contact bar there)
  const isDetailPage = /^\/bat-dong-san\/.+/.test(pathname);

  if (isDetailPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip — hidden on mobile to save space */}
      <div className="hidden sm:block bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-xl shadow-lg border border-gray-100 animate-bounce-slow whitespace-nowrap">
        💬 Chat Zalo hỗ trợ
      </div>

      {/* Zalo button */}
      <a
        href={ZALO_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setPulse(false)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #0068FF 0%, #00AAFF 100%)" }}
        aria-label="Chat Zalo"
      >
        {pulse && (
          <>
            <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30" />
            <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20 animation-delay-150" />
          </>
        )}
        <svg viewBox="0 0 48 48" className="w-8 h-8 fill-white relative z-10">
          <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm8.4 27.6c-.4.8-1.2 1.2-2 1.2-.4 0-.8 0-1.2-.4-2-1.2-4-2.8-5.6-4.8-1.6-1.6-2.8-3.6-3.6-5.6-.4-.8-.4-1.6 0-2.4.4-.8 1.2-1.2 2-1.2.4 0 .4.4.8.4l1.6 2.4c.4.4.4 1.2 0 1.6l-.8.8c.4.8.8 1.6 1.6 2.4.8.8 1.6 1.2 2.4 1.6l.8-.8c.4-.4 1.2-.4 1.6 0l2.4 1.6c.4 0 .4.4.4.8 0 .4-.4 1.2-.4 1.6z"/>
        </svg>
      </a>
    </div>
  );
}
