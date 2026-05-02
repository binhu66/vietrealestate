"use client";
import PropertyCard from "@/components/property/PropertyCard";
import SearchBar from "@/components/property/SearchBar";
import { properties } from "@/lib/data";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

const COMMERCIAL_CATEGORIES = ["van-phong", "mat-bang", "kho-xuong", "khach-san"];

export default function ThuongMaiPage() {
  const { locale } = useLocale();
  const t = getT(locale);
  const commercial = properties.filter((p) => COMMERCIAL_CATEGORIES.includes(p.category));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <SearchBar />
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🏢 {t.nav.thuongMai}</h1>
        <p className="text-gray-500 mt-1">Văn phòng, mặt bằng, kho xưởng, khách sạn</p>
      </div>

      {/* Sub-category tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "van-phong", label: "Văn phòng", icon: "🏗️" },
          { id: "mat-bang", label: "Mặt bằng", icon: "🏪" },
          { id: "kho-xuong", label: "Kho, xưởng", icon: "🏭" },
          { id: "khach-san", label: "Khách sạn", icon: "🏨" },
        ].map((cat) => (
          <a
            key={cat.id}
            href={`/bat-dong-san?category=${cat.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-red-400 hover:text-red-600 transition-colors"
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
              {properties.filter((p) => p.category === cat.id).length}
            </span>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {commercial.map((p) => <PropertyCard key={p.id} property={p} />)}
      </div>
    </div>
  );
}
