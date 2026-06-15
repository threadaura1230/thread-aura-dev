import Link from "next/link";
import { Shield, Sparkles } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Thread-aura",
  description: "Thread-Aura respects your privacy. Read our Privacy Policy to understand how we collect, use, and safeguard your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-12">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <header className="mb-16 border-b border-black/10 pb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F3A2A]/5 text-[#0F3A2A] rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5 text-[#0f3a2a]" />
            Privacy Protection
          </div>
          <h1 className="font-serif text-[36px] md:text-[48px] text-slate-900 leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
            Last Updated: June 14, 2026
          </p>
        </header>

        {/* Content Body */}
        <main className="prose prose-slate max-w-none space-y-10">
          
          <p className="text-slate-700 text-[15px] md:text-[16px] leading-relaxed font-light">
            Thread-Aura (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://threadaura.com" className="text-[#0f3a2a] hover:underline font-normal">threadaura.com</a> (the &quot;Site&quot;) or make a purchase from us.
          </p>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              1. Information We Collect
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We collect information that you provide directly to us, as well as information collected automatically when you use our Site.
            </p>
            
            <div className="space-y-3 mt-4">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-slate-800">
                Information You Provide to Us
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 text-[14px] md:text-[15px] font-light">
                <li>Name, email address, phone number, and billing/shipping address</li>
                <li>Payment information (processed securely through our third-party payment processors)</li>
                <li>Account login details, if you create an account</li>
                <li>Order history and preferences</li>
                <li>Any messages, reviews, or feedback you send us through our Contact form</li>
              </ul>
            </div>

            <div className="space-y-3 mt-4">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-slate-800">
                Information Collected Automatically
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 text-[14px] md:text-[15px] font-light">
                <li>IP address, browser type, and device information</li>
                <li>Pages visited, time spent on the Site, and referring URLs</li>
                <li>Cookies and similar tracking technologies (see Section 5 below)</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-[14px] md:text-[15px] font-light">
              <li>Process and fulfill your orders, including payment, shipping, and delivery</li>
              <li>Communicate with you about your orders, account, and customer service requests</li>
              <li>Send you marketing communications, including our WhatsApp community updates, where you have consented to receive them</li>
              <li>Improve our Site, products, and customer experience</li>
              <li>Detect, prevent, and address fraud, security, or technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              3. How We Share Your Information
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-[14px] md:text-[15px] font-light">
              <li><strong>Service providers</strong> who help us operate our business, such as payment processors, shipping carriers, and email/marketing platforms</li>
              <li><strong>Legal authorities</strong> when required by law, regulation, or legal process</li>
              <li><strong>Business transfers</strong>, in connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              4. Data Retention
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Our Site uses cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings. Disabling cookies may affect certain features of the Site.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              6. Your Rights and Choices
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 text-[14px] md:text-[15px] font-light">
              <li>Access, correct, or delete your personal information</li>
              <li>Object to or restrict certain processing of your data</li>
              <li>Withdraw consent for marketing communications at any time</li>
              <li>Request a copy of your personal data in a portable format</li>
            </ul>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              To exercise any of these rights, please contact us using the details in Section 9 below.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              7. Data Security
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We implement reasonable administrative, technical, and physical safeguards designed to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              Our Site is not directed to children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that we have collected information from a child without parental consent, we will take steps to delete it.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              9. Contact Us
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light mb-4">
              If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact us:
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

          {/* Section 10 */}
          <section className="space-y-4">
            <h2 className="font-serif text-[22px] md:text-[26px] text-slate-900 border-b border-black/5 pb-2">
              10. Changes to This Policy
            </h2>
            <p className="text-slate-700 text-[14px] md:text-[15px] leading-relaxed font-light">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will post the updated policy on this page with a revised &quot;Last Updated&quot; date.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}
