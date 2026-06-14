"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { 
  Users, 
  MessageSquare, 
  Settings, 
  TrendingUp, 
  Star,
  CheckCircle,
  Clock,
  Sparkles
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
      color: "from-blue-600 to-indigo-600"
    },
    {
      name: "Total Reviews",
      value: stats.totalTestimonials,
      change: "Submitted reviews list",
      icon: MessageSquare,
      color: "from-purple-600 to-pink-600"
    },
    {
      name: "Avg Rating",
      value: `${stats.averageRating} ★`,
      change: "Stars based on feedback",
      icon: Star,
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "Subscribers",
      value: stats.activeSubscribers,
      change: "+4% from last week",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-900/30 bg-gradient-to-r from-[#140624] to-[#250d42] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Welcome back, Admin <Sparkles className="h-6 w-6 text-[#a356db]" />
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              Monitor user accounts, view submitted testimonials, inspect live platform analytics, and manage application configurations.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 rounded-xl border border-purple-500/30 bg-[#3b1764]/40 hover:bg-[#3b1764]/70 text-xs font-semibold text-white tracking-wide transition-all shadow-lg hover:shadow-purple-500/5 cursor-pointer">
              System Settings
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-[#a356db] hover:bg-[#b26be3] text-xs font-semibold text-white tracking-wide transition-all shadow-lg shadow-purple-500/20 cursor-pointer">
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
              className="relative overflow-hidden rounded-xl border border-purple-900/10 bg-[#150a21] p-5 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {card.name}
                  </p>
                  <h4 className="mt-2 text-2xl font-bold text-white">
                    {card.value}
                  </h4>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-medium">
                  {card.change}
                </span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Testimonials List */}
        <div className="lg:col-span-2 rounded-xl border border-purple-900/10 bg-[#150a21] p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Submitted Testimonials</h2>
              <p className="text-xs text-gray-400">Reviews submitted by your platform users.</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-950/40 border border-purple-900/30 text-[10px] font-bold text-purple-400 uppercase">
              Live updates
            </span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {testimonials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 border border-dashed border-purple-950/40 rounded-xl">
                <MessageSquare className="h-10 w-10 text-purple-900/40 mb-3" />
                <p className="text-xs font-semibold">No submissions recorded yet.</p>
                <p className="text-[10px] text-gray-600 mt-1">User-submitted testimonials will appear here.</p>
              </div>
            ) : (
              testimonials.map((t, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border border-purple-900/20 bg-[#1c0f2b]/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-900/50 flex-shrink-0 overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.seed}&backgroundColor=transparent`} 
                        alt={t.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{t.name}</span>
                        <span className="text-[10px] text-gray-500">({t.role})</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed italic">
                        "{t.text}"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                    <span className="text-xs font-bold text-yellow-400">{t.stars}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="rounded-xl border border-purple-900/10 bg-[#150a21] p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">System Status</h2>
            <p className="text-xs text-gray-400">Health checks and configuration.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c0f2b]/20 border border-purple-900/10">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium text-gray-200">Database Connection</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Online</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c0f2b]/20 border border-purple-900/10">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium text-gray-200">Storage Service</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#1c0f2b]/20 border border-purple-900/10">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium text-gray-200">Task Scheduler</span>
              </div>
              <span className="text-[10px] font-bold text-yellow-400 uppercase">Idle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
