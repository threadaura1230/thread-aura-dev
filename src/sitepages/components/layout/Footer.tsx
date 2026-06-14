import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#8b926d] text-[#fbfbfb] py-16 md:py-24 px-6 md:px-12 w-full">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

          {/* Column 1: Brand */}
          <div className="flex flex-col">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="44" cy="71" r="34" fill="none" stroke="#0f3a2a" strokeWidth="3.5" />
                <circle cx="76" cy="71" r="34" fill="none" stroke="#d4af37" strokeWidth="3.5" />
                <circle cx="60" cy="49" r="34" fill="none" stroke="#134a31" strokeWidth="3.5" />
              </svg>
            </div>
            <h2 className="font-serif text-[36px] md:text-[44px] leading-tight font-medium tracking-wide">
              Thread<br />Aura
            </h2>
          </div>


          {/* Column 2: Contact Info */}
          <div className="text-[13px] md:text-[14px] font-light leading-[1.8] space-y-6">
            <div>
              <p>8088183745, 9353752829</p>
              <p>threadaura1230@gmail.com</p>
            </div>
            <div>
              <p>500 Silk Weaver St.</p>
              <p>New York, NY</p>
              <p>10001</p>
            </div>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0h.003z" /></svg>
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>

          {/* Column 3: Links */}
          <div className="flex flex-col space-y-3 text-[13px] md:text-[14px] font-light">
            <Link href="/info/privacy-policy" className="hover:opacity-70 transition-opacity w-fit">Privacy Policy</Link>
            <Link href="/info/accessibility-statement" className="hover:opacity-70 transition-opacity w-fit">Accessibility Statement</Link>
            <Link href="/info/shipping-policy" className="hover:opacity-70 transition-opacity w-fit">Shipping Policy</Link>
            <Link href="/info/terms" className="hover:opacity-70 transition-opacity w-fit">Terms & Conditions</Link>
            <Link href="/info/refund-policy" className="hover:opacity-70 transition-opacity w-fit">Refund Policy</Link>
          </div>

          {/* Column 4: Community Button */}
          <div>
            <h3 className="text-[15px] md:text-[16px] font-medium mb-6">Explore More</h3>
            <p className="text-[13px] font-light mb-6 leading-relaxed opacity-90">
              Join our exclusive WhatsApp community for early access to new collections and bespoke artisan stories.
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center w-full bg-[#FFFBE4] text-[#0A1310] py-4 px-6 text-[13px] font-medium hover:bg-[#f2ead3] transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Join WhatsApp Community
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-[11px] md:text-[12px] font-light opacity-80 mt-16 md:mt-24">
          <p>© {new Date().getFullYear()} by Thread-aura. Crafted with elegance.</p>
        </div>
      </div>
    </footer>
  );
}
