import Hero from "@/sitepages/components/home/Hero";
import Collection from "@/sitepages/components/home/Collection";
import FeatureProduct from "@/sitepages/components/home/Featureproduct";
import ChooseUs from "@/sitepages/components/home/ChooseUs";
import ExploreSelection from "@/sitepages/components/home/ExploreSelection";
import Contact from "@/sitepages/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Collection />
      <FeatureProduct />
      <ChooseUs />
      <ExploreSelection />
      <Contact />
    </>
  );
}
