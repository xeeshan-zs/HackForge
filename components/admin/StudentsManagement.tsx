"use client";

import { useState, useEffect } from "react";
import { getAllRegistrations, getAdminCategories, updateRegistrationStatus } from "@/lib/firestore";
import { Category, RegistrationRecord } from "@/types";
import { GlassyCard, GlassyButton, GlassySelect, PremiumModal } from "@/components/ui/PremiumComponents";
import toast from "react-hot-toast";

export default function StudentsManagement() {
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [regsData, catsData] = await Promise.all([
        getAllRegistrations(),
        getAdminCategories(),
      ]);
      setRegistrations(regsData);
      setCategories(catsData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRegs = registrations.filter((reg) => {
    if (selectedCategory !== "all" && reg.category !== selectedCategory) return false;
    if (selectedStatus !== "all" && reg.status !== selectedStatus) return false;
    return true;
  });

  const paginatedRegs = filteredRegs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRegs.length / itemsPerPage);

  const handleDownloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "University",
      "Category",
      "Team Name",
      "Team Members",
      "Status",
      "Registration Date",
    ];

    const rows = filteredRegs.map((reg) => [
      reg.fullName,
      reg.email,
      reg.phone,
      reg.university,
      reg.category,
      reg.teamName || "N/A",
      reg.members.map((m) => m.name).join("; "),
      reg.status,
      new Date(reg.createdAt as any).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleViewDetails = (reg: RegistrationRecord) => {
    setSelectedReg(reg);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (status: any) => {
    if (!selectedReg) return;
    try {
      await updateRegistrationStatus(selectedReg.id, status);
      toast.success("Status updated successfully");
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return <div className="text-center text-white/60 py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Registered Students</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassySelect
          label="Filter by Category"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "all", label: "All Categories" },
            ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
          ]}
        />
        <GlassySelect
          label="Filter by Status"
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
        <div className="flex items-end">
          <GlassyButton onClick={handleDownloadCSV} className="w-full">
            📥 Download CSV
          </GlassyButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassyCard variant="subtle">
          <p className="text-white/60 text-sm">Total Registrations</p>
          <p className="text-2xl font-bold text-white">{filteredRegs.length}</p>
        </GlassyCard>
        <GlassyCard variant="subtle">
          <p className="text-white/60 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">
            {filteredRegs.filter((r) => r.status === "pending").length}
          </p>
        </GlassyCard>
        <GlassyCard variant="subtle">
          <p className="text-white/60 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-green-400">
            {filteredRegs.filter((r) => r.status === "confirmed").length}
          </p>
        </GlassyCard>
        <GlassyCard variant="subtle">
          <p className="text-white/60 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-400">
            {filteredRegs.filter((r) => r.status === "rejected").length}
          </p>
        </GlassyCard>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-white/80 text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">University</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRegs.map((reg) => (
              <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">{reg.fullName}</td>
                <td className="py-3 px-4 text-white/60">{reg.email}</td>
                <td className="py-3 px-4">{reg.category}</td>
                <td className="py-3 px-4">{reg.university}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      reg.status === "confirmed"
                        ? "bg-green-500/20 text-green-300"
                        : reg.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {reg.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-white/60">
                  {new Date(reg.createdAt as any).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <GlassyButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewDetails(reg)}
                  >
                    View
                  </GlassyButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <GlassyButton
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </GlassyButton>
          <span className="text-white/60 flex items-center px-4">
            Page {currentPage} of {totalPages}
          </span>
          <GlassyButton
            variant="secondary"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </GlassyButton>
        </div>
      )}

      {/* Details Modal */}
      <PremiumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registration Details"
      >
        {selectedReg && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
              <div>
                <p className="text-white/60">Full Name</p>
                <p className="font-semibold">{selectedReg.fullName}</p>
              </div>
              <div>
                <p className="text-white/60">Email</p>
                <p className="font-semibold">{selectedReg.email}</p>
              </div>
              <div>
                <p className="text-white/60">Phone</p>
                <p className="font-semibold">{selectedReg.phone}</p>
              </div>
              <div>
                <p className="text-white/60">University</p>
                <p className="font-semibold">{selectedReg.university}</p>
              </div>
              <div>
                <p className="text-white/60">Category</p>
                <p className="font-semibold">{selectedReg.category}</p>
              </div>
              <div>
                <p className="text-white/60">Team Size</p>
                <p className="font-semibold">{selectedReg.teamSize}</p>
              </div>
            </div>

            {selectedReg.teamName && (
              <div>
                <p className="text-white/60 text-sm">Team Name</p>
                <p className="text-white font-semibold">{selectedReg.teamName}</p>
              </div>
            )}

            {selectedReg.members.length > 0 && (
              <div>
                <p className="text-white/60 text-sm mb-2">Team Members</p>
                <div className="space-y-2">
                  {selectedReg.members.map((member, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-2">
                      <p className="text-white font-semibold">{member.name}</p>
                      <p className="text-white/60 text-sm">{member.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReg.projectIdea && (
              <div>
                <p className="text-white/60 text-sm">Project Idea</p>
                <p className="text-white">{selectedReg.projectIdea}</p>
              </div>
            )}

            {selectedReg.paymentScreenshotUrl && (
              <div>
                <p className="text-white/60 text-sm mb-2">Payment Screenshot</p>
                <a
                  href={selectedReg.paymentScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View Screenshot
                </a>
              </div>
            )}

            <div>
              <p className="text-white/60 text-sm mb-2">Status</p>
              <div className="flex gap-2">
                <GlassyButton
                  size="sm"
                  onClick={() => handleStatusUpdate("confirmed")}
                  className="flex-1"
                >
                  ✓ Confirm
                </GlassyButton>
                <GlassyButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate("rejected")}
                  className="flex-1 text-red-400 border-red-400/30"
                >
                  ✗ Reject
                </GlassyButton>
              </div>
            </div>
          </div>
        )}
      </PremiumModal>
    </div>
  );
}
