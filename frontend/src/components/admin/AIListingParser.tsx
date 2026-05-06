"use client";
import { useState, useMemo } from "react";
import { Wand2, Loader2, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/locale";

const PARSER_T = {
  vi: {
    buttonOpen: "Nhận diện tin đăng AI",
    title: "Nhận diện tin đăng AI",
    subtitle: "Dán nội dung tin, tự động trích xuất giá / diện tích / phòng / địa chỉ / liên hệ",
    sourceLabel: "Nội dung tin gốc",
    placeholder: `Dán nội dung tin — vừa nhập vừa hiển thị kết quả nhận diện bên phải

Ví dụ:
Bán căn hộ 2PN 75m² tại Vinhomes Central Park, Bình Thạnh, TP.HCM. Giá 5.2 tỷ. View sông tuyệt đẹp, nội thất cao cấp. Liên hệ A. Tuấn 0901234567`,
    charSuffix: "ký tự · tự động nhận diện khi nhập",
    resultLabel: "Kết quả nhận diện (có thể chỉnh sửa)",
    placeholderHint: "Dán nội dung tin ở bên trái...",
    fTitle: "Tiêu đề",
    fTransaction: "Giao dịch",
    fType: "Loại",
    fPrice: "Giá",
    fArea: "Diện tích m²",
    fBedrooms: "Phòng ngủ",
    fBathrooms: "Phòng tắm",
    fAddress: "Địa chỉ",
    fDistrict: "Quận/Huyện",
    fCity: "Tỉnh/TP",
    fContactName: "Liên hệ",
    fPhone: "Điện thoại",
    optBan: "Bán",
    optThue: "Cho thuê",
    catApartment: "Căn hộ",
    catHouse: "Nhà riêng",
    catVilla: "Biệt thự",
    catLand: "Đất nền",
    catOffice: "Văn phòng",
    catShop: "Mặt bằng",
    catWarehouse: "Kho xưởng",
    catHotel: "Khách sạn",
    btnSaveOk: "Đã lưu!",
    btnSaving: "Đang lưu...",
    btnSave: "Xác nhận lưu vào CSDL",
    needPriceArea: "Cần ít nhất giá và diện tích để lưu",
    defaultTitle: "Tin đăng mới",
    errFallback: "Lỗi",
  },
  en: {
    buttonOpen: "AI listing parser",
    title: "AI listing parser",
    subtitle: "Paste a listing — auto-extract price / area / rooms / address / contact",
    sourceLabel: "Listing source",
    placeholder: `Paste listing text — results show on the right as you type

Example:
Bán căn hộ 2PN 75m² tại Vinhomes Central Park, Bình Thạnh, TP.HCM. Giá 5.2 tỷ. View sông tuyệt đẹp, nội thất cao cấp. Liên hệ A. Tuấn 0901234567`,
    charSuffix: "chars · auto-parsing as you type",
    resultLabel: "Parsed (editable)",
    placeholderHint: "Paste listing text on the left...",
    fTitle: "Title",
    fTransaction: "Deal",
    fType: "Type",
    fPrice: "Price",
    fArea: "Area m²",
    fBedrooms: "Bedrooms",
    fBathrooms: "Bathrooms",
    fAddress: "Address",
    fDistrict: "District",
    fCity: "City",
    fContactName: "Contact",
    fPhone: "Phone",
    optBan: "For sale",
    optThue: "For rent",
    catApartment: "Apartment",
    catHouse: "House",
    catVilla: "Villa",
    catLand: "Land",
    catOffice: "Office",
    catShop: "Shophouse",
    catWarehouse: "Warehouse",
    catHotel: "Hotel",
    btnSaveOk: "Saved!",
    btnSaving: "Saving...",
    btnSave: "Save to database",
    needPriceArea: "Price and area required to save",
    defaultTitle: "New listing",
    errFallback: "Error",
  },
  zh: {
    buttonOpen: "智能识别房源",
    title: "智能识别房源",
    subtitle: "粘贴房源描述,自动提取价格 / 面积 / 户型 / 地址 / 联系方式",
    sourceLabel: "房源原文",
    placeholder: `粘贴房源内容 — 边输入,右侧实时显示识别结果

例如:
Bán căn hộ 2PN 75m² tại Vinhomes Central Park, Bình Thạnh, TP.HCM. Giá 5.2 tỷ. View sông tuyệt đẹp, nội thất cao cấp. Liên hệ A. Tuấn 0901234567`,
    charSuffix: "字符 · 输入时自动识别",
    resultLabel: "识别结果(可编辑)",
    placeholderHint: "在左侧粘贴房源内容...",
    fTitle: "标题",
    fTransaction: "交易",
    fType: "类型",
    fPrice: "价格",
    fArea: "面积 m²",
    fBedrooms: "卧室",
    fBathrooms: "浴室",
    fAddress: "地址",
    fDistrict: "区/县",
    fCity: "省/市",
    fContactName: "联系人",
    fPhone: "电话",
    optBan: "出售",
    optThue: "出租",
    catApartment: "公寓",
    catHouse: "独立屋",
    catVilla: "别墅",
    catLand: "地块",
    catOffice: "写字楼",
    catShop: "商铺",
    catWarehouse: "仓库",
    catHotel: "酒店",
    btnSaveOk: "保存成功!",
    btnSaving: "保存中...",
    btnSave: "确认保存到数据库",
    needPriceArea: "需要至少填入价格和面积才能保存",
    defaultTitle: "新房源",
    errFallback: "错误",
  },
};

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

function toVND(price: number, unit: string): number {
  if (unit === "ty")          return Math.round(price * 1_000_000_000);
  if (unit === "trieu")       return Math.round(price * 1_000_000);
  if (unit === "trieu/thang") return Math.round(price * 1_000_000);
  if (unit === "nghin/thang") return Math.round(price * 1_000);
  return Math.round(price);
}

interface Parsed {
  title: string;
  transactionType: "ban" | "thue";
  category: string;
  price: number;
  priceUnit: "ty" | "trieu" | "trieu/thang" | "nghin/thang";
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  address: string;
  district: string;
  city: string;
  description: string;
  contactName: string;
  contactPhone: string;
}

const EMPTY: Parsed = {
  title: "", transactionType: "ban", category: "can-ho-chung-cu",
  price: 0, priceUnit: "ty", area: 0,
  bedrooms: null, bathrooms: null,
  address: "", district: "", city: "",
  description: "", contactName: "", contactPhone: "",
};

// ── Regex parser ───────────────────────────────────────────────────────────
function parse(text: string): Parsed {
  const t = text.trim();
  if (!t) return { ...EMPTY };
  const lower = t.toLowerCase();

  // --- Transaction type ---
  let transactionType: "ban" | "thue" = "ban";
  if (/cho\s*thu[êe]|thu[êe]\s*nh[àa]|for\s*rent|出租|租/i.test(t)) transactionType = "thue";
  else if (/b[áa]n|for\s*sale|出售|售/i.test(t))                   transactionType = "ban";

  // --- Category (property type) ---
  let category = "can-ho-chung-cu";
  if      (/bi[ệe]t\s*th[ựu]|villa|别墅/i.test(t))                 category = "nha-biet-thu";
  else if (/nh[àa]\s*ri[êe]ng|nh[àa]\s*ph[ốo]|house|独立屋/i.test(t)) category = "nha-rieng";
  else if (/đ[ấa]t\s*n[ềe]n|đ[ấa]t\s*th[ổo]\s*c[ưu]|land|地块|土地/i.test(t)) category = "dat-nen";
  else if (/v[ăa]n\s*ph[òo]ng|office|写字楼|办公/i.test(t))         category = "van-phong";
  else if (/m[ặa]t\s*b[ằa]ng|shophouse|retail|商铺|店铺/i.test(t))   category = "mat-bang";
  else if (/kho|x[ưu][ởo]ng|warehouse|仓库/i.test(t))              category = "kho-xuong";
  else if (/kh[áa]ch\s*s[ạa]n|hotel|酒店/i.test(t))                category = "khach-san";
  else if (/c[ăa]n\s*h[ộo]|chung\s*c[ưu]|apartment|公寓/i.test(t)) category = "can-ho-chung-cu";

  // --- Price ---
  // "5.2 tỷ" / "5,2 tỷ" / "12 triệu/tháng" / "850 triệu"
  let price = 0;
  let priceUnit: Parsed["priceUnit"] = transactionType === "thue" ? "trieu/thang" : "ty";
  const tyMatch       = t.match(/(\d+[.,]?\d*)\s*(?:t[ỷy]|billion|亿|十亿)/i);
  const trieuThangMatch = t.match(/(\d+[.,]?\d*)\s*tri[êe]?u\s*\/?\s*(?:th[áa]ng|tháng|month|月)/i);
  const trieuMatch    = t.match(/(\d+[.,]?\d*)\s*tri[êe]?u(?!\s*\/)/i);
  const nghinThangMatch = t.match(/(\d+[.,]?\d*)\s*ngh[ìi]n\s*\/?\s*(?:th[áa]ng|tháng)/i);

  if (trieuThangMatch) {
    price = parseFloat(trieuThangMatch[1].replace(",", "."));
    priceUnit = "trieu/thang";
  } else if (nghinThangMatch) {
    price = parseFloat(nghinThangMatch[1].replace(",", "."));
    priceUnit = "nghin/thang";
  } else if (tyMatch) {
    price = parseFloat(tyMatch[1].replace(",", "."));
    priceUnit = "ty";
  } else if (trieuMatch) {
    price = parseFloat(trieuMatch[1].replace(",", "."));
    priceUnit = "trieu";
  }

  // --- Area (m²) ---
  let area = 0;
  const areaMatch = t.match(/(\d+(?:[.,]\d+)?)\s*(?:m[²2]|m\^2|平方米|平米|sqm|sq\.?\s*m)/i)
                 || t.match(/di[êe]n\s*t[íi]ch[:\s]+(\d+(?:[.,]\d+)?)/i)
                 || t.match(/面积[:\s]+(\d+(?:[.,]\d+)?)/);
  if (areaMatch) area = parseFloat(areaMatch[1].replace(",", "."));

  // --- Bedrooms ---
  let bedrooms: number | null = null;
  const bedMatch = t.match(/(\d+)\s*(?:PN|pn|ph[òo]ng\s*ng[ủu]|bedroom|bed|BR|卧室|室|居室)/i);
  if (bedMatch) bedrooms = parseInt(bedMatch[1]);

  // --- Bathrooms ---
  let bathrooms: number | null = null;
  const bathMatch = t.match(/(\d+)\s*(?:WC|wc|ph[òo]ng\s*t[ắa]m|toilet|bath|卫|浴室|洗手间)/i);
  if (bathMatch) bathrooms = parseInt(bathMatch[1]);

  // --- Phone (Vietnamese: 03/05/07/08/09 + 8 digits, allows + and spaces) ---
  const phoneMatch = t.match(/(?:\+?84|0)[\s.-]?(?:3|5|7|8|9)\d(?:[\s.-]?\d){7,8}/);
  let contactPhone = "";
  if (phoneMatch) contactPhone = phoneMatch[0].replace(/[\s.-]/g, "");

  // --- District ---
  // "Quận X" / "Q.X" / "Q X" / "huyện X" / "第X区"
  let district = "";
  const dMatch = t.match(/Qu[ậa]n\s*([\d\w]+)/i)
              || t.match(/Q\.?\s*(\d{1,2})/)
              || t.match(/Huy[ệe]n\s+([\p{L}\d]+)/iu)
              || t.match(/第(\d+)区/);
  if (dMatch) district = dMatch[0].replace(/^Q\.?\s*(\d)/i, "Quận $1");

  // --- City ---
  let city = "";
  if      (/TP\.?\s*H[CỒ]?\s*Ch[íi]\s*Minh|H[ồo]\s*Ch[íi]\s*Minh|HCM|Saigon|S[àa]i\s*G[òo]n|胡志明/i.test(t)) city = "TP. Hồ Chí Minh";
  else if (/H[àa]\s*N[ộo]i|Hanoi|河内/i.test(t))                city = "Hà Nội";
  else if (/Đ[àa]\s*N[ẵa]ng|Danang|岘港/i.test(t))              city = "Đà Nẵng";
  else if (/H[ảa]i\s*Ph[òo]ng|Haiphong/i.test(t))               city = "Hải Phòng";
  else if (/C[ầa]n\s*Th[ơo]|Cantho/i.test(t))                   city = "Cần Thơ";
  else if (/Long\s*An/i.test(t))                                city = "Long An";
  else if (/B[ìi]nh\s*D[ưu][ơo]ng/i.test(t))                    city = "Bình Dương";
  else if (/Đ[ồo]ng\s*Nai/i.test(t))                            city = "Đồng Nai";

  // --- Address (street name) — first line that looks like an address ---
  // Vietnamese addresses often start with "Số X, đường Y" or contain "đường"
  let address = "";
  const streetMatch = t.match(/([Sś]ố\s*\d+[^,\n]{0,40},?\s*(?:đ[ưu][ờo]ng|phố)[^,\n]{2,50})/i)
                   || t.match(/(đ[ưu][ờo]ng\s+[\p{L}\s\d]{2,40})/iu);
  if (streetMatch) address = streetMatch[1].trim();

  // --- Title: first non-empty line, or constructed ---
  const lines = t.split(/[\n\r]+/).map(l => l.trim()).filter(Boolean);
  let title = lines[0] && lines[0].length < 100 ? lines[0] : "";
  if (!title && (price > 0 || area > 0)) {
    const parts: string[] = [];
    if (transactionType === "ban") parts.push("Bán");
    else parts.push("Cho thuê");
    if (category === "can-ho-chung-cu") parts.push("căn hộ");
    else if (category === "nha-rieng") parts.push("nhà riêng");
    else if (category === "nha-biet-thu") parts.push("biệt thự");
    if (bedrooms) parts.push(`${bedrooms}PN`);
    if (area) parts.push(`${area}m²`);
    if (district) parts.push(`tại ${district}`);
    title = parts.join(" ");
  }

  // --- Description: full text minus title (or full text) ---
  const description = t;

  // --- Contact name: look for "Liên hệ X" or "A. X / Mr. X" before phone ---
  let contactName = "";
  const nameMatch = t.match(/(?:Li[êe]n\s*h[ệe]|Contact|联系)[\s:.]*([\p{L}\s]{2,30}?)(?=\s*(?:0|\+84|\d|$))/iu)
                 || t.match(/(?:A\.|Anh|Ch[ịi]|Mr\.|Mrs\.|Ms\.)\s+([\p{L}]{2,20}(?:\s+[\p{L}]{2,20})?)/iu);
  if (nameMatch) contactName = nameMatch[1].trim();

  return {
    title, transactionType, category,
    price, priceUnit, area, bedrooms, bathrooms,
    address, district, city,
    description, contactName, contactPhone,
  };
}

// ── Component ──────────────────────────────────────────────────────────────
export default function AIListingParser({ onSaved }: { onSaved?: () => void }) {
  const { locale } = useLocale();
  const T = PARSER_T[locale as keyof typeof PARSER_T] ?? PARSER_T.vi;
  const [open,    setOpen]    = useState(false);
  const [text,    setText]    = useState("");
  const [edits,   setEdits]   = useState<Partial<Parsed>>({});
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  // Live regex parsing as user types, merged with manual edits
  const parsed = useMemo<Parsed>(() => ({ ...parse(text), ...edits }), [text, edits]);
  const hasResult = text.trim().length > 5 && (parsed.price > 0 || parsed.area > 0 || parsed.contactPhone || parsed.district);

  function update<K extends keyof Parsed>(key: K, value: Parsed[K]) {
    setEdits(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const fullAddress = [parsed.address, parsed.district, parsed.city].filter(Boolean).join(", ");

      let lat: number | null = null, lng: number | null = null;
      if (fullAddress.length > 5) {
        try {
          const r = await fetch(`/api/geocode?address=${encodeURIComponent(fullAddress)}`);
          if (r.ok) { const g = await r.json(); if (g.lat) { lat = g.lat; lng = g.lng; } }
        } catch {}
      }

      const { error: dbError } = await supabase.from("listings").insert({
        transaction_type:    parsed.transactionType === "ban" ? "For Sale" : "For Rent",
        property_type:       CATEGORY_TO_TYPE[parsed.category] ?? "other",
        category:            parsed.category,
        title:               parsed.title || T.defaultTitle,
        list_price:          toVND(parsed.price, parsed.priceUnit),
        price_unit:          "vnd",
        building_area_total: parsed.area || null,
        bedrooms_total:      parsed.bedrooms,
        bathrooms_total:     parsed.bathrooms,
        unparsed_address:    fullAddress || null,
        so_nha:              parsed.address || null,
        quan_huyen:          parsed.district || null,
        tinh_thanh:          parsed.city || "TP. Hồ Chí Minh",
        public_remarks:      parsed.description || null,
        contact_name:        parsed.contactName,
        contact_phone:       parsed.contactPhone,
        lat, lng,
        standard_status:     "Active",
        posted_by:           null,
      });

      if (dbError) throw new Error(dbError.message);

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setText(""); setEdits({}); setSuccess(false);
        onSaved?.();
      }, 1500);
    } catch (e: any) {
      setError(e.message ?? T.errFallback);
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
      >
        <Wand2 className="w-4 h-4" />
        {T.buttonOpen}
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-5 shadow-lg space-y-4 col-span-full w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">{T.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{T.subtitle}</p>
          </div>
        </div>
        <button onClick={() => { setOpen(false); setText(""); setEdits({}); setError(""); }} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: input textarea */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{T.sourceLabel}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={T.placeholder}
            rows={14}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono"
          />
          <div className="text-xs text-gray-400">{text.length} {T.charSuffix}</div>
        </div>

        {/* Right: live extracted preview */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">{T.resultLabel}</label>
          <div className={`bg-gray-50 dark:bg-gray-800 border rounded-xl p-4 space-y-3 ${hasResult ? "border-green-300 dark:border-green-700" : "border-gray-200 dark:border-gray-700"}`}>
            {!hasResult && (
              <p className="text-sm text-gray-400 text-center py-6">{T.placeholderHint}</p>
            )}
            {hasResult && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label={T.fTitle} value={parsed.title} onChange={v => update("title", v)} colSpan={2} highlight={!!parse(text).title} />
                <Field label={T.fTransaction}>
                  <select value={parsed.transactionType} onChange={e => update("transactionType", e.target.value as any)} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="ban">{T.optBan}</option>
                    <option value="thue">{T.optThue}</option>
                  </select>
                </Field>
                <Field label={T.fType}>
                  <select value={parsed.category} onChange={e => update("category", e.target.value)} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm">
                    <option value="can-ho-chung-cu">{T.catApartment}</option>
                    <option value="nha-rieng">{T.catHouse}</option>
                    <option value="nha-biet-thu">{T.catVilla}</option>
                    <option value="dat-nen">{T.catLand}</option>
                    <option value="van-phong">{T.catOffice}</option>
                    <option value="mat-bang">{T.catShop}</option>
                    <option value="kho-xuong">{T.catWarehouse}</option>
                    <option value="khach-san">{T.catHotel}</option>
                  </select>
                </Field>
                <Field label={T.fPrice} highlight={parsed.price > 0}>
                  <div className="flex gap-1">
                    <input type="number" value={parsed.price || ""} onChange={e => update("price", parseFloat(e.target.value) || 0)} className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm" />
                    <select value={parsed.priceUnit} onChange={e => update("priceUnit", e.target.value as any)} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-2 text-sm">
                      <option value="ty">Tỷ</option>
                      <option value="trieu">Triệu</option>
                      <option value="trieu/thang">Tr/th</option>
                      <option value="nghin/thang">N/th</option>
                    </select>
                  </div>
                </Field>
                <Field label={T.fArea} type="number" value={parsed.area ? String(parsed.area) : ""} onChange={v => update("area", parseFloat(v) || 0)} highlight={parsed.area > 0} />
                <Field label={T.fBedrooms} type="number" value={parsed.bedrooms?.toString() ?? ""} onChange={v => update("bedrooms", v ? parseInt(v) : null)} highlight={parsed.bedrooms != null} />
                <Field label={T.fBathrooms} type="number" value={parsed.bathrooms?.toString() ?? ""} onChange={v => update("bathrooms", v ? parseInt(v) : null)} highlight={parsed.bathrooms != null} />
                <Field label={T.fAddress} value={parsed.address} onChange={v => update("address", v)} colSpan={2} highlight={!!parsed.address} />
                <Field label={T.fDistrict} value={parsed.district} onChange={v => update("district", v)} highlight={!!parsed.district} />
                <Field label={T.fCity} value={parsed.city} onChange={v => update("city", v)} highlight={!!parsed.city} />
                <Field label={T.fContactName} value={parsed.contactName} onChange={v => update("contactName", v)} highlight={!!parsed.contactName} />
                <Field label={T.fPhone} value={parsed.contactPhone} onChange={v => update("contactPhone", v)} highlight={!!parsed.contactPhone} />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {hasResult && (
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || success || !parsed.area || !parsed.price}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <Check className="w-4 h-4" /> : null}
            {success ? T.btnSaveOk : saving ? T.btnSaving : T.btnSave}
          </button>
          {(!parsed.area || !parsed.price) && (
            <span className="text-xs text-amber-600 dark:text-amber-400">{T.needPriceArea}</span>
          )}
        </div>
      )}
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", colSpan = 1, children, highlight = false,
}: {
  label: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: string;
  colSpan?: 1 | 2;
  children?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
        {label}
        {highlight && <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full" />}
      </label>
      {children ?? (
        <input
          type={type}
          value={value ?? ""}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full bg-white dark:bg-gray-900 border rounded-lg px-3 py-2 text-sm ${highlight ? "border-green-300 dark:border-green-700" : "border-gray-200 dark:border-gray-700"}`}
        />
      )}
    </div>
  );
}
