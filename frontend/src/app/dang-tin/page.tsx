"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Home, ChevronRight, CheckCircle2, MapPin, Loader2, LogIn, ImagePlus, X } from "lucide-react";
import { cities, categories } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { useUser } from "@/lib/auth";

const MAX_PHOTOS = 10;
const MAX_SIZE_MB = 10;

interface PhotoPreview {
  file: File;
  url: string;  // object URL for preview
}

const POST_EXTRA_T = {
  vi: {
    authTitle: "Đăng nhập để đăng tin",
    authDesc: "Bạn cần có tài khoản để đăng bất động sản lên VietRealty.",
    login: "Đăng nhập",
    register: "Đăng ký",
    photoTooLarge: (name: string, mb: number) => `${name} vượt quá ${mb}MB`,
    unitTy: "Tỷ",
    unitTrieu: "Triệu",
    unitTrieuThang: "Triệu/tháng",
    unitNghinThang: "Nghìn/tháng",
    coverBadge: "Bìa",
    genericError: "Đã xảy ra lỗi, vui lòng thử lại.",
  },
  en: {
    authTitle: "Sign in to post a listing",
    authDesc: "You need an account to post properties on VietRealty.",
    login: "Sign in",
    register: "Sign up",
    photoTooLarge: (name: string, mb: number) => `${name} exceeds ${mb}MB`,
    unitTy: "Billion",
    unitTrieu: "Million",
    unitTrieuThang: "Million/month",
    unitNghinThang: "Thousand/month",
    coverBadge: "Cover",
    genericError: "An error occurred, please try again.",
  },
  zh: {
    authTitle: "登录后发布房源",
    authDesc: "您需要拥有账号才能在 VietRealty 上发布房产。",
    login: "登录",
    register: "注册",
    photoTooLarge: (name: string, mb: number) => `${name} 超过 ${mb}MB`,
    unitTy: "十亿",
    unitTrieu: "百万",
    unitTrieuThang: "百万/月",
    unitNghinThang: "千/月",
    coverBadge: "封面",
    genericError: "发生错误，请重试。",
  },
};

const RESIDENTIAL_IDS = ["can-ho-chung-cu", "nha-rieng", "nha-biet-thu", "dat-nen"];
const COMMERCIAL_IDS  = ["van-phong", "mat-bang", "kho-xuong", "khach-san"];

const CATEGORY_TO_TYPE: Record<string, string> = {
  "can-ho-chung-cu": "apartment",
  "nha-rieng":       "house",
  "nha-biet-thu":    "villa",
  "dat-nen":         "land",
  "van-phong":       "office",
  "mat-bang":        "commercial",
  "kho-xuong":       "warehouse",
  "khach-san":       "other",
};

function toVND(price: string, unit: string): number {
  const n = parseFloat(price) || 0;
  if (unit === "ty")          return Math.round(n * 1_000_000_000);
  if (unit === "trieu")       return Math.round(n * 1_000_000);
  if (unit === "trieu/thang") return Math.round(n * 1_000_000);
  if (unit === "nghin/thang") return Math.round(n * 1_000);
  return Math.round(n);
}

type Step = "type" | "form" | "done";

