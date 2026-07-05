import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { WhyLayer2 } from "@/components/home/WhyLayer2";
import { WhatIsArbitrum } from "@/components/home/WhatIsArbitrum";
import { Features } from "@/components/home/Features";
import { RealWorldBenefit } from "@/components/home/RealWorldBenefit";
import { SITE } from "@/constants/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.tagline}` },
      {
        name: "description",
        content:
          "Interactive guide to Web3 fundamentals and Arbitrum Layer 2. Explore concepts, live crypto prices, and mine your own blockchain.",
      },
      { property: "og:title", content: `${SITE.name} — Layer 2, Explained` },
      {
        property: "og:description",
        content: "Web3 fundamentals & Arbitrum, learned by doing.",
      },
      { name: "author", content: SITE.author.name },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <WhyLayer2 />
      <WhatIsArbitrum />
      <Features />
      <RealWorldBenefit />
    </>
  );
}
