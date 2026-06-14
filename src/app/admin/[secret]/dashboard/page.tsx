"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Star,
  CheckCircle,
  Clock,
  Package,
  ArrowUpRight
} from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  stars: number;
  seed: string;
  createdAt?: string;
}

export default function AdminDashboardPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 124,
    totalTestimonials: 0,
    averageRating: 0.0,
    activeSubscribers: 89,
  });

  useEffect(() => {
    // Load testimonials from localStorage to show in dashboard
    try {
      const stored = localStorage.getItem("purpi_testimonials");
      if (stored) {
        const list: Testimonial[] = JSON.parse(stored);
        setTestimonials(list);
        
        // Calculate average stars
        const totalStars = list.reduce((sum, item) => sum + item.stars, 0);
        const avg = list.length > 0 ? (totalStars / list.length).toFixed(1) : "0.0";

        setStats(prev => ({
          ...prev,
          totalTestimonials: list.length,
          averageRating: parseFloat(avg)
        }));
      }
    } catch (err) {
      console.error("Failed to load testimonials for dashboard stats:", err);
    }
  }, []);

  const statCards = [
    {
      name: "Total Users",
      value: stats.totalUsers,
      change: "+12% from last month",
      icon: Users,
      iconBg: "bg-[#073623]",
    },
    {
      name: "Total Reviews",
      value: stats.totalTestimonials,
      change: "Submitted reviews list",
      icon: MessageSquare,
      iconBg: "bg-[#8b926d]",
    },
    {
      name: "Avg Rating",
      value: `${stats.averageRating} ★`,
      change: "Stars based on feedback",
      icon: Star,
      iconBg: "bg-[#883d11]",
    },
    {
      name: "Subscribers",
      value: stats.activeSubscribers,
      change: "+4% from last week",
      icon: TrendingUp,
      iconBg: "bg-[#134A31]",
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#073623]/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8b926d]/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-serif text-[28px] md:text-[32px] font-medium text-[#0f3a2a] tracking-tight flex items-center gap-3">
              Welcome back, Admin
              <Package className="h-6 w-6 text-[#8b926d]" />
            </h1>
            <p className="text-[13px] text-slate-500 max-w-xl leading-relaxed">
              Monitor your store, view submitted testimonials, inspect live platform analytics, and manage your product catalog.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 rounded-lg border border-black/[0.08] bg-[#F1EFE7] hover:bg-[#e8e6df] text-[12px] font-medium text-slate-700 tracking-wide transition-all cursor-pointer">
              System Settings
            </button>
            <button className="px-4 py-2.5 rounded-lg bg-[#073623] hover:bg-[#0c4a31] text-[12px] font-medium text-white tracking-wide transition-all shadow-sm cursor-pointer">
              View Log History
            </button>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {card.name}
                  </p>
                  <h4 className="mt-2 text-[26px] font-bold text-slate-800 font-sans">
                    {card.value}
                  </h4>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg} text-white shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  {card.change}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#073623] font-semibold">
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Testimonials List */}
        <div className="lg:col-span-2 rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-[18px] font-medium text-slate-800">Submitted Testimonials</h2>
              <p className="text-[12px] text-slate-400 mt-0.5">Reviews submitted by your platform users.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#073623]/[0.06] border border-[#073623]/15 text-[10px] font-bold text-[#073623] uppercase tracking-wide">
              Live updates
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {testimonials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 border border-dashed border-black/[0.08] rounded-xl bg-[#F1EFE7]/40">
                <MessageSquare className="h-10 w-10 text-slate-300 mb-3" />
                <p className="text-[12px] font-semibold text-slate-500">No submissions recorded yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">User-submitted testimonials will appear here.</p>
              </div>
            ) : (
              testimonials.map((t, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border border-black/[0.05] bg-[#FDFBF7] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#073623]/10 flex-shrink-0 overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.seed}&backgroundColor=transparent`} 
                        alt={t.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold text-slate-800">{t.name}</span>
                        <span className="text-[10px] text-slate-400">({t.role})</span>
                      </div>
                      <p className="text-[12px] text-slate-600 leading-relaxed italic">
                        &quot;{t.text}&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#883d11]/[0.08] px-2.5 py-1 rounded-full border border-[#883d11]/15">
                    <span className="text-[12px] font-bold text-[#883d11]">{t.stars}</span>
                    <Star className="h-3 w-3 text-[#883d11] fill-[#883d11]" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Status panel */}
        <div className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-[18px] font-medium text-slate-800">System Status</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Health checks and configuration.</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F1EFE7]/60 border border-black/[0.04]">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-[#073623]" />
                <span className="text-[12px] font-medium text-slate-700">Database Connection</span>
              </div>
              <span className="text-[10px] font-bold text-[#073623] uppercase tracking-wide">Online</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F1EFE7]/60 border border-black/[0.04]">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-[#073623]" />
                <span className="text-[12px] font-medium text-slate-700">Storage Service</span>
              </div>
              <span className="text-[10px] font-bold text-[#073623] uppercase tracking-wide">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#F1EFE7]/60 border border-black/[0.04]">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[#883d11]" />
                <span className="text-[12px] font-medium text-slate-700">Task Scheduler</span>
              </div>
              <span className="text-[10px] font-bold text-[#883d11] uppercase tracking-wide">Idle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
