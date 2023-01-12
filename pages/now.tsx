export default function Home() {
  const thingsImDoing = [
    "Playing with Astro.build on a few new projects instead of finishing old ones",
    "Shitposting a bit too much on theo's stream",
    "Over-engineering my personal website",
    "Still trying(and failing) to take cute photos with my girlfriend",
  ];

  return (
    <>
      <Seo
        title="Now — Igor Bedesqui"
        description="What I'm doing now"
        url="now"
        ogText="What I'm doing now"
      />

      <Container backable key="index">
        <Band gridless id="main">
          <div className="mx-auto">
            <h1 className="text-4xl">What I’m doing now</h1>
            <p className="text-gray-11 text-sm font-semibold">
              Last updated on <span>August 8th, 2022</span>
            </p>

            <div className="h-16" />
            <ul className="flex flex-col gap-2 [list-style-type:circle] list-inside">
              {thingsImDoing.map((thing) => {
                return (
                  <li className="text-base leading-relaxed" key={thing}>
                    {thing}
                  </li>
                );
              })}
            </ul>
            <div className="h-40" />
            <p className="text-gray-11 text-xs font-semibold">
              slowly surpassing my yesterday self.
            </p>
          </div>
        </Band>
      </Container>
    </>
  );
}

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";
