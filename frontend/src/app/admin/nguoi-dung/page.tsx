"use client";
import { useState } from "react";
import { Search, Shield, UserCheck, UserX } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { getT } from "@/i18n";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "user";
  status: "active" | "inactive";
  createdAt: string;
  listings: number;
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
    setUsers((prev) =>
      prev.map((u) => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)
    );
  }

  const roleColors: Record<string, string> = {
    admin: "bg-red-900/50 text-red-400",
    agent: "bg-blue-900/50 text-blue-400",
    user: "bg-gray-800 text-gray-400",
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-white">{t.admin.users}</h1>
        <p className="text-gray-400 mt-1">{users.length} {t.admin.usersLabel}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t.admin.total, value: users.length, color: "text-white" },
          { label: t.admin.activeUsers, value: users.filter((u) => u.status === "active").length, color: "text-green-400" },
          { label: t.admin.disabled, value: users.filter((u) => u.status === "inactive").length, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.admin.searchUsers}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3">{t.admin.userAccount}</th>
              <th className="text-left px-4 py-3">{t.admin.role}</th>
              <th className="text-left px-4 py-3">{t.admin.listings}</th>
              <th className="text-left px-4 py-3">{t.admin.joined}</th>
              <th className="text-left px-4 py-3">{t.admin.status}</th>
              <th className="text-right px-4 py-3">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium">{u.name}</div>
                      <div className="text-gray-500 text-xs">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${roleColors[u.role]}`}>
                    {u.role === "admin" && <Shield className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">{u.listings}</td>
                <td className="px-4 py-3 text-gray-400">{u.createdAt}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
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
                            ? "text-red-400 hover:bg-red-400/10"
                            : "text-green-400 hover:bg-green-400/10"
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
