"use client";

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 px-6 border-t border-black/[0.06] bg-[#8b926d] text-center">
      <p className="text-[11px] text-white/80 tracking-wider font-light">
        &copy; {currentYear} Thread-aura Admin Console. Crafted with elegance.
      </p>
    </footer>
  );
}