export default function DangTinPage() {
  const router = useRouter();
  const { locale } = useLocale();
  const t = getT(locale).post;
  const tCat = getT(locale).categories;
  const tx = POST_EXTRA_T[locale];
  const { user, loading: authLoading } = useUser();

  const [step,         setStep]         = useState<Step>("type");
  const [segment,      setSegment]      = useState<"residential" | "commercial">("residential");
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");
  const [savedId,      setSavedId]      = useState<string | null>(null);
  const [photos,       setPhotos]       = useState<PhotoPreview[]>([]);
  const [dragOver,     setDragOver]     = useState(false);
  const [photoError,   setPhotoError]   = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    listingType:  "ban",
    category:     "",
    title:        "",
    price:        "",
    priceUnit:    "ty",
    area:         "",
    bedrooms:     "",
    bathrooms:    "",
    address:      "",
    district:     "",
    city:         "",
    description:  "",
    contactName:  user?.user_metadata?.display_name || "",
    contactPhone: "",
  });

  // Pre-fill contact name once user loads
  useEffect(() => {
    if (user && !form.contactName) {
      setForm(prev => ({ ...prev, contactName: user.user_metadata?.display_name || "" }));
    }
  }, [user]);

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    setPhotoError("");
    const valid: PhotoPreview[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setPhotoError(tx.photoTooLarge(file.name, MAX_SIZE_MB));
        continue;
      }
      if (photos.length + valid.length >= MAX_PHOTOS) break;
      valid.push({ file, url: URL.createObjectURL(file) });
    }
    setPhotos(prev => [...prev, ...valid].slice(0, MAX_PHOTOS));
  }, [photos.length, tx]);

  function removePhoto(idx: number) {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  }

  function movePhoto(from: number, to: number) {
    setPhotos(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }

  function handleSegment(s: "residential" | "commercial") {
    setSegment(s);
    setForm(prev => ({ ...prev, category: "", listingType: "ban" }));
    setStep("form");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const fullAddress = [form.address, form.district, form.city].filter(Boolean).join(", ");

      let lat: number | null = null;
      let lng: number | null = null;
      if (fullAddress.length > 5) {
        try {
          const geoRes = await fetch(`/api/geocode?address=${encodeURIComponent(fullAddress)}`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.lat) { lat = geoData.lat; lng = geoData.lng; }
          }
        } catch { /* geocoding optional */ }
      }

      // Upload photos first to get cover_image URL
      const uploadedUrls: Array<{ url: string; path: string; size: number }> = [];
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const ext = photo.file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${user?.id ?? "anon"}/${Date.now()}_${i}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("listing-images")
          .upload(path, photo.file, { contentType: photo.file.type, upsert: false });
        if (upErr) { console.warn("Photo upload failed:", upErr.message); continue; }
        const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(path);
        uploadedUrls.push({ url: publicUrl, path, size: photo.file.size });
      }

      const coverImage = uploadedUrls[0]?.url ?? null;

      const { data, error: dbError } = await supabase
        .from("listings")
        .insert({
          transaction_type:    form.listingType === "ban" ? "For Sale" : "For Rent",
          property_type:       CATEGORY_TO_TYPE[form.category] ?? "other",
          category:            form.category,
          title:               form.title,
          list_price:          toVND(form.price, form.priceUnit),
          price_unit:          "vnd",
          building_area_total: parseFloat(form.area) || null,
          bedrooms_total:      form.bedrooms ? parseInt(form.bedrooms) : null,
          bathrooms_total:     form.bathrooms ? parseInt(form.bathrooms) : null,
          unparsed_address:    fullAddress || null,
          so_nha:              form.address || null,
          quan_huyen:          form.district || null,
          tinh_thanh:          form.city || "TP. Hồ Chí Minh",
          public_remarks:      form.description || null,
          contact_name:        form.contactName,
          contact_phone:       form.contactPhone,
          lat, lng,
          cover_image:         coverImage,
          standard_status:     "Active",
          posted_by:           user?.id ?? null,
        })
        .select("id")
        .single();

      if (dbError) throw new Error(dbError.message);
      const listingId = data?.id;

      // Insert listing_media rows
      if (listingId && uploadedUrls.length > 0) {
        await supabase.from("listing_media").insert(
          uploadedUrls.map((u, idx) => ({
            listing_id:   listingId,
            url:          u.url,
            storage_path: u.path,
            media_type:   "photo",
            sort_order:   idx,
            size_bytes:   u.size,
            uploaded_by:  user?.id ?? null,
          }))
        );
      }

      setSavedId(listingId ?? null);
      setStep("done");
    } catch (err: any) {
      setError(err.message ?? tx.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  const categoryList = categories.filter(c =>
    segment === "commercial" ? COMMERCIAL_IDS.includes(c.id) : RESIDENTIAL_IDS.includes(c.id)
  );
  const isCommercial = segment === "commercial";

  // ── Done ────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">{t.successTitle}</h2>
          <p className="text-gray-500 mb-2">{t.successMsg}</p>
          {savedId && <p className="text-xs text-gray-400 mb-6 font-mono">ID: {savedId}</p>}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setStep("type"); setSavedId(null);
                photos.forEach(p => URL.revokeObjectURL(p.url));
                setPhotos([]);
                setForm({ listingType:"ban", category:"", title:"", price:"", priceUnit:"ty", area:"", bedrooms:"", bathrooms:"", address:"", district:"", city:"", description:"", contactName:"", contactPhone:"" });
              }}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t.postNew}
            </button>
            <button
              onClick={() => router.push("/bat-dong-san")}
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              {t.viewList}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Type picker ──────────────────────────────────────────────────────────
  if (step === "type") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t.pageTitle}</h1>
          <p className="text-gray-500">{t.pageSubtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSegment("residential")}
            className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all group"
          >
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <Home className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{t.residential}</div>
              <div className="text-sm text-gray-500 mt-1">{t.residentialDesc}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>

          <button
            onClick={() => handleSegment("commercial")}
            className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl border-2 border-gray-200 hover:border-amber-500 hover:shadow-lg transition-all group"
          >
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">{t.commercial}</div>
              <div className="text-sm text-gray-500 mt-1">{t.commercialDesc}</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" />
          </button>
        </div>
      </div>
    );
  }

  // ── Auth gate ────────────────────────────────────────────────────────────
  if (!authLoading && !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">{tx.authTitle}</h2>
          <p className="text-gray-500 text-sm mb-6">{tx.authDesc}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/dang-nhap?redirect=/dang-tin" className="flex items-center gap-2 bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors">
              <LogIn className="w-4 h-4" /> {tx.login}
            </Link>
            <Link href="/dang-ky?redirect=/dang-tin" className="flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:border-red-400 hover:text-red-600 transition-colors">
              {tx.register}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setStep("type")} className="text-sm text-gray-500 hover:text-gray-700">{t.back}</button>
        <span className="text-gray-300">|</span>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isCommercial ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
          {isCommercial ? <Building2 className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
          {isCommercial ? t.commercial : t.residential}
        </div>
      </div>

      <h1 className="text-2xl font-black text-gray-900 mb-6">{t.formTitle}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Listing type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.listingType}</label>
          <div className="flex gap-2">
            {([{ value: "ban", label: t.sell }, { value: "thue", label: t.rent }] as const).map(({ value, label }) => (
              <button
                key={value} type="button" onClick={() => set("listingType", value)}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors ${form.listingType === value ? (isCommercial ? "bg-amber-600 text-white" : "bg-red-600 text-white") : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.category} <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-2">
            {categoryList.map(c => (
              <button
                key={c.id} type="button" onClick={() => set("category", c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${form.category === c.id ? (isCommercial ? "border-amber-500 bg-amber-50 text-amber-700" : "border-red-500 bg-red-50 text-red-700") : "border-gray-200 text-gray-700 hover:border-gray-300"}`}
              >
                <span>{c.icon}</span>{tCat[c.id as keyof typeof tCat] ?? c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.title} <span className="text-red-500">*</span></label>
          <input
            required type="text" value={form.title}
            onChange={e => set("title", e.target.value)}
            placeholder={t.titlePlaceholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.price} <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <input
              required type="number" min="0" value={form.price}
              onChange={e => set("price", e.target.value)}
              placeholder="0"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={form.priceUnit} onChange={e => set("priceUnit", e.target.value)}
              className="px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="ty">{tx.unitTy}</option>
              <option value="trieu">{tx.unitTrieu}</option>
              <option value="trieu/thang">{tx.unitTrieuThang}</option>
              <option value="nghin/thang">{tx.unitNghinThang}</option>
            </select>
          </div>
        </div>

        {/* Area */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.area} <span className="text-red-500">*</span></label>
          <input
            required type="number" min="0" value={form.area}
            onChange={e => set("area", e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Bedrooms + bathrooms */}
        {!isCommercial && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.bedrooms}</label>
              <select value={form.bedrooms} onChange={e => set("bedrooms", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                <option value="">--</option>
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                <option value="7">7+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.bathrooms}</label>
              <select value={form.bathrooms} onChange={e => set("bathrooms", e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white">
                <option value="">--</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                <option value="6">6+</option>
              </select>
            </div>
          </div>
        )}

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {t.address} <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            required type="text" value={form.address}
            onChange={e => set("address", e.target.value)}
            placeholder={t.addressPlaceholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text" value={form.district}
              onChange={e => set("district", e.target.value)}
              placeholder={t.district}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <select
              value={form.city} onChange={e => set("city", e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value="">{t.city}</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />{t.geoHint}
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.description}</label>
          <textarea
            rows={4} value={form.description}
            onChange={e => set("description", e.target.value)}
            placeholder={t.descPlaceholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">{t.photos}</label>
          <p className="text-xs text-gray-400 mb-3">{t.photosHint}</p>

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragOver ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-300 hover:bg-gray-50"} ${photos.length >= MAX_PHOTOS ? "opacity-50 pointer-events-none" : ""}`}
          >
            <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">{t.photosAdd}</p>
            <p className="text-xs text-gray-400 mt-1">{t.photosFormat} · {photos.length}/{MAX_PHOTOS}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={e => addFiles(e.target.files)}
            />
          </div>

          {photoError && <p className="text-xs text-red-500 mt-1.5">{photoError}</p>}

          {/* Preview grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
              {photos.map((p, idx) => (
                <div key={p.url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  {idx === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[9px] text-center py-0.5 font-semibold">{tx.coverBadge}</span>
                  )}
                  {/* Move left */}
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => movePhoto(idx, idx - 1)}
                      className="absolute left-0.5 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >‹</button>
                  )}
                  {/* Move right */}
                  {idx < photos.length - 1 && (
                    <button
                      type="button"
                      onClick={() => movePhoto(idx, idx + 1)}
                      className="absolute right-0.5 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >›</button>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-gray-700">{t.contact}</p>
          <input
            required type="text" value={form.contactName}
            onChange={e => set("contactName", e.target.value)}
            placeholder={t.contactName}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
          <input
            required type="tel" value={form.contactPhone}
            onChange={e => set("contactPhone", e.target.value)}
            placeholder={t.contactPhone}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting || !form.title || !form.price || !form.area || !form.address || !form.contactName || !form.contactPhone || !form.category}
          className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all flex items-center justify-center gap-2 ${isCommercial ? "bg-amber-600 hover:bg-amber-700" : "bg-red-600 hover:bg-red-700"} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? t.submitting : t.submit}
        </button>
        <p className="text-xs text-center text-gray-400">{t.hint}</p>
      </form>
    </div>
  );
}
