import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import About from "@/components/sections/About";
import Categories from "@/components/sections/Categories";
import Contact from "@/components/sections/Contact";
import FAQ from "@/components/sections/FAQ";
import Hero from "@/components/sections/Hero";
import Prizes from "@/components/sections/Prizes";
import Registration from "@/components/sections/Registration";
import Rules from "@/components/sections/Rules";
import Timeline from "@/components/sections/Timeline";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="app-shell relative">
        <Hero />
        <About />
        <Categories />
        <Rules />
        <Prizes />
        <Timeline />
        <Registration />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
