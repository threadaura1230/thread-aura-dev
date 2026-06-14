import Footer from "@/sitepages/components/layout/Footer";
import Header from "@/sitepages/components/layout/Header";
export default function SitepagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}