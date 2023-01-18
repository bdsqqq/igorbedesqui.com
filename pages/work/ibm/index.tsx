export const meta = {
  shortName: "IBM",
  name: "IBM",
  description: "Creating web experiences for the enterprise of enterprises.",
  roles: ["FullStack Developer"],
  type: "Full time",
  tools: [""],
  date: "2020 ~ 2022",
  urlSlug: "ibm",
};

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
      <Seo
        title="IBM"
        description={`Igor Bedesqui lead impactful initiatives and collaborated with top talent to deliver Think 2022 and other web experiences for IBM.`}
        url="work/ibm"
        ogText="Creating web experiences/nfor the enterprise of/nenterprises."
      />

      <Container key="ibm" backable>
        <HeroBand heroVideo={"/videos/ibm/tapes"}>
          Creating web experiences for the enterprise of enterprises.
        </HeroBand>

        <div className="mt-16 flex flex-col gap-20">
          <Band gridless id="context">
            <div className={cx(grid({ mode: "narrow" }))}>
              <p className="text-xl col-span-5 lg:col-span-9">
                {`From updating content in product pages to `}
                <span className="text-gray-12">{`developing an`}</span>
                {` online `}
                <span className="text-gray-12">{`event with 121k attendees, I worked`}</span>
                {` on a wide range of projects at IBM, collaborated `}
                <span className="text-gray-12">{`with amazing folks, and led impactful initiatives.`}</span>
              </p>
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
                <h2 className="font-semibold">Other contributions</h2>
                <ul className="list-decimal list-outside marker:text-gray-8 space-y-2">
                  <li>
                    {`Was responsible for the development and technical decisions for ibm.com/events, one of the highest traffic segments of the company's website.`}
                  </li>

                  <li>
                    {`Trained colleagues in React, Typescript, and NextJS through presentations, one on one sessions, and collaborative work.`}
                  </li>

                  <li>
                    {`Maintained, used, and improved template repositories used to create whitepapers and other deliverables.`}
                  </li>

                  <li>
                    {`Created pages and maintained one of a kind assets made in collaboration with external agencies for ibm.com /industries, /consulting and /services.`}
                  </li>
                </ul>
              </li>
            </ul>
          </Band>
          <Band gridless id="people">
            <div className={cx(grid({ mode: "narrow" }), "gap-y-20")}>
              <div className="col-span-6 lg:col-start-1 lg:col-span-8 space-y-4">
                <p>
                  {`Dozens of individuals are responsible for my growth, and I'm thankful to have met people who changed how I approach my work. Two that hold a special place in my development are `}
                  <StyledLink href="https://www.linkedin.com/in/rafael-merz/">
                    Rafael Merz
                  </StyledLink>
                  {` and `}
                  <StyledLink href="https://www.linkedin.com/in/sebastian-huynh/">
                    Sebastian Huynh
                  </StyledLink>
                  {`;`}
                </p>
                <ul className="list-decimal list-outside marker:text-gray-8 space-y-2">
                  <li>
                    <p>
                      <span className="text-gray-12">{`Rafael`}</span>
                      {`'s management style `}
                      <span className="text-gray-12">{`allowed me to pursue quality work and taught me the joy of ownership;`}</span>
                      {` My best work happened under his leadership. `}
                      <span className="text-gray-12">{`Together we`}</span>
                      {` delivered experiences that `}
                      <span className="text-gray-12">{`set a new standard for our organization.`}</span>
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="text-gray-12">{`Sebastian`}</span>
                      {`'s mentorship `}
                      <span className="text-gray-12">{`taught me`}</span>
                      {` how to speak, how to think about design, and from observing him, `}
                      <span className="text-gray-12">{`how to be`}</span>
                      {` a `}
                      <span className="text-gray-12">{`better`}</span>
                      {` person`}
                      <span className="text-gray-12">{`. I'm lucky`}</span>
                      {` to have worked with Sebastian and even luckier  `}
                      <span className="text-gray-12">{`to call him a friend.`}</span>
                    </p>
                  </li>
                </ul>
              </div>
              <div className="md:col-end-9 lg:col-start-5 col-span-5 lg:col-span-12 space-y-4">
                <p>
                  {`Leaving was a hard decision, but after two years of aquiring new responsibilities and skills, with no change in pay, I decided to move on. A job at a company this big is transactional relationship after all.`}
                </p>
                <p
                  tabIndex={0}
                  className="text-gray-3 hover:text-gray-11 focus:text-gray-11 filter blur-sm  hover:blur-none focus:blur-none duration-moderate-02 transition-all ease-productive-standard group"
                >
                  {`…And getting paid `}
                  <span className="text-gray-8 group-hover:text-gray-12 group-focus:text-gray-12 transition-colors duration-moderate-02 ease-productive-standard">{`7K USD a year as a major contributor to high-impact projects in a multi-billion company`}</span>
                  {` freaked me out. Feeling like a cost savings measure as a third-party offshore contractor in Brazil isn't the best for self worth.`}{" "}
                  <span className="text-gray-8 group-hover:text-gray-12 group-focus:text-gray-12 transition-colors duration-moderate-02 ease-productive-standard">{`But don't tell anyone, this is a secret!`}</span>
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
