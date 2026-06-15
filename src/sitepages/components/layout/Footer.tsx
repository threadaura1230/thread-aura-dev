import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#383d25] text-[#fbfbfb] py-16 md:py-24 px-6 md:px-12 w-full">
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
              <p>Near PES university,</p>
              <p>Ring Road campus, hoskerehally,</p>
              <p>Bengaluru 570085</p>
            </div>
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="https://www.instagram.com/thread._.aura?igsh=dXRwdjRzNXhrMG10" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
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
