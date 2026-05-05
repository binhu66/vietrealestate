"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Heart, Home, Settings, LogOut, Eye, MapPin, Calendar, Phone, Edit3, Check, X } from "lucide-react";
import { useUser, signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { dbToProperty, LISTING_SELECT, type DbListing } from "@/lib/listingAdapter";
import { formatPrice } from "@/lib/data";
import type { Property } from "@/lib/data";
import { useLocale } from "@/lib/locale";

type Tab = "listings" | "saved" | "profile";

export default function TaiKhoanPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const { locale } = useLocale();

  const [tab, setTab]               = useState<Tab>("listings");
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [saved, setSaved]           = useState<Property[]>([]);
  const [loading, setLoading]       = useState(true);

  // Profile edit state
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone]             = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile]   = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) router.replace("/dang-nhap?redirect=/tai-khoan");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.user_metadata?.display_name || "");
    fetchAll();
  }, [user]);

  async function fetchAll() {
    setLoading(true);
    await Promise.all([fetchMyListings(), fetchSaved()]);
    setLoading(false);
  }

  async function fetchMyListings() {
    if (!user) return;
    const { data } = await supabase
      .from("listings")
      .select(LISTING_SELECT)
      .eq("posted_by", user.id)
      .order("original_entry_timestamp", { ascending: false })
      .limit(50);
    if (data) setMyListings((data as unknown as DbListing[]).map(dbToProperty));
  }

  async function fetchSaved() {
    if (!user) return;
    const { data } = await supabase
      .from("saved_listings")
      .select(`listing_id, listings:listing_id(${LISTING_SELECT})`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) {
      const props = data
        .filter((r: any) => r.listings)
        .map((r: any) => dbToProperty(r.listings as DbListing));
      setSaved(props);
    }
  }

  async function saveProfile() {
    if (!user) return;
    setSavingProfile(true);
    await supabase.auth.updateUser({ data: { display_name: displayName } });
    await supabase.from("profiles").update({ display_name: displayName, phone }).eq("id", user.id);
    setSavingProfile(false);
    setEditingProfile(false);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  async function withdrawListing(id: string) {
    await supabase.from("listings").update({ standard_status: "Withdrawn" }).eq("id", id);
    setMyListings(prev => prev.filter(p => p.id !== id));
  }

  async function unsaveListing(listingId: string) {
    if (!user) return;
    await supabase.from("saved_listings").delete().eq("user_id", user.id).eq("listing_id", listingId);
    setSaved(prev => prev.filter(p => p.id !== listingId));
  }

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-6 h-6 animate-spin text-red-600" /></div>;
  }
  if (!user) return null;

  const displayNameLabel = user.user_metadata?.display_name || user.email?.split("@")[0] || "Tài khoản";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
          {displayNameLabel[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900">{displayNameLabel}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="ml-auto flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 border border-gray-200 px-3 py-2 rounded-lg hover:border-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Đăng xuất
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {([
          { id: "listings", label: "Tin đăng của tôi", icon: <Home className="w-4 h-4" /> },
          { id: "saved",    label: "Đã lưu",           icon: <Heart className="w-4 h-4" /> },
          { id: "profile",  label: "Hồ sơ",            icon: <Settings className="w-4 h-4" /> },
        ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* My Listings */}
      {tab === "listings" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Tin đăng của tôi ({myListings.length})</h2>
            <Link href="/dang-tin" className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-700 transition-colors">
              + Đăng tin mới
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang tải...</div>
          ) : myListings.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Home className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Chưa có tin đăng nào</p>
              <Link href="/dang-tin" className="mt-3 inline-block text-red-600 font-semibold text-sm hover:underline">Đăng tin ngay →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map(p => (
                <div key={p.id} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:shadow-sm transition-shadow">
                  <img src={p.images[0]} alt={p.title} className="w-24 h-18 rounded-lg object-cover shrink-0" style={{height:"72px"}} />
                  <div className="flex-1 min-w-0">
                    <Link href={`/bat-dong-san/${p.id}`} className="font-semibold text-sm text-gray-900 hover:text-red-600 line-clamp-1">{p.title}</Link>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <MapPin className="w-3 h-3" /> {p.district}, {p.city}
                    </div>
                    <div className="text-red-600 font-bold text-sm mt-1">{formatPrice(p.price, p.priceUnit)}</div>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium text-center">Đang đăng</span>
                    <button
                      onClick={() => withdrawListing(p.id)}
                      className="text-xs text-gray-400 hover:text-red-600 border border-gray-200 rounded-lg px-2 py-1 hover:border-red-300 transition-colors"
                    >
                      Gỡ tin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved */}
      {tab === "saved" && (
        <div>
          <h2 className="font-bold text-gray-800 mb-4">Bất động sản đã lưu ({saved.length})</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Đang tải...</div>
          ) : saved.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Chưa lưu bất động sản nào</p>
              <Link href="/bat-dong-san" className="mt-3 inline-block text-red-600 font-semibold text-sm hover:underline">Khám phá ngay →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {saved.map(p => (
                <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow relative">
                  <button
                    onClick={() => unsaveListing(p.id)}
                    className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white shadow"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                  <Link href={`/bat-dong-san/${p.id}`}>
                    <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
                    <div className="p-3">
                      <div className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">{p.title}</div>
                      <div className="text-red-600 font-bold text-sm">{formatPrice(p.price, p.priceUnit)}</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.district}, {p.city}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {tab === "profile" && (
        <div className="max-w-md">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Thông tin hồ sơ</h2>
              {!editingProfile ? (
                <button onClick={() => setEditingProfile(true)} className="flex items-center gap-1 text-sm text-red-600 hover:underline font-medium">
                  <Edit3 className="w-3.5 h-3.5" /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveProfile} disabled={savingProfile} className="flex items-center gap-1 text-sm text-green-600 hover:underline font-medium disabled:opacity-50">
                    {savingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Lưu
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="text-sm text-gray-400 hover:text-gray-600">Huỷ</button>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
              <p className="mt-1 text-sm text-gray-700">{user.email}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Họ tên</label>
              {editingProfile ? (
                <input
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                  placeholder="Nguyễn Văn A"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-700">{displayName || "—"}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Số điện thoại</label>
              {editingProfile ? (
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400"
                  placeholder="09xx xxx xxx"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-700">{phone || "—"}</p>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Thành viên từ</label>
              <p className="mt-1 text-sm text-gray-700">{new Date(user.created_at).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
