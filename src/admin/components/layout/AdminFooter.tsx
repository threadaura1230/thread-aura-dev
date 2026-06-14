"use client";

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-6 border-t border-purple-900/10 bg-[#0e0416]/50 backdrop-blur-sm text-center">
      <p className="text-[11px] text-gray-500 tracking-wider">
        &copy; {currentYear} enteropia Admin Console. All rights reserved.
      </p>
    </footer>
  );
}
