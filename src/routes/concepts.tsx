import { createFileRoute } from "@tanstack/react-router";
import { ComparisonCard } from "@/components/concepts/ComparisonCard";
import { SectionHeading } from "@/components/uikit/SectionHeading";
import { concepts } from "@/data/concepts";

export const Route = createFileRoute("/concepts")({
  head: () => ({
    meta: [
      { title: "Concepts — ChainLens" },
      { name: "description", content: "Web3 fundamentals explained through side-by-side comparisons." },
      { property: "og:title", content: "Web3 Concepts, Compared — ChainLens" },
      { property: "og:description", content: "Web2 vs Web3, Bitcoin vs Ethereum, Public vs Private keys, and more." },
    ],
  }),
  component: Concepts,
});

function Concepts() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
      <SectionHeading
        eyebrow="Web3 Fundamentals"
        title="Learn by Comparison"
        subtitle="Four foundational concepts, side-by-side. No jargon walls — just clear contrasts."
      />
      <div className="mt-14 space-y-8">
        {concepts.map((c, i) => (
          <ComparisonCard key={c.id} concept={c} index={i} />
        ))}
      </div>
    </section>
  );
}
