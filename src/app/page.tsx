import { SequenceCanvas } from "@/components/canvas/SequenceCanvas";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Nav } from "@/components/ui/Nav";
import { Preloader } from "@/components/ui/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <SequenceCanvas />
      <Nav />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
