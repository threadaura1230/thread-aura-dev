import { Heart } from "lucide-react";
import Link from "next/link";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        material: string;
        tag?: string;
        bgColor: string;
    };
    categorySlug: string;
}

export default function ProductCard({ product, categorySlug }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col w-full">
            {/* Image Container */}
            <Link href={`/${categorySlug}/${product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-md bg-[#e3ded9] mb-4">
                <div 
                    className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundColor: product.bgColor }}
                >
                    {/* Placeholder Text for Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-white/40 font-medium text-sm tracking-widest uppercase">
                        Product Image
                    </div>
                </div>
                
                {/* Optional Tag */}
                {product.tag && (
                    <div className="absolute top-3 left-3 bg-white text-slate-900 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-[2px] z-10">
                        {product.tag}
                    </div>
                )}

                {/* Quick Add Button (appears on hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                    <button className="w-full bg-white/90 backdrop-blur-sm text-slate-900 text-[12px] font-semibold tracking-wider uppercase py-3 hover:bg-white transition-colors shadow-lg">
                        Add to Bag
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-[14px] font-medium text-slate-900 mb-1 leading-tight">
                        <Link href={`/${categorySlug}/${product.id}`} className="hover:underline underline-offset-4">
                            {product.name}
                        </Link>
                    </h3>
                    <p className="text-[12px] text-slate-500 mb-2">{product.material}</p>
                    <p className="text-[13px] font-semibold text-slate-900">${product.price.toFixed(2)}</p>
                </div>
                
                {/* Wishlist Icon */}
                <button className="text-slate-400 hover:text-red-500 transition-colors pt-0.5">
                    <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
                </button>
            </div>
        </div>
    );
}
