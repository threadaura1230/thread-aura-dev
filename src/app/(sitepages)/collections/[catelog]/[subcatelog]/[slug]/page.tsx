import { ShieldCheck, Truck, RefreshCw } from "lucide-react";
import ProductDetailActions from "@/sitepages/components/catalog/ProductDetailActions";
import ImageGallery from "@/sitepages/components/catalog/ImageGallery";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";
import Link from "next/link";
import { constructMetadata } from "@/lib/seo";

interface ProductPageProps {
    params: Promise<{
        catelog: string;
        subcatelog: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  await dbConnect();
  const product = await Product.findOne({ slug, isActive: true });

  if (!product) {
    return constructMetadata({
      title: "Product Not Found",
      description: "This bangle could not be found.",
    });
  }

  const defaultImg = product.images && product.images.length > 0 ? product.images[0] : undefined;

  return constructMetadata({
    title: product.name,
    description: product.description || `Buy ${product.name} handcrafted luxury bangle online.`,
    image: defaultImg,
  });
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
        material: dbProduct.material || "",
        description: dbProduct.description || "",
        sizes: (dbProduct.sizes as string[]) || [],
        bgColor: dbProduct.bgColor || "#1f332a",
        color: dbProduct.color || "",
        images: (dbProduct.images as string[]) || [],
        slug: dbProduct.slug,
        categorySlug: catelog,
        subCollectionSlug: subcatelog,
        details: (dbProduct.details as { title: string; content: string }[]) || []
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

                        {/* CTA & Wishlist Button (including Size Selector) */}
                        <ProductDetailActions product={product} />

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-black/10 text-center">
                            <div className="flex flex-col items-center">
                                <Truck className="w-5 h-5 text-slate-700 mb-2" />
                                <span className="text-[10px] text-slate-600 font-medium">Free Delivery</span>
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

