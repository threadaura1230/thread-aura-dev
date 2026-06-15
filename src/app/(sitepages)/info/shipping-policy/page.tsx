import Link from "next/link";
import { Truck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | Thread-aura",
  description: "Read the Thread-Aura Shipping Policy. Learn about order processing times, shipping rates, carrier options, and tracking details for our handcrafted bangles.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-12">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Shipping Policy</span>
        </nav>

        {/* Page Header */}
        <header className="mb-16 border-b border-black/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F3A2A]/5 text-[#0F3A2A] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
            <Truck className="w-3.5 h-3.5 text-[#0f3a2a]" />
            Delivery Details
          </div>
          <h1 className="font-serif text-[36px] md:text-[48px] text-slate-900 leading-tight mb-4">
            Shipping Policy
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
            Last Updated: June 14, 2026
          </p>
        </header>

        {/* Content Body */}
        <main className="prose prose-slate max-w-none space-y-10">
          
          <p className="text-slate-700 text-[15px] md:text-[16px] leading-relaxed font-light">
            Thank you for shopping at Thread-Aura. This Shipping Policy outlines how we process, package, and deliver our handcrafted bangles to you.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              1. Processing Time
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Each Thread-Aura piece is hand-woven to order or carefully inspected before dispatch. Please allow <strong>2-5 business days</strong> for your order to be processed and prepared for shipment, in addition to the delivery time below. During peak seasons or sale periods, processing times may be slightly longer, and we will notify you of any significant delays.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              2. Shipping Rates and Delivery Times
            </h2>
            
            {/* Styled Table */}
            <div className="overflow-x-auto rounded-xl border border-black/5 bg-white shadow-sm mt-4">
              <table className="w-full text-left text-[13px] md:text-[14px] border-collapse">
                <thead>
                  <tr className="bg-[#0F3A2A]/5 text-slate-800 border-b border-black/5">
                    <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-[#0f3a2a]">Shipping Method</th>
                    <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-[#0f3a2a]">Estimated Delivery Time</th>
                    <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-[#0f3a2a] text-right">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-slate-600 font-light">
                  <tr>
                    <td className="px-4 py-3.5 font-medium text-slate-800">Standard Shipping (Domestic)</td>
                    <td className="px-4 py-3.5">5-7 business days</td>
                    <td className="px-4 py-3.5 text-right font-medium text-[#0f3a2a]">Calculated at checkout</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-medium text-slate-800">Expedited Shipping (Domestic)</td>
                    <td className="px-4 py-3.5">2-3 business days</td>
                    <td className="px-4 py-3.5 text-right font-medium text-[#0f3a2a]">Calculated at checkout</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-medium text-slate-800">International Shipping</td>
                    <td className="px-4 py-3.5">7-21 business days</td>
                    <td className="px-4 py-3.5 text-right font-medium text-[#0f3a2a]">Calculated at checkout</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-slate-500 text-[12px] italic leading-relaxed mt-4">
              Delivery times are estimates provided by our shipping carriers and are not guaranteed. Delays may occur due to weather, customs processing, holidays, or carrier disruptions beyond our control.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              3. Order Tracking
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Once your order has shipped, you will receive a confirmation email with a tracking number so you can monitor your package&apos;s progress.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              4. International Orders
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              For international orders, please note that you may be responsible for duties, taxes, and customs fees imposed by your country. These charges are not included in the item price or shipping cost and are the responsibility of the customer. We recommend checking with your local customs office for more information prior to placing your order.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              5. Shipping Address
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Please ensure your shipping address is accurate and complete at checkout. Thread-Aura is not responsible for orders shipped to an incorrect address provided by the customer. If you need to correct an address, please contact us as soon as possible after placing your order, as we may not be able to make changes once an order has been processed.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              6. Lost, Stolen, or Damaged Packages
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Thread-Aura is not liable for packages that are lost, stolen, or damaged during transit once marked as delivered by the carrier. If your package arrives damaged or you believe it has been lost or stolen, please contact us within 48 hours of the delivery date (or expected delivery date) so we can assist you in filing a claim with the carrier.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              7. Contact Us
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light mb-4">
              If you have any questions about your order or this Shipping Policy, please reach out to us:
            </p>
            
            <div className="p-6 md:p-8 bg-white border border-black/[0.04] rounded-2xl shadow-sm space-y-4 text-slate-700 text-[14px] md:text-[15px]">
              <h3 className="font-serif text-[18px] text-[#0f3a2a] font-bold">
                Thread Aura
              </h3>
              <div className="w-8 h-[1px] bg-[#0f3a2a] my-2"></div>
              <p className="font-light">
                Near PES university,<br />
                Ring Road campus, hoskerehally,<br />
                Bengaluru 570085
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
