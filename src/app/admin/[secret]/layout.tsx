// src/app/admin/layout.tsx
"use client";

export const dynamic = "force-dynamic";

import { ReactNode, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminHeader from "@/admin/components/layout/AdminHeader";
import AdminFooter from "@/admin/components/layout/AdminFooter";
import Sidebar from "@/admin/components/layout/AdminSidebar";
import AdminMobileMenu from "@/admin/components/layout/AdminMobileMenu";
import LoadingSpinner from "@/admin/components/layout/LoadingSpinner";

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ secret: string }>;
}

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [secret, setSecret] = useState<string>("");

  useEffect(() => {
    params.then(p => {
      setSecret(p.secret);
      checkAuth(p.secret);
    });
  }, [params]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        const saved = localStorage.getItem("admin-sidebar-open");
        setSidebarOpen(saved !== null ? saved === "true" : true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobile, sidebarOpen]);

  const checkAuth = async (slug: string) => {
    try {
      const res = await fetch("/api/admin/verify", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();

      if (data.authenticated) {
        setAuthenticated(true);
        setLoading(false);
      } else {
        setAuthenticated(false);
        setLoading(false);
        // Only redirect if not already on login page
        if (!pathname.includes("/login")) {
          router.push(`/admin/${slug}/login`);
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthenticated(false);
      setLoading(false);
      if (!pathname.includes("/login")) {
        router.push(`/admin/${slug}/login`);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setAuthenticated(false);
      router.push(`/admin/${secret}/login`);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    if (!isMobile) {
      localStorage.setItem("admin-sidebar-open", String(next));
    }
  };

  // Don't show loading for login page
  if (pathname === `/admin/${secret}/login`) {
    return <>{children}</>;
  }

  // Single unified loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Don't render anything if not authenticated (router will redirect)
  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#140620] text-white">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
      />

      <AdminMobileMenu
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        onLogout={handleLogout}
      />

      <div
        className={`
          flex min-h-screen flex-col
          transition-all duration-200 ease-in-out
          ${!isMobile && sidebarOpen ? "lg:pl-64" : "lg:pl-0"}
        `}
      >
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}