import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import ProductDetailActions from "@/sitepages/components/catalog/ProductDetailActions";
import ImageGallery from "@/sitepages/components/catalog/ImageGallery";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";
import Link from "next/link";

interface ProductPageProps {
    params: Promise<{
        catelog: string;
        subcatelog: string;
        slug: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { catelog, subcatelog, slug } = await params;

    await dbConnect();

    // Query database for product by its slug
    const dbProduct = await Product.findOne({ slug, isActive: true })
        .populate("collection")
        .populate("subCollection");

    if (!dbProduct) {
        return (
            <div className="bg-[#F1EFE7] min-h-screen py-32 px-6 flex flex-col items-center justify-center text-center">
                <h1 className="font-serif text-[36px] text-slate-900 mb-4 capitalize">
                    Product Not Found
                </h1>
                <p className="text-slate-600 max-w-md mb-8">
                    The requested product &quot;{slug.replace(/-/g, ' ')}&quot; could not be found or is currently inactive.
                </p>
                <Link 
                    href="/" 
                    className="px-6 py-3 bg-[#0F3A2A] text-white text-[12px] font-bold tracking-widest uppercase hover:bg-[#134A31] transition-colors rounded"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    const displayCategory = dbProduct.collection?.name || catelog.replace(/-/g, ' ');
    const displaySubcategory = dbProduct.subCollection?.name || subcatelog.replace(/-/g, ' ');

    const product = {
        id: dbProduct._id.toString(),
        name: dbProduct.name,
        price: dbProduct.price,
        material: dbProduct.material || "100% Premium Thread & Zari Thread",
        description: dbProduct.description || "Meticulously hand-wrapped by master weavers, this bangle features custom metallic gold zari thread interwoven with premium threads. Built over an ultra-lightweight, hypoallergenic core designed for unmatched all-day comfort.",
        sizes: (dbProduct.sizes as string[]) || ["2.4", "2.6", "2.8"],
        bgColor: dbProduct.bgColor || "#1f332a",
        images: (dbProduct.images as string[]) || [],
        details: dbProduct.details && dbProduct.details.length > 0 
            ? (dbProduct.details as { title: string; content: string }[]) 
            : [
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
                    <Link href="/" className="hover:text-black cursor-pointer transition-colors">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/collections/${catelog}`} className="hover:text-black cursor-pointer transition-colors capitalize">{displayCategory}</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/collections/${catelog}/${subcatelog}`} className="hover:text-black cursor-pointer transition-colors capitalize">{displaySubcategory}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-black capitalize">{product.name}</span>
                </nav>

                {/* Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    
                    {/* Left Column: Image Gallery */}
                    <div>
                        <ImageGallery 
                            images={product.images} 
                            bgColor={product.bgColor} 
                            productName={product.name} 
                        />
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
                            <p className="text-[24px] font-serif text-slate-900 mt-4">₹{product.price.toFixed(2)}</p>
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

                        {/* CTA & Wishlist/Liked Buttons */}
                        <ProductDetailActions productId={product.id} />

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

