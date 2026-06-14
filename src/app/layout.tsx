import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/sitepages/components/layout/SmoothScroll";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

export const metadata: Metadata = {
    title: "Thread-aura",
    description: "Artisanal, hand-woven luxury bangles.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
            <body className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#F1EFE7]" suppressHydrationWarning>
                <SmoothScroll />
                {children}
            </body>
        </html>
    );

}
