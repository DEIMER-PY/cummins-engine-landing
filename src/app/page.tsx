import { SequenceCanvas } from "@/components/canvas/SequenceCanvas";
import { Banco } from "@/components/sections/Banco";

export default function Home() {
  return (
    <>
      <SequenceCanvas />
      <main>
        <Banco />
      </main>
    </>
  );
}
