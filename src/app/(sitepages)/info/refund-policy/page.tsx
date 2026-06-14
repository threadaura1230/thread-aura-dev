import Link from "next/link";
import { RefreshCw, Sparkles } from "lucide-react";

export const metadata = {
  title: "Refund Policy | Thread-aura",
  description: "Read the Thread-Aura Refund and Return Policy. Learn about return eligibility, exchange procedures, and refund timelines for our handcrafted bangles.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-12">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Refund Policy</span>
        </nav>

        {/* Page Header */}
        <header className="mb-16 border-b border-black/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F3A2A]/5 text-[#0F3A2A] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
            <RefreshCw className="w-3.5 h-3.5 text-[#0f3a2a]" />
            Returns & Exchanges
          </div>
          <h1 className="font-serif text-[36px] md:text-[48px] text-slate-900 leading-tight mb-4">
            Refund Policy
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
            Last Updated: June 14, 2026
          </p>
        </header>

        {/* Content Body */}
        <main className="prose prose-slate max-w-none space-y-10">
          
          <p className="text-slate-700 text-[15px] md:text-[16px] leading-relaxed font-light">
            At Thread-Aura, we want you to love your hand-woven bangles. If you are not completely satisfied with your purchase, please review our refund and return policy below.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              1. Return Eligibility
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We accept returns within <strong>14 days</strong> of the delivery date. To be eligible for a return, your item must be:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-[14px] md:text-[15px] font-light">
              <li>Unused, unworn, and in the same condition that you received it</li>
              <li>In its original packaging, including any tags, pouches, or boxes</li>
              <li>Accompanied by proof of purchase (order number or receipt)</li>
            </ul>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light mt-4">
              Due to the handcrafted nature of our products, items marked as &quot;Final Sale,&quot; custom orders, or personalized pieces are <strong>not eligible</strong> for return or refund unless they arrive damaged or defective.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              2. How to Start a Return
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              To initiate a return, please contact us at <a href="mailto:threadaura1230@gmail.com" className="text-[#0f3a2a] hover:underline font-normal">threadaura1230@gmail.com</a> or 8088183745, 9353752829 with your order number and the reason for your return. We will provide you with instructions on how and where to send your item.
            </p>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light mt-4 font-normal">
              Items returned to us without first requesting a return will not be accepted.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              3. Damaged, Defective, or Incorrect Items
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              If you receive an item that is damaged, defective, or different from what you ordered, please contact us within <strong>48 hours of delivery</strong> with your order number and photos of the item. We will arrange for a replacement, repair, or full refund at no additional cost to you.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              4. Refunds
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original method of payment within <strong>7-10 business days</strong>. Please note that your bank or credit card provider may take additional time to post the refund to your account.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              5. Return Shipping Costs
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Unless the item is damaged, defective, or incorrect, the customer is responsible for return shipping costs. We recommend using a trackable shipping service, as Thread-Aura is not responsible for items lost in transit during a return.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              6. Exchanges
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              If you would like a different size, color, or design, please contact us to arrange an exchange. Exchanges are subject to product availability and must meet the same return eligibility criteria outlined above.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              7. Late or Missing Refunds
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              If you haven&apos;t received a refund after the timeframe noted above, please first check your bank account again, then contact your credit card company, as it may take some time before your refund is officially posted. If you&apos;ve done this and still have not received your refund, please contact us at <a href="mailto:threadaura1230@gmail.com" className="text-[#0f3a2a] hover:underline font-normal">threadaura1230@gmail.com</a>.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              8. Contact Us
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light mb-4">
              For any questions regarding returns, exchanges, or refunds, please reach out to us:
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

        </main>
      </div>
    </div>
  );
}
