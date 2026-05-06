"use client";
import { useState, useEffect } from "react";
import { Search, Shield, UserCheck, UserX, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";
import { supabase } from "@/lib/supabase";

const USERS_T = {
  vi: {
    fetchFailed: "Không thể tải dữ liệu",
    errorPrefix: "Lỗi: ",
    loading: "Đang tải...",
    loadingFromDb: "Đang tải từ Supabase...",
    retry: "Thử lại",
    emptyDb: "Chưa có người dùng nào",
  },
  en: {
    fetchFailed: "Failed to load data",
    errorPrefix: "Error: ",
    loading: "Loading...",
    loadingFromDb: "Loading from Supabase...",
    retry: "Retry",
    emptyDb: "No users yet",
  },
  zh: {
    fetchFailed: "无法加载数据",
    errorPrefix: "错误：",
    loading: "加载中...",
    loadingFromDb: "正在从 Supabase 加载...",
    retry: "重试",
    emptyDb: "暂无用户",
  },
} as const;

interface UserRow {
  id: string;
  full_name: string | null;
  display_name: string | null;
  phone: string | null;
  role: "admin" | "agent" | "user";
  status: "active" | "inactive" | "banned";
  created_at: string;
  listing_count?: number;
}

export default function AdminUsersPage() {
  const { locale } = useLocale();
  const t = getT(locale);
  const ut = USERS_T[locale];
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("profiles")
        .select("id, full_name, display_name, phone, role, status, created_at")
        .order("created_at", { ascending: false })
        .limit(500);

      if (err) throw err;

      // Fetch listing counts per user
      const { data: counts } = await supabase
        .from("listings")
        .select("posted_by")
        .eq("standard_status", "Active");

      const countMap: Record<string, number> = {};
      counts?.forEach(r => {
        if (r.posted_by) countMap[r.posted_by] = (countMap[r.posted_by] || 0) + 1;
      });

      setUsers((data ?? []).map(u => ({ ...u, listing_count: countMap[u.id] || 0 })));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : ut.fetchFailed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function toggleStatus(u: UserRow) {
    const newStatus = u.status === "active" ? "inactive" : "active";
    setTogglingId(u.id);
    const { error: err } = await supabase
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", u.id);
    if (err) {
      alert(ut.errorPrefix + err.message);
    } else {
      setUsers(prev => prev.map(row => row.id === u.id ? { ...row, status: newStatus } : row));
    }
    setTogglingId(null);
  }

  const filtered = users.filter(u => {
    if (!q) return true;
    const name = (u.full_name || u.display_name || "").toLowerCase();
    return name.includes(q.toLowerCase()) || (u.phone || "").includes(q);
  });

  const roleColors: Record<string, string> = {
    admin: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    agent: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    user: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
  };

  function displayName(u: UserRow) {
    return u.full_name || u.display_name || "—";
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t.admin.users}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {loading ? ut.loading : `${users.length} ${t.admin.usersLabel}`}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t.admin.total, value: users.length, num: "text-gray-900 dark:text-white", bg: "bg-white dark:bg-gray-900", border: "border-gray-200 dark:border-gray-800" },
          { label: t.admin.activeUsers, value: users.filter(u => u.status === "active").length, num: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-100 dark:border-green-900/40" },
          { label: t.admin.disabled, value: users.filter(u => u.status !== "active").length, num: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-900/40" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center shadow-sm`}>
            <div className={`text-3xl font-black ${s.num}`}>{loading ? "…" : s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={t.admin.searchUsers}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchUsers} className="ml-auto underline hover:no-underline">{ut.retry}</button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">{ut.loadingFromDb}</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">{t.admin.userAccount}</th>
                <th className="text-left px-4 py-3">{t.admin.role}</th>
                <th className="text-left px-4 py-3">{t.admin.listings}</th>
                <th className="text-left px-4 py-3">{t.admin.joined}</th>
                <th className="text-left px-4 py-3">{t.admin.status}</th>
                <th className="text-right px-4 py-3">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {displayName(u)[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-white font-medium">{displayName(u)}</div>
                        <div className="text-gray-400 text-xs">{u.phone || u.id.slice(0, 8) + "…"}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-medium ${roleColors[u.role] || roleColors.user}`}>
                      {u.role === "admin" && <Shield className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.listing_count ?? 0}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(u.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status === "active" ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"}`}>
                      {u.status === "active" ? t.admin.active : t.admin.inactive}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={togglingId === u.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 ${
                            u.status === "active"
                              ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                              : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          }`}
                        >
                          {togglingId === u.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : u.status === "active"
                              ? <><UserX className="w-3.5 h-3.5" /> {t.admin.block}</>
                              : <><UserCheck className="w-3.5 h-3.5" /> {t.admin.unblock}</>
                          }
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    {users.length === 0 ? ut.emptyDb : t.admin.noResults}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
