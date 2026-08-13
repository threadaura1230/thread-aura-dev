import Hero from "@/sitepages/components/home/Hero";
import Collection from "@/sitepages/components/home/Collection";
import NewArrivals from "@/sitepages/components/home/Newarrivals";
import FeatureProduct from "@/sitepages/components/home/Featureproduct";
import ChooseUs from "@/sitepages/components/home/ChooseUs";
import ExploreSelection from "@/sitepages/components/home/ExploreSelection";
import Contact from "@/sitepages/components/home/Contact";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Handcrafted Luxury Bangles",
  description: "Explore Thread-aura's exclusive collection of hand-woven luxury bangles, crafted with organic silk and pure gold zari threads.",
});


export default function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <Collection />
      <FeatureProduct />
      <ChooseUs />
      <ExploreSelection />
      <Contact />
    </>
  );
}
