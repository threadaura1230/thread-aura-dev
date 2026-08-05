import { MetadataRoute } from "next";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thread-aura.com";

  const staticRoutes = [
    "",
    "/collections",
    "/login",
    "/register",
    "/info/about",
    "/info/shipping",
    "/info/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    await dbConnect();

    // Fetch active collections
    const collections = await Collection.find({});
    // Fetch active sub-collections
    const subcollections = await SubCollection.find({}).populate("parentCollection");
    // Fetch active products
    const products = await Product.find({ isActive: true })
      .populate("collection")
      .populate("subCollection");

    // Add collections routes
    const collectionRoutes = collections.map((col) => ({
      url: `${baseUrl}/collections/${col.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    // Add sub-collections routes
    const subcollectionRoutes = subcollections
      .filter((sub) => sub.parentCollection)
      .map((sub: any) => ({
        url: `${baseUrl}/collections/${sub.parentCollection.slug}/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    // Add product routes
    const productRoutes = products
      .filter((p) => p.collection && p.subCollection)
      .map((p) => ({
        url: `${baseUrl}/collections/${p.collection.slug}/${p.subCollection.slug}/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "daily" as const,
        priority: 0.5,
      }));

    dynamicRoutes = [...collectionRoutes, ...subcollectionRoutes, ...productRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
