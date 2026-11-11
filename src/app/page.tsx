import { SplitHeading } from "@/components/ui/SplitHeading";

export default function Home() {
  return (
    <main>
      <section className="grid min-h-dvh place-items-center px-4">
        <SplitHeading as="h1" className="text-titulo">
          60 litros para mover montañas
        </SplitHeading>
      </section>
      <section className="min-h-[200dvh]" />
    </main>
  );
}
