import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Thread-aura",
  description: "Read the Thread-Aura Terms & Conditions. Learn about eligibility, products and pricing, payment terms, user conduct, and our governing law.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-12">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Terms & Conditions</span>
        </nav>

        {/* Page Header */}
        <header className="mb-16 border-b border-black/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F3A2A]/5 text-[#0F3A2A] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
            <FileText className="w-3.5 h-3.5 text-[#0f3a2a]" />
            Legal Agreement
          </div>
          <h1 className="font-serif text-[36px] md:text-[48px] text-slate-900 leading-tight mb-4">
            Terms & Conditions
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
            Last Updated: June 14, 2026
          </p>
        </header>

        {/* Content Body */}
        <main className="prose prose-slate max-w-none space-y-10">
          
          <p className="text-slate-700 text-[15px] md:text-[16px] leading-relaxed font-light">
            Welcome to Thread-Aura. These Terms & Conditions (&quot;Terms&quot;) govern your access to and use of the <a href="https://threadaura.com" className="text-[#0f3a2a] hover:underline font-normal">threadaura.com</a> website (the &quot;Site&quot;) and any purchases made through it. By accessing or using our Site, you agree to be bound by these Terms. If you do not agree, please do not use our Site.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              1. About Us
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light mb-4">
              Thread-Aura is an artisanal brand specializing in hand-woven luxury bangles crafted from Mulberry silk and Giza cotton threads.
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
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              2. Eligibility
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              By using our Site, you represent that you are at least 18 years old, or that you are using the Site under the supervision of a parent or legal guardian.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              3. Products and Pricing
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We strive to display our products and their colors, details, and pricing as accurately as possible. However, we do not guarantee that your device&apos;s display will accurately reflect the actual color or details of any product, as each piece is handcrafted and may have slight natural variations. Prices are subject to change without notice. We reserve the right to limit quantities, refuse orders, or discontinue any product at any time.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              4. Orders and Payment
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              By placing an order, you confirm that the information you provide is accurate and complete. We reserve the right to refuse or cancel any order for reasons including, but not limited to, product availability, errors in pricing or product information, or suspected fraudulent activity. Payments are processed securely through third-party payment processors, and we do not store your full payment card details.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              5. Intellectual Property
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              All content on this Site, including text, graphics, logos, images, product designs, and the overall look and feel of the Site, is the property of Thread-Aura or its licensors and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on this Site without our prior written consent.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              6. User Conduct
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              When using our Site, you agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-[14px] md:text-[15px] font-light">
              <li>Use the Site for any unlawful purpose or in violation of these Terms</li>
              <li>Attempt to gain unauthorized access to any portion of the Site or its related systems</li>
              <li>Interfere with or disrupt the operation of the Site</li>
              <li>Submit false, misleading, or fraudulent information</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              7. Third-Party Links and Services
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Our Site may contain links to third-party websites or services, including our WhatsApp community, which are not owned or controlled by Thread-Aura. We are not responsible for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              8. Limitation of Liability
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              To the fullest extent permitted by law, Thread-Aura shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Site or any products purchased through it.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              9. Disclaimer of Warranties
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              The Site and all products are provided on an &quot;as is&quot; and &quot;as available&quot; basis. Thread-Aura makes no warranties, express or implied, regarding the operation of the Site or the accuracy, reliability, or completeness of its content.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              10. Governing Law
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              11. Changes to These Terms
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Site after any changes constitutes your acceptance of the revised Terms.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              12. Contact Us
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:threadaura1230@gmail.com" className="text-[#0f3a2a] hover:underline">threadaura1230@gmail.com</a> or 8088183745, 9353752829.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}
