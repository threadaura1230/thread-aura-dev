import { Metadata } from "next";

export const siteConfig = {
  name: "Thread-aura",
  shortName: "Thread-aura",
  description: "Artisanal, hand-woven luxury bangles meticulously crafted with organic silk and premium gold zari threads.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://thread-aura.com",
  ogImage: "/images/og-default.jpg",
  links: {
    twitter: "https://twitter.com/threadaura",
  },
};

export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
  canonical,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonical?: string;
} = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} - Handcrafted Luxury Bangles`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url: canonical || siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
      creator: "@threadaura",
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(canonical ? { alternatives: { canonical } } : {}),
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {
          robots: {
            index: true,
            follow: true,
          },
        }),
  };
}
