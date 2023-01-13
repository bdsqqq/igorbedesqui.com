export default function IBM() {
  // context
  // projects
  // // Think
  // // Gartner
  // // QA helper
  // // other contributions (industries, gbs, etc)
  // amazing people, growth, thankful
  // why I left

  return (
    <>
      <Seo title="IBM" description="IBM" url="p/ibm" ogText="" />
      {/* TODO: actual title and description */}

      <Container key="bebopProj" backable>
        <HeroBand heroVideo={"/videos/ibm/tapes"}>
          Creating web experiences in the corporate of corporates.
        </HeroBand>

        <div className="mt-16 flex flex-col gap-20">
          <Band gridless id="context">
            <div className={cx(grid({ mode: "narrow" }))}>
              <p className="text-xl md:col-start-2 lg:col-start-2 col-span-5 lg:col-span-9">
                {`From updating content in product pages to leading the development of an
              online event with 121k attendees, I've had the opportunity to work on a
              wide range of projects at IBM, collaborate with amazing folks, and lead impactful initiatives.`}
              </p>
            </div>
          </Band>
          <Band gridless id="work">
            <ul
              className={cx(
                grid({ mode: "narrow" }),
                "gap-y-8 hover:text-gray-10 focus-within:text-gray-10 pointer-events-none"
              )}
            >
              <li className="col-span-4 lg:col-span-8 ">
                <UnstyledLink
                  href="/p/ibm/think2022"
                  className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard"
                >
                  <h2 className="font-semibold underline underline-offset-2">
                    Think 2022
                  </h2>
                  <p>{`Creating the digital experience for IBM's biggest event with bleeding edge tech.`}</p>
                </UnstyledLink>
              </li>
              <li className="col-span-4 lg:col-span-8 ">
                <UnstyledLink
                  href="/p/ibm/think2022"
                  className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard"
                >
                  <h2 className="font-semibold underline underline-offset-2">
                    Interactive event app
                  </h2>
                  <p>
                    {`Highlighting key offerings to convert interested attendees into blown away clients.`}
                  </p>
                </UnstyledLink>
              </li>
              <li className="col-span-4 lg:col-span-8">
                <UnstyledLink
                  href="/p/ibm/think2022"
                  className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard"
                >
                  <h2 className="font-semibold underline underline-offset-2">
                    QA Helper
                  </h2>
                  <p>
                    {`Automating QA tasks in browser to help engineers focus on what matters. Typesafelly, of course.`}
                  </p>
                </UnstyledLink>
              </li>
              <li className="pointer-events-none col-span-4 lg:col-span-8">
                <h2 className="font-semibold">
                  Open Source Exploration initiative
                </h2>
                <p>
                  Nerding about cool tech to the point it became an actual job
                  activity when our studio decided to focus on unique web
                  experiences.
                </p>
              </li>
              <li className="pointer-events-none col-span-6 lg:col-span-12 lg:col-end-14">
                <h2 className="font-semibold">Other contributions</h2>
                <ul className="list-decimal list-outside marker:text-gray-8 space-y-2">
                  <li>
                    Trained colleagues in React, Typescript, and NextJS through
                    presentations, one on one sessions, and collaborative work.
                  </li>

                  <li>
                    {`Maintained, used, and improved template repositories used to create whitepapers and other deliverables.`}
                  </li>

                  <li>
                    {`Created pages and maintained one of a kind assets for ibm.com /industries and /services.`}
                  </li>
                </ul>
              </li>
            </ul>
          </Band>
          <Band gridless id="people">
            <div className={cx(grid({ mode: "narrow" }), "gap-y-20")}>
              <div className="col-span-6 lg:col-start-1 lg:col-span-8 space-y-4">
                <p>
                  {`I'm thankful to have met people who changed how I approach work and life to some extent.`}
                </p>
                <p>
                  {`Rafael's management style allowed me to pursue quality work, and tought me the joy of ownership; My best work happened under his leadership and together we delivered experiences that set a new standard for our organization.`}
                </p>
                <p>
                  {`Sebastian's mentorship taught me how to speak, how to think about design, and from observing him, how to be a better person. I feel lucky to have the opportunity to work with him, and even luckier to call him a friend.`}
                </p>
              </div>
              <div className="md:col-end-9 lg:col-start-5 col-span-5 lg:col-span-12 space-y-4">
                <p>
                  {`Leaving was a hard decision, but after two years of aquiring new responsibilities and skills, with no change in pay, I decided to move on. A job at a company this big is transactional relationship after all.`}
                </p>
                <p
                  aria-hidden
                  className="text-gray-1 hover:text-gray-11 transition-colors duration-fast-02 ease-productive-standard group"
                >
                  {`…And it freaked me out that I was paid `}
                  <span className="group-hover:text-gray-12 transition-colors duration-fast-02 ease-productive-standard">{`7K USD a year being a major contributor to high-impact projects in a multi-billion company`}</span>
                  {`. Being a cost savings measure as a third-party offshore contractor in Brazil isn't the best for self worth.`}
                </p>
              </div>
            </div>
          </Band>
        </div>
      </Container>
    </>
  );
}

import Container from "@/components/Container";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import StyledLink from "@/ui/StyledLink";
import { cx } from "class-variance-authority";
import { grid } from "@/components/ui/Grid";
import { UnstyledLink } from "@/components/ui/primitives";
