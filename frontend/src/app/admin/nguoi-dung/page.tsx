"use client";
import { useState } from "react";
import { Search, Shield, UserCheck, UserX } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

interface User {
  id: string; name: string; email: string;
  role: "admin" | "agent" | "user";
  status: "active" | "inactive";
  createdAt: string; listings: number;
}

const DEMO_USERS: User[] = [
  { id: "1", name: "Admin", email: "admin@vietrealestate.vn", role: "admin", status: "active", createdAt: "2026-01-01", listings: 0 },
  { id: "2", name: "Minh Tuấn", email: "minhtuan@example.com", role: "agent", status: "active", createdAt: "2026-02-15", listings: 3 },
  { id: "3", name: "Thu Hương", email: "thuhuong@example.com", role: "agent", status: "active", createdAt: "2026-02-20", listings: 2 },
  { id: "4", name: "Lan Anh", email: "lananh@example.com", role: "user", status: "active", createdAt: "2026-03-01", listings: 1 },
  { id: "5", name: "Văn Long", email: "vanlong@example.com", role: "user", status: "inactive", createdAt: "2026-03-10", listings: 1 },
];

export default function AdminUsersPage() {
  const { locale } = useLocale();
  const t = getT(locale);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [q, setQ] = useState("");

  const filtered = users.filter(
    (u) => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
  );

  function toggleStatus(id: string) {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  }

  const roleColors: Record<string, string> = {
    admin: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    agent: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    user: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t.admin.users}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{users.length} {t.admin.usersLabel}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t.admin.total, value: users.length, num: "text-gray-900 dark:text-white", bg: "bg-white dark:bg-gray-900", border: "border-gray-200 dark:border-gray-800" },
          { label: t.admin.activeUsers, value: users.filter((u) => u.status === "active").length, num: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-100 dark:border-green-900/40" },
          { label: t.admin.disabled, value: users.filter((u) => u.status === "inactive").length, num: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-900/40" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center shadow-sm`}>
            <div className={`text-3xl font-black ${s.num}`}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.admin.searchUsers}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
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
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="text-gray-900 dark:text-white font-medium">{u.name}</div>
                      <div className="text-gray-400 text-xs">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-medium ${roleColors[u.role]}`}>
                    {u.role === "admin" && <Shield className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{u.listings}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.createdAt}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.status === "active" ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"}`}>
                    {u.status === "active" ? t.admin.active : t.admin.inactive}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          u.status === "active"
                            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            : "text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                        }`}
                      >
                        {u.status === "active"
                          ? <><UserX className="w-3.5 h-3.5" /> {t.admin.block}</>
                          : <><UserCheck className="w-3.5 h-3.5" /> {t.admin.unblock}</>
                        }
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
