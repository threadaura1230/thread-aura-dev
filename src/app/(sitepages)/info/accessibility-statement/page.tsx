import Link from "next/link";
import { Accessibility, Sparkles } from "lucide-react";

export const metadata = {
  title: "Accessibility Statement | Thread-aura",
  description: "Thread-Aura is committed to digital accessibility. Read our accessibility statement to learn about our features and ongoing efforts.",
};

export default function AccessibilityStatementPage() {
  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-12">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Accessibility Statement</span>
        </nav>

        {/* Page Header */}
        <header className="mb-16 border-b border-black/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F3A2A]/5 text-[#0F3A2A] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
            <Accessibility className="w-3.5 h-3.5 text-[#0f3a2a]" />
            Universal Access
          </div>
          <h1 className="font-serif text-[36px] md:text-[48px] text-slate-900 leading-tight mb-4">
            Accessibility Statement
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
            Last Updated: June 14, 2026
          </p>
        </header>

        {/* Content Body */}
        <main className="prose prose-slate max-w-none space-y-10">
          
          <p className="text-slate-700 text-[15px] md:text-[16px] leading-relaxed font-light">
            Thread-Aura is committed to ensuring digital accessibility for all visitors, including people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to make our Site accessible and easy to use.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              1. Our Commitment
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We strive to ensure that our website conforms to the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, as a benchmark for accessibility. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              2. Accessibility Features
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We aim to provide:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-[14px] md:text-[15px] font-light">
              <li>Clear and consistent navigation throughout the Site</li>
              <li>Descriptive alternative text for images</li>
              <li>Sufficient color contrast between text and background</li>
              <li>Resizable text that does not break the layout</li>
              <li>Keyboard-navigable menus and interactive elements</li>
              <li>Compatibility with screen readers and other assistive technologies</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              3. Ongoing Efforts
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Accessibility is an ongoing effort. We regularly review our Site to identify and address accessibility barriers, and we are working to ensure that any new content and features we add meet our accessibility standards.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              4. Known Limitations
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Despite our best efforts, some parts of our Site may not yet be fully accessible. This may include third-party content, embedded tools, or older pages that have not yet been updated. We are actively working to resolve these issues.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              5. Feedback and Assistance
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light mb-4">
              We welcome your feedback on the accessibility of the Thread-Aura website. If you encounter any barriers or have suggestions for improvement, or if you need assistance accessing any content or completing a purchase, please contact us:
            </p>
            
            <div className="p-6 md:p-8 bg-white border border-black/[0.04] rounded-2xl shadow-sm space-y-4 text-slate-700 text-[14px] md:text-[15px]">
              <h3 className="font-serif text-[18px] text-[#0f3a2a] font-bold">
                Thread Aura
              </h3>
              <div className="w-8 h-[1px] bg-[#0f3a2a] my-2"></div>
              <p className="font-light">
                500 Silk Weaver St.<br />
                New York, NY 10001
              </p>
              <div className="space-y-1 pt-2 border-t border-black/5">
                <p className="font-light">
                  <span className="font-medium text-slate-900">Phone:</span> 8088183745, 9353752829
                </p>
                <p className="font-light">
                  <span className="font-medium text-slate-900">Email:</span> <a href="mailto:threadaura1230@gmail.com" className="text-[#0f3a2a] hover:underline">threadaura1230@gmail.com</a>
                </p>
              </div>
            </div>

            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light mt-4">
              We try to respond to accessibility feedback as quickly as possible and will work with you to provide the information, item, or transaction you seek through an alternative communication method if needed.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              6. Alternative Methods of Access
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              If you experience difficulty using any part of our Site, including browsing our collections, placing an order, or accessing our policies, we are happy to assist you directly by phone or email so you can complete your purchase or request.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}
