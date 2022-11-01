export default function Psykip() {
  const { t, lang } = useTypeSafeTranslation("projs/bebop");
  const psykipMeta = useMeta("psykip", "projs");
  const bebopMeta = useMeta("bebop", "projs");

  return (
    <>
      <Seo title="" description="" url="p/psykip" />
      {/* TODO: actual title and description */}

      <ProjectContainer key="psykipProj" backMessage={t("backMessage")}>
        <HeroBand
          heroImg={{
            src: "/images/projs/psykip/will-smith.gif",
            alt: "Will Smith thinking really hard",
          }}
        >
          <TransWithComps text={t("heroTitle")} />
          <div className="mt-6">
            <CodeAndDemoButtons
              codeUrl="https://github.com/bdsqqq/bebop-webjam"
              demoUrl="https://bebop-webjam.vercel.app/"
            />
          </div>
        </HeroBand>

        <ProjectLayout projMeta={psykipMeta} nextProjMeta={bebopMeta}>
          <Band headline={{ bold: "01", thin: "Why?" }}>
            <p>
              {`The Enchiridion is a fascinating book, an easy read filled with valuable insights. Unfortunately—even with multiple public domain translations—reading it can often be a bad experience.`}
            </p>
            <p>
              {`Between old and sometimes confusing terms, hard to find and even harder to download files, and outdated websites, the barriers between an interested reader and this content are monumental. So, why not make a website that solves these problems?`}
            </p>
          </Band>
          <Band headline={{ bold: "02", thin: "How?" }}>
            <ol>
              <li>
                {`We focused our efforts on design. While the content is the reason we built this site, its presentation is what solves the problems listed above. We made the best way to read the Enchiridion with our user experience and interface`}
              </li>
              <li>
                {`Even though some translations aren't the best for everyone, they might be the favorites of some folks, so instead of pushing for one or another, we made it easy to read the one that works for YOU.`}
              </li>
              <li>
                {`We understand that books are hard to share, and with multiple file types that work for different devices with different applications, a project like this can grow out of control fast. That's why we took a step back and decided to serve the content from each translation in a way that's easy to read and share; nothing more, nothing less.`}
              </li>
            </ol>
          </Band>
          <Band headline={{ bold: "03", thin: "Design" }}>
            <h3>Goals</h3>
            <h3>Content first</h3>
          </Band>
          <Band headline={{ bold: "04", thin: "Development" }}>
            <h3>Becoming blazingly fast(?)</h3>
            {`
              Dealing manually with the hundreds of markdown files was out of the table as soon as I defined the project’s scope, but if I’m not cropping, formatting, and naming every file, how would they be ready for the app? Enter **automation**, it’s no secret developers love to automate mundane tasks so I felt this was the perfect opportunity to scratch an itch I had for months and learn a Blazingly fast™ general-purpose language. Of all of the options, one stood out as an easy yet powerful contestant: Golang has an easy typescript-like syntax and would chew through my use case as if it was nothing.
            `}

            {`With a poorly written first Go script, the Twitter thread that documents this project’s creation was born, and another one followed suit as I needed to bulk edit the files once more during the process. While using a new language was unnecessary and all the tasks could be done with Typescript, the feeling of learning something from scratch to solve problems is unmatched and honestly, a lot of fun!`}
            <h3>Incremental enhancement</h3>
            <h3>Responsive</h3>
          </Band>
          <Band headline={{ bold: "05", thin: "Results" }}>
            {`
               424 chapters,

               8 translations,
               
               490 pages,
               
               13200 dom elements in a page,
               
               straight 100s in Lighthouse,
               
               build times on vercel?
            `}
            <br />
            <br />
            <h3>Screenshots</h3>
            <br />
            <h3>Testimonials(? What should I actually call this?)</h3>
            <StyledLink href="https://clips.twitch.tv/PuzzledCredulousWerewolfDoubleRainbow-MMiwIWFES531KU-u">
              https://clips.twitch.tv/PuzzledCredulousWerewolfDoubleRainbow-MMiwIWFES531KU-u
            </StyledLink>
          </Band>
        </ProjectLayout>
      </ProjectContainer>
      <FABContainer>
        <BackToTop />
      </FABContainer>
    </>
  );
}

import { useTypeSafeTranslation } from "@/hooks/useTypeSafeTranslation";
import TransWithComps from "@/components/i18nStuff/TransWithComps";

import ProjectContainer from "@/components/ProjectStuff/ProjectContainer";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Seo from "@/components/Seo";
import Band from "@/components/Band";
import HeroBand from "@/components/HeroBand";
import Popover from "@/components/ui/Popover";
import { FABContainer } from "@/ui/primitives/";
import BackToTop from "@/ui/BackToTop";
import StyledLink from "@/ui/StyledLink";

import useMeta from "@/hooks/useMeta";
import { ProjectLayout } from "@/components/ProjectStuff/ProjectLayout";
