"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAdmin } from "@/lib/auth";
import { GlassyButton } from "@/components/ui/PremiumComponents";

const adminMenuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "Categories", href: "/admin/categories", icon: "📂" },
  { label: "Timeline", href: "/admin/timeline", icon: "📅" },
  { label: "Contact Info", href: "/admin/contact", icon: "📞" },
  { label: "Prizes", href: "/admin/prizes", icon: "🏆" },
  { label: "Payment Methods", href: "/admin/payments", icon: "💳" },
  { label: "Students", href: "/admin/students", icon: "👥" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOutAdmin();
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-950 border-r border-white/10 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          HackForge
        </h1>
        <p className="text-sm text-white/60 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {adminMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-blue-500/30 border border-blue-500/50 text-blue-300"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <GlassyButton
          variant="outline"
          size="md"
          className="w-full"
          onClick={handleLogout}
        >
          Logout
        </GlassyButton>
      </div>
    </aside>
  );
}
