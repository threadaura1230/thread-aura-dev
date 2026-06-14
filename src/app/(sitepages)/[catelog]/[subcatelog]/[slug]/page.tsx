import { Heart, ShieldCheck, Truck, RefreshCw } from "lucide-react";

interface ProductPageProps {
    params: Promise<{
        catelog: string;
        subcatelog: string;
        slug: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { catelog, subcatelog, slug } = await params;

    // Capitalize and format slugs for presentation
    const formattedSlug = slug.replace(/-/g, ' ');
    const displayCategory = catelog.replace(/-/g, ' ');
    const displaySubcategory = subcatelog.replace(/-/g, ' ');

    // Mock detailed product
    const product = {
        name: formattedSlug,
        price: 145.00,
        material: "100% Organic Mulberry Silk & 24K Gold Zari Thread",
        description: "Meticulously hand-wrapped by master weavers, this bangle features custom metallic gold zari thread interwoven with premium, high-lustre Mulberry silk. The structure is built over an ultra-lightweight, hypoallergenic core designed for unmatched all-day comfort. Each loop of thread is pulled to exact tension to ensure a lifetime of perfect geometry.",
        sizes: ["2.4", "2.6", "2.8"],
        details: [
            { title: "Materials & Origin", content: "Handmade in our artisanal studio. Sourced with sustainable GOTS certified organic silk threads and high-grade core structure." },
            { title: "Care Instructions", content: "To protect the delicate silk threads, avoid exposure to moisture, perfumes, and direct heat. Clean gently with a soft microfibre cloth." },
            { title: "Shipping & Returns", content: "Complementary shipping on all domestic orders. Elegantly packed in a signature Thread-aura gift box. Returns accepted within 14 days." }
        ]
    };

    return (
        <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-12 lg:px-16">
            <div className="max-w-7xl mx-auto">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-12">
                    <span className="hover:text-black cursor-pointer transition-colors">Home</span>
                    <span className="mx-2">/</span>
                    <span className="hover:text-black cursor-pointer transition-colors capitalize">{displayCategory}</span>
                    <span className="mx-2">/</span>
                    <span className="hover:text-black cursor-pointer transition-colors capitalize">{displaySubcategory}</span>
                    <span className="mx-2">/</span>
                    <span className="text-black capitalize">{product.name}</span>
                </nav>

                {/* Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    
                    {/* Left Column: Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] rounded-lg bg-[#1f332a] w-full flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm font-semibold tracking-widest uppercase">
                                Primary Product Image
                            </div>
                        </div>
                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((idx) => (
                                <button key={idx} className="aspect-square bg-black/5 hover:bg-black/10 rounded border border-transparent hover:border-[#073623] transition-all flex items-center justify-center text-[10px] text-slate-400 font-medium">
                                    View {idx}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Sticky Product Info */}
                    <div className="lg:sticky lg:top-32 space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 bg-[#0F3A2A] text-white text-[10px] font-bold uppercase tracking-wider rounded-[3px] mb-4">
                                Handcrafted Limited Edition
                            </span>
                            <h1 className="font-serif text-[36px] md:text-[44px] text-slate-900 leading-tight capitalize">
                                {product.name}
                            </h1>
                            <p className="text-[#b13d33] text-[12px] font-bold tracking-widest uppercase mt-2">
                                {product.material}
                            </p>
                            <p className="text-[24px] font-serif text-slate-900 mt-4">${product.price.toFixed(2)}</p>
                        </div>

                        {/* Description */}
                        <p className="text-slate-700 text-[14px] leading-relaxed">
                            {product.description}
                        </p>

                        {/* Size Selector */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider">Select Size (Bangle Inner Diameter)</span>
                                <button className="text-[11px] text-slate-900 underline underline-offset-4 hover:text-black">Size Guide</button>
                            </div>
                            <div className="flex gap-3">
                                {product.sizes.map((size) => (
                                    <button 
                                        key={size}
                                        className="w-14 h-11 border border-slate-300 rounded hover:border-[#073623] hover:text-[#073623] font-sans text-[13px] font-medium transition-colors flex items-center justify-center cursor-pointer"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4">
                            <button className="flex-1 py-4 bg-[#073623] hover:bg-[#0c4a31] text-white text-[13px] font-bold tracking-widest uppercase rounded transition-colors shadow-sm">
                                Add to Bag
                            </button>
                            <button className="p-4 border border-slate-300 rounded hover:border-slate-800 transition-colors flex items-center justify-center">
                                <Heart className="w-5 h-5 text-slate-600 hover:text-red-500 transition-colors" />
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-black/10 text-center">
                            <div className="flex flex-col items-center">
                                <Truck className="w-5 h-5 text-slate-700 mb-2" />
                                <span className="text-[10px] text-slate-600 font-medium">Free Delivery</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <RefreshCw className="w-5 h-5 text-slate-700 mb-2" />
                                <span className="text-[10px] text-slate-600 font-medium">14-Day Returns</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <ShieldCheck className="w-5 h-5 text-slate-700 mb-2" />
                                <span className="text-[10px] text-slate-600 font-medium">Secure Checkout</span>
                            </div>
                        </div>

                        {/* Custom Collapsible Sections */}
                        <div className="border-t border-black/10 pt-6 space-y-4">
                            {product.details.map((detail, idx) => (
                                <details key={idx} className="group outline-none cursor-pointer">
                                    <summary className="flex justify-between items-center text-[13px] font-bold text-slate-800 uppercase tracking-wider py-2 list-none">
                                        {detail.title}
                                        <span className="transition-transform group-open:rotate-180">+</span>
                                    </summary>
                                    <p className="text-slate-600 text-[13px] leading-relaxed pt-2 pl-1 cursor-default">
                                        {detail.content}
                                    </p>
                                </details>
                            ))}
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
