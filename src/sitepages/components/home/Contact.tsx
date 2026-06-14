"use client";

import Image from "next/image";

export default function Contact() {
  return (
    <section id="contact" className="w-full bg-[#0A1310] flex flex-col lg:flex-row min-h-[700px]">
      {/* Left Side: Image */}
      <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-full bg-[#12221c]">
        {/* Fallback placeholder visible if image isn't loaded */}
        <div className="absolute inset-0 flex items-center justify-center text-[#364B44] text-sm text-center px-6">
          Image Placeholder<br/>(Save your bangle photo as "contact-bangles.png" in the "public" folder)
        </div>
        
        {/* We use the filename 'contact-bangles.png' - the user needs to add their uploaded image to the public folder with this name */}
        <Image
          src="/contact-bangles.png" 
          alt="Pink Silk Thread Bangles"
          fill
          className="object-cover relative z-10"
        />
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 md:p-16 lg:p-24">
        <div className="w-full max-w-[420px]">
          <h2 className="text-white text-[24px] md:text-[28px] font-sans font-medium mb-4">
            Get in Touch
          </h2>
          <p className="text-[#A4B5AE] text-[12px] md:text-[13px] font-light leading-[1.8] mb-12">
            Have a question or need assistance? Feel free to reach out to us. We are here to help you on your journey to bespoke craftsmanship.
          </p>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <input 
                type="text" 
                placeholder="First name *"
                className="w-full bg-transparent border-b border-[#2a3c35] pb-3 text-white text-[13px] font-light placeholder:text-[#A4B5AE] focus:outline-none focus:border-[#527063] transition-colors"
                required
              />
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Last name *"
                className="w-full bg-transparent border-b border-[#2a3c35] pb-3 text-white text-[13px] font-light placeholder:text-[#A4B5AE] focus:outline-none focus:border-[#527063] transition-colors"
                required
              />
            </div>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email *"
                className="w-full bg-transparent border-b border-[#2a3c35] pb-3 text-white text-[13px] font-light placeholder:text-[#A4B5AE] focus:outline-none focus:border-[#527063] transition-colors"
                required
              />
            </div>
            <div className="relative">
              <textarea 
                placeholder="Message"
                rows={2}
                className="w-full bg-transparent border-b border-[#2a3c35] pb-3 text-white text-[13px] font-light placeholder:text-[#A4B5AE] focus:outline-none focus:border-[#527063] transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full py-4 mt-8 bg-[#FFFBE4] text-[#0A1310] text-[13px] font-medium tracking-wide hover:bg-[#f2ead3] transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
