import HeroBand from "@/components/HeroBand";
import type { Metadata } from "next";

import { MDX } from "@/components/MDX";

import Container from "@/components/Container";
import Band from "@/components/Band";
import { cx } from "class-variance-authority";
import { grid } from "@/components/ui/Grid";
import { Blur } from "@/components/ui/Blur";

const makeSeo = ({
  title,
  description,
  slug,
  ogText,
}: {
  title: string;
  description: string;
  slug: string;
  ogText: string;
}): Metadata => {
  const ogImageUrl = new URL(
    `https://www.igorbedesqui.com/api/og?text=${ogText}`
  ).href;

  return {
    title,
    description,
    twitter: {
      site: "@bdsqqq",
      creator: "@bdsqqq",
      // @ts-ignore
      card: "summary_large_image",
      title: title,
      description: description,
      image: ogImageUrl,
      imageAlt: ogText.replace("*", ""),
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://www.igorbedesqui.com${slug}`,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogText.replace("*", "").replace("/n", ""),
        },
      ],
    },
  };
};

export const metadata: Metadata = makeSeo({
  title: "IBM",
  description:
    "Igor Bedesqui lead impactful initiatives and collaborated with top talent to deliver Think 2022 and other web experiences for IBM.",
  slug: "/work/ibm",
  ogText: "Creating web experiences/nfor the enterprise of/nenterprises.",
});

export default async function IBM() {
  // context
  // projects
  // // Think
  // // Gartner
  // // QA helper
  // // other contributions (industries, gbs, etc)
  // amazing people, growth, thankful
  // why I left

  return (
    <Container key="IBMProj" backable backAnchor="/work">
      <HeroBand heroVideo={"/videos/ibm/tapes"}>
        Creating web experiences for the enterprise of enterprises.
      </HeroBand>
      <div className="mb-16" />

      <div className="flex flex-col gap-20">
        <Band gridless id="context">
          <div className={cx(grid({ mode: "narrow" }))}>
            <div className="text-xl col-span-5 lg:col-span-9">
              <MDX
                components={{
                  strong: ({ children }) => (
                    <span className="text-gray-12">{children}</span>
                  ),
                }}
              >
                {`
                  From updating content in product pages to **developing an** online **event with 121k attendees, I worked** on a wide range of projects at IBM, collaborated **with amazing folks, and led impactful initiatives.**
                `}
              </MDX>
            </div>
          </div>
        </Band>
        <Band gridless id="work">
          <ul
            className={cx(
              grid({ mode: "narrow" }),
              "gap-y-8 "
              //"hover:text-gray-10 focus-within:text-gray-10"
            )}
          >
            <li className="col-span-4 lg:col-span-8 cursor-text">
              {/* <UnstyledLink
                  href="/work/ibm/think2022"
                  className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard"
                > */}
              <h2 className="font-semibold">
                {/* underline underline-offset-2 when this becomes a link */}
                Think 2022
              </h2>
              <p>{`Creating the digital experience for IBM's flagship event with bleeding-edge tech.`}</p>
              {/* </UnstyledLink> */}
            </li>
            <li className="col-span-4 lg:col-span-8 ">
              {/* <UnstyledLink
                  href="/work/ibm/think2022"
                  className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard"
                > */}
              <h2 className="font-semibold">
                {/* underline underline-offset-2 when this becomes a link */}
                Interactive event app
              </h2>
              <p>
                {`Highlighting key offerings to convert interested attendees into blown away clients.`}
              </p>
              {/* </UnstyledLink> */}
            </li>
            <li className="col-span-4 lg:col-span-8">
              {/* <UnstyledLink
                  href="/work/ibm/think2022"
                  className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard"
                > */}
              <h2 className="font-semibold">
                {/* underline underline-offset-2 when this becomes a link */}
                QA Helper
              </h2>
              <p>
                {`Automating QA tasks in browser to help engineers focus on what matters. Typesafelly, of course.`}
              </p>
              {/* </UnstyledLink> */}
            </li>
            <li className="col-span-4 lg:col-span-8">
              {/* pointer-events-none */}
              <h2 className="font-semibold">
                Open Source Exploration initiative
              </h2>
              <p>
                {`Nerding about cool tech to the point it became an actual job activity when our studio decided to focus on unique experiences.`}
              </p>
            </li>
            <li className="col-span-6 lg:col-span-12 lg:col-end-14">
              {/* pointer-events-none */}
              <MDX
                components={{
                  h2: ({ children }) => (
                    <h2 className="font-semibold">{children}</h2>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside marker:text-gray-8 space-y-2">
                      {children}
                    </ol>
                  ),
                }}
              >
                {`
                  ## Other contributions

                  1. Was responsible for the development and technical decisions for ibm.com/events.
                  1. Trained colleagues in React, Typescript, and NextJS through presentations, one on one sessions, and collaborative work.
                  1. Maintained, used, and improved template repositories used to create whitepapers and other deliverables.
                  1. Created pages and maintained one of a kind assets made in collaboration with external agencies for ibm.com /industries, /consulting and /services.
                `}
              </MDX>
            </li>
          </ul>
        </Band>
        <Band gridless id="people">
          <div className={cx(grid({ mode: "narrow" }), "gap-y-20")}>
            <div className="col-span-6 lg:col-start-1 lg:col-span-8 space-y-4">
              <MDX
                components={{
                  ol: ({ children }) => (
                    <ol className="list-decimal list-outside marker:text-gray-8 space-y-2">
                      {children}
                    </ol>
                  ),
                  strong: ({ children }) => (
                    <span className="text-gray-12">{children}</span>
                  ),
                }}
              >
                {`
                  Dozens of individuals are responsible for my growth, and I'm thankful to have met people who changed how I approach my work. Two that hold a special place in my development are [Rafael Merz](https://www.linkedin.com/in/rafael-merz/) and [Sebastian Huynh](https://www.linkedin.com/in/sebastian-huynh/);

                  1. **Rafael's management style allowed me to pursue quality work and taught me the joy of ownership;** My best work happened under his leadership. **Together we delivered experiences that set a new standard for our organization.**
                  1. **Sebastian's mentorship taught mehow to speak, how to think about design, and from observing him, how to be a better person. I'm lucky to have worked with Sebastian and even luckier to call him a friend.**
                `}
              </MDX>
            </div>
            <div className="md:col-end-9 lg:col-start-5 col-span-5 lg:col-span-12 space-y-4">
              <MDX
                components={{
                  Blur: Blur,
                  strong: ({ children }) => (
                    <span className="text-gray-8 group-hover/blur:text-gray-12 group-focus/blur:text-gray-12 transition-colors duration-moderate-02 ease-productive-standard">
                      {children}
                    </span>
                  ),
                }}
              >
                {`
                  Leaving was a hard decision, but after two years of aquiring new responsibilities and skills, with no change in pay, I decided to move on. A job at a company this big is transactional relationship after all.

                  <Blur>…And getting paid **7K USD a year as a major contributor to high-impact projects in a multi-billion company** freaked me out. Feeling like a cost savings measure as a third-party offshore contractor in Brazil isn't the best for self worth. **But don't tell anyone, this is a secret!**</Blur>
                `}
              </MDX>
            </div>
          </div>
        </Band>
      </div>
    </Container>
  );
}
