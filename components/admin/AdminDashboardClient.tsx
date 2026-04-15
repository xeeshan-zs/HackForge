"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOutAdmin } from "@/lib/auth";
import { canInitializeFirebase } from "@/lib/firebase";
import {
  getAllRegistrations,
  isAdminEmail,
  updateRegistrationStatus,
} from "@/lib/firestore";
import { RegistrationRecord, RegistrationStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PAGE_SIZE = 20;
const statusList: RegistrationStatus[] = ["pending", "confirmed", "rejected"];

function csvEscape(value: unknown) {
  const str = String(value ?? "");
  return `"${str.replaceAll('"', '""')}"`;
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<RegistrationRecord[]>([]);
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<RegistrationRecord | null>(null);

  useEffect(() => {
    async function boot() {
      if (loading) return;
      if (!canInitializeFirebase()) {
        router.replace("/admin/login?error=unauthorized");
        return;
      }
      if (!user?.email) {
        router.replace("/admin/login");
        return;
      }

      const allowed = await isAdminEmail(user.email);
      if (!allowed) {
        await signOutAdmin();
        router.replace("/admin/login?error=unauthorized");
        return;
      }

      const data = await getAllRegistrations();
      setRows(data.sort((a, b) => (String(b.createdAt ?? "") > String(a.createdAt ?? "") ? 1 : -1)));
    }
    boot();
  }, [user, loading, router]);

  const stats = useMemo(() => {
    const total = rows.length;
    const confirmed = rows.filter((r) => r.status === "confirmed").length;
    const pending = rows.filter((r) => r.status === "pending").length;
    const rejected = rows.filter((r) => r.status === "rejected").length;
    return { total, confirmed, pending, rejected };
  }, [rows]);

  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((row) => {
      map.set(row.category, (map.get(row.category) ?? 0) + 1);
    });
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [rows]);

  const universityData = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((row) => {
      map.set(row.university, (map.get(row.university) ?? 0) + 1);
    });
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [rows]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pagedRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function onStatusChange(id: string, status: RegistrationStatus) {
    await updateRegistrationStatus(id, status);
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
  }

  function exportCsv() {
    const header = [
      "#",
      "Name",
      "University",
      "Category",
      "Team Name",
      "Date",
      "Status",
      "Email",
      "Phone",
      "Student ID",
      "WhatsApp",
      "Project Idea",
    ];
    const body = rows.map((r, i) => [
      i + 1,
      r.fullName,
      r.university,
      r.category,
      r.teamName ?? "",
      String(r.createdAt ?? ""),
      r.status,
      r.email,
      r.phone,
      r.studentId,
      r.whatsapp ?? "",
      r.projectIdea ?? "",
    ]);
    const csv = [header, ...body].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hackforge-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading || !user) {
    return (
      <div className="section-container">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <section className="section-container">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">HackForge Admin</h1>
        <div className="flex gap-3">
          <button type="button" className="secondary-btn" onClick={exportCsv}>
            Export CSV
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={async () => {
              await signOutAdmin();
              router.replace("/admin/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total Registrations" value={stats.total} />
        <StatCard label="Confirmed" value={stats.confirmed} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="card-surface h-80 rounded-lg p-4">
          <h2 className="mb-3 text-sm text-[var(--color-muted)]">Registrations by Category</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100}>
                {categoryData.map((_, idx) => (
                  <Cell
                    key={`c-${idx}`}
                    fill={idx % 2 ? "var(--color-gold)" : "var(--color-primary)"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card-surface h-80 rounded-lg p-4">
          <h2 className="mb-3 text-sm text-[var(--color-muted)]">Top Universities</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={universityData}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--color-primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-surface mt-6 overflow-x-auto rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
            <tr>
              {["#", "Name", "University", "Category", "Team", "Date", "Status", "Actions"].map(
                (head) => (
                  <th key={head} className="px-3 py-3 font-medium">
                    {head}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {pagedRows.map((row, idx) => (
              <tr key={row.id} className="border-b border-[var(--color-border)]/50">
                <td className="px-3 py-3">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td className="px-3 py-3">{row.fullName}</td>
                <td className="px-3 py-3">{row.university}</td>
                <td className="px-3 py-3">{row.category}</td>
                <td className="px-3 py-3">{row.teamName || "—"}</td>
                <td className="px-3 py-3">{String(row.createdAt ?? "—")}</td>
                <td className="px-3 py-3">
                  <select
                    value={row.status}
                    onChange={(e) =>
                      onStatusChange(row.id, e.target.value as RegistrationStatus)
                    }
                    className="rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] px-2 py-1 text-xs"
                  >
                    {statusList.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <button type="button" className="secondary-btn px-3 py-1 text-xs" onClick={() => setActive(row)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          className="secondary-btn px-3 py-2 text-xs"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-sm text-[var(--color-muted)]">
          Page {page} / {pageCount}
        </span>
        <button
          type="button"
          className="secondary-btn px-3 py-2 text-xs"
          disabled={page === pageCount}
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        >
          Next
        </button>
      </div>

      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card-surface max-h-[85vh] w-full max-w-2xl overflow-auto rounded-lg bg-[var(--color-surface-2)] p-6">
            <h3 className="font-display text-2xl">{active.fullName}</h3>
            <div className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
              <p>Email: {active.email}</p>
              <p>Phone: {active.phone}</p>
              <p>University: {active.university}</p>
              <p>Category: {active.category}</p>
              <p>Student ID: {active.studentId}</p>
              <p>Team Name: {active.teamName || "—"}</p>
              <p>Team Size: {active.teamSize}</p>
              <p>WhatsApp: {active.whatsapp || "—"}</p>
              <p>Idea: {active.projectIdea || "—"}</p>
              <p>Members: {active.members?.length ? active.members.map((m) => `${m.name} (${m.email})`).join(", ") : "—"}</p>
              <p>Status: {active.status}</p>
            </div>
            <button type="button" className="primary-btn mt-5" onClick={() => setActive(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-surface rounded-lg p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">{label}</p>
      <p className="font-display mt-2 text-3xl text-[var(--color-primary)]">{value}</p>
    </div>
  );
}
