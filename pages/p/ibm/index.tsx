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
          Creating web experiences in the big blue.
        </HeroBand>

        <div className="mt-16 flex flex-col gap-20">
          <Band gridless id="context">
            <div className={cx(grid({ mode: "narrow" }))}>
              <p className="text-xl md:col-start-2 lg:col-start-2 col-span-5 lg:col-span-9">
                {`From updating fiels in a CMS to leading the development of an
              event with 121k attendees, I've had the opportunity to work on a
              wide range of projects at IBM and collaborate with amazing folks.`}
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
              <li className="col-span-4 lg:col-span-5 ">
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
              <li className="col-span-4 lg:col-span-5 ">
                <UnstyledLink
                  href="/p/ibm/think2022"
                  className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard"
                >
                  <h2 className="font-semibold underline underline-offset-2">
                    Interactive event app
                  </h2>
                  <p>
                    Highlighting key offerings to convert interested attendees
                    into blown away clients.
                  </p>
                </UnstyledLink>
              </li>
              <li className="col-span-4 lg:col-span-5 ">
                <UnstyledLink
                  href="/p/ibm/think2022"
                  className="block pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard"
                >
                  <h2 className="font-semibold underline underline-offset-2">
                    QA Helper
                  </h2>
                  <p>
                    Automating boring tasks to help engineers focus on what
                    matters. Typesafelly, of course.
                  </p>
                </UnstyledLink>
              </li>
            </ul>
          </Band>
          <Band gridless id="people">
            <div className={cx(grid({ mode: "narrow" }), "gap-y-8")}>
              <div className="col-span-6 lg:col-start-1 lg:col-span-8">
                {`Amazing people, growth, thankful Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni error est animi atque laboriosam nesciunt adipisci laborum maiores ad fuga, quisquam consectetur vel omnis et cumque tempore commodi sunt sapiente iure voluptatibus dolorum eveniet! Impedit obcaecati fuga distinctio a eius!`}
              </div>
              <div className="md:col-end-9 lg:col-start-5 col-span-5 lg:col-span-12">
                {`Why I left Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.`}
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
