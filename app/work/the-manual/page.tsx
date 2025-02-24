import HeroBand from "@/components/HeroBand";
import CodeAndDemoButtons from "@/components/ProjectStuff/CodeAndDemoButtons";
import Container from "@/components/Container";
import Tooltip from "@/components/ui/Tooltip";
import type { Metadata } from "next";

import { psykipMeta, bebopMeta } from "../metas";
import { MDX } from "@/components/MDX";
import Image from "next/image";
import {
  PopoverProvider,
  PopoverContent,
  StyledPopoverTrigger,
} from "@/components/ui/Popover";
import StyledLink from "@/components/ui/StyledLink";
import Band from "@/components/Band";
import { grid, subGrid } from "@/components/ui/Grid";
import { SidebarContent } from "@/components/ProjectStuff/ProjectLayout";
import { Separator } from "@/ui/Separator";
import { cn } from "@/lib/styling";
import { Border } from "@/components/ui/Border";

import { makeSeo } from "@/lib/makeSeo";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export const metadata: Metadata = makeSeo({
  title: "The Manual",
  description:
    "A carefully crafted web experience, enabling frictionless reading of a variety of translations of the Enchiridion from Epictetus",
  slug: "/work/the-manual",
  ogText: "The best way to read the enchiridion",
});

const g = grid({ mode: "narrow" });
const slottedInMiddleWide =
  "col-start-1 col-end-5 md:col-start-1 md:col-end-9 lg:col-start-4 lg:col-end-14";
const slottedInMiddle =
  "col-start-1 col-end-5 md:col-start-2 md:col-end-8 lg:col-start-5 lg:col-end-13";

export default async function TheManual() {
  return (
    <Container
      backAnchor="/work"
      key="the-manual"
      backable
      backMessage={psykipMeta.backMessage}
    >
      <HeroBand heroVideo="/videos/the-manual/cat">
        <span className="text-gray-12">
          The best way to read the Enchiridion.
        </span>
        <div className="mt-6">
          <CodeAndDemoButtons
            codeUrl="https://github.com/bdsqqq/psykip"
            demoUrl="https://psykip.vercel.app/"
          />
        </div>
      </HeroBand>

      <div className="flex flex-col gap-20">
        <Band gridless id="why">
          <div className={cn(g)}>
            <div className="prose col-span-4 mb-8 mt-16 space-y-4 lg:col-span-8 lg:col-start-2">
              <MDX
                components={{
                  strong: (props) => (
                    <span className="text-gray-12" {...props} />
                  ),
                }}
              >
                {`
               The Enchiridion is a fascinating, easy read filled with valuable insights. Unfortunately—even with multiple public domain translations—reading it is often a bad experience.
               
               Between old and sometimes confusing language, hard to find and even harder to download files, and outdated websites, there are too many barriers between an interested reader and the book.         
               
               [**The Manual**](https://psykip.vercel.app) addresses these issues trough a **carefully crafted** web experience, enabling frictionless reading of a variety of translations.
               `}
              </MDX>
            </div>
          </div>
        </Band>
        <Band gridless id="direction">
          <div className={cn(g, "gap-y-8")}>
            <div className={cn(slottedInMiddle, "space-y-2")}>
              <MDX
                components={{
                  h2: (props) => (
                    <h2 className="mb-4 block text-2xl font-bold" {...props} />
                  ),
                  strong: (props) => (
                    <span className="text-gray-12" {...props} />
                  ),
                }}
              >
                {`
                ## Design direction

                While the content is the focal point of the site, its presentation is how we solved the problems listed above. **Balancing the tension between the simplicity of “just text on a page” and the limitless possibilities of the web, I choose to take inspiration from print and offer an *almost* “Just text” experience**, where **interactive elements fade in as you reach for them but don’t disturb your reading**.

                The “Reading progress” flow best exemplifies these interactive elements; Nothing is said as the user reads a translation, but when they visit the homepage again, a subtle text indicates their reading progress. If they choose to read the same translation, an option to continue from where they left off appears. **My goal was to make this a “wow moment” inspired by video games that sets the tone of the site, “things will work without getting in your way”**.
              `}
              </MDX>
            </div>
            <div className="relative col-span-full -mx-4 lg:col-start-1 lg:col-end-14 lg:-mx-0">
              <Border asWrapper className="rounded">
                <video
                  className=""
                  autoPlay={false}
                  controls={true}
                  loop={true}
                  muted={true}
                >
                  <source
                    src="/videos/the-manual/reading_progress.webm"
                    type="video/webm"
                  />
                  <source
                    src="/videos/the-manual/reading_progress.mp4"
                    type="video/mp4"
                  />
                </video>
              </Border>
            </div>
            <div className="col-span-3 col-end-[-1] flex items-end md:col-end-9 lg:col-start-14 lg:col-end-17">
              <div className="-mx-4 h-fit rounded border border-gray-A02 bg-gradient-to-b from-gray-A03 to-gray-A02 p-4 text-gray-09">
                <MDX>
                  {`
                      *The recent dark theme update follows the same “show, don’t tell” pattern by choosing a theme based purely on system preferences, and a “highlights” feature is planned in the [public roadmap](https://psykip-git-next-bdsq.vercel.app/roadmap).*
                    `}
                </MDX>
              </div>
            </div>
          </div>
        </Band>
        <Band gridless id="visual">
          <div className={cn(g, "gap-y-6")}>
            <h2 className={cn(slottedInMiddle, "block text-2xl font-bold")}>
              Visual design
            </h2>
            <div className={cn(slottedInMiddle)}>
              <MDX
                components={{
                  strong: (props) => (
                    <span className="text-gray-12" {...props} />
                  ),
                }}
              >
                {`**The visual design of the site exaggerates the print aesthetic and feel by heavily borrowing defining characteristics and working within carefully built constraints**:`}
              </MDX>
            </div>
            <MDX
              components={{
                ol: (props) => (
                  <ol
                    className={cn(
                      subGrid({ lg: 8, md: 8, sm: 4 })(),
                      slottedInMiddleWide,
                      "list-inside list-decimal gap-y-4 marker:text-gray-08",
                    )}
                    {...props}
                  />
                ),
                li: (props) => <li className="col-span-4" {...props} />,
                strong: (props) => <span className="text-gray-12" {...props} />,
              }}
            >
              {`
              1. **Links have directional arrows**, going to translations is represented by pointing to the right, and going towards the landing page is represented by pointing to the left, **mimicking the turn of pages in a book, forward to the content, and back to the index**.
              1. **No “HUD-y” menu**, the site needs navigation but it felt right to put links along the body of the document, contextualizing them and **allowing users to explore “paths” through the book**.
              1. **No “button-y” buttons**, clickable elements with clearly defined borders and backgrounds felt out of place in a book. Instead, I made deliberate use of **underlined text for links** and **icons for various interactions**.
              1. **No pure black or white**, **shades of tinted gray feel more real**, and **with a grainy overlay achieve a paper-like look**.
              `}
            </MDX>

            <div
              className={cn("col-span-4 flex flex-col gap-y-8 lg:col-span-8")}
            >
              <figure className={"space-y-2"}>
                <Border asWrapper className="rounded">
                  <Image
                    className="w-full rounded"
                    alt=""
                    src={"/images/projs/the-manual/1.jpg"}
                    width={685}
                    height={993}
                  />
                </Border>
                <figcaption className="text-sm italic tracking-wide text-gray-10">
                  The landing page mimics a book cover.
                </figcaption>
              </figure>

              <figure className={"space-y-2"}>
                <Border asWrapper className="rounded">
                  <Image
                    className="w-full rounded"
                    alt=""
                    src={"/images/projs/the-manual/2.jpg"}
                    width={685}
                    height={993}
                  />
                </Border>
                <figcaption className="text-sm italic tracking-wide text-gray-10">
                  The chapters borrow from actual books with generous line
                  heights, chapter numbers and drop caps.
                </figcaption>
              </figure>
            </div>

            <div
              className={cn("col-span-4 flex flex-col gap-y-8 lg:col-span-8")}
            >
              <figure className={"space-y-2"}>
                <Border asWrapper className="rounded">
                  <Image
                    className="w-full "
                    alt=""
                    src={"/images/projs/the-manual/5.jpg"}
                    width={1505}
                    height={993}
                  />
                </Border>
                <figcaption className="text-sm italic tracking-wide text-gray-10">
                  The “compare” pages were inspired by newspapers’s approach to
                  dense information in using columns, adapted to the infinite
                  scrollable canvas of the web to include more whitespace and
                  wider columns.
                </figcaption>
              </figure>

              <figure className={"space-y-2"}>
                <div className="space-y-2">
                  <Border asWrapper className="rounded">
                    <Image
                      className="w-full"
                      alt=""
                      src={"/images/projs/the-manual/3.jpg"}
                      width={1505}
                      height={993}
                    />
                  </Border>
                  <Border asWrapper className="rounded">
                    <Image
                      className="w-full"
                      alt=""
                      src={"/images/projs/the-manual/4.jpg"}
                      width={1505}
                      height={993}
                    />
                  </Border>
                </div>
                <figcaption className="text-sm italic tracking-wide text-gray-10">
                  The About and Sources pages use layouts inspired by magazines
                  with their horizontal spread and use of whitespace.
                </figcaption>
              </figure>
            </div>
          </div>
        </Band>
        <Band gridless id="nerds">
          <div className={cn(g, "space-y-4")}>
            <div className={cn(slottedInMiddle, "prose space-y-4")}>
              <MDX
                components={{
                  h2: (props) => (
                    <h2 className="mb-4 text-2xl font-bold" {...props} />
                  ),
                  Popover: (props) => (
                    <PopoverProvider {...props}>
                      <StyledPopoverTrigger>
                        {props.children}
                        <QuestionMarkCircledIcon />
                      </StyledPopoverTrigger>
                      <PopoverContent
                        options={{
                          padding: "none",
                        }}
                      >
                        <figure className="space-y-1 pb-2">
                          <Image
                            alt=""
                            src={"/images/projs/the-manual/kindle.jpg"}
                            width={540}
                            height={720}
                          />
                          <figcaption className="text-center">
                            <MDX>{`[More pics on Twitter](https://twitter.com/bedesqui/status/1579608624514871296?s=20)`}</MDX>
                          </figcaption>
                        </figure>
                      </PopoverContent>
                    </PopoverProvider>
                  ),
                  strong: (props) => (
                    <span className="text-gray-12" {...props} />
                  ),
                }}
              >
                {`
                ## Technical details for nerds

                Before writing any user-facing code, I spent some time [playing with golang to transform 8 translations into 424 markdown files](https://twitter.com/bedesqui/status/1557388112032137218?s=20). Then, [wrote other scripts to bulk-edit these files and their metadata as needed](https://twitter.com/bedesqui/status/1560750830302760965?s=20).
                
                **I approached development from a static-first angle**, the site is usable with javascript disabled and on pretty much any device, *it even* <PopoverProvider>*ran on my kindle*</PopoverProvider>. Leveraging [Astro](astro.build/) I **generated hundreds of pages for translations, chapters, and comparisons using data from the markdown files** to populate a few templates. 
                
                For the interactive bits, I used islands of [Solid.js](https://www.solidjs.com/) and scripts with no framework. Deploying on [Vercel](vercel.com/) meant **sub-minute build times even with 490 pages, including the monstrous [“compare all translations” page](psykip.vercel.app/compare/all) with 13200 DOM elements**. Additionally, **[tailwindcss](https://tailwindcss.com/) allowed me to colocate styles and markup without sacrificing functionality**. 
                
                Other relevant technical details include: Prefetching of next pages based on user interaction, resulting in snappy navigation for an Multi Page Application, relocation of analytics script to web workers via [Partytown](https://partytown.builder.io/), and build time image optimization to speed up the site.

                <br />
                For further details, refer to [the source code available on GitHub](https://github.com/bdsqqq/psykip/).
                `}
              </MDX>
            </div>
          </div>
        </Band>
        <Band gridless id="meta">
          <div className={cn(g)}>
            <div
              className={cn(
                slottedInMiddle,
                subGrid({
                  lg: 8,
                  md: 8,
                  sm: 4,
                })(),
                "gap-y-4",
              )}
            >
              <SidebarContent projMeta={psykipMeta} />
              <div className="col-span-full mt-12">
                <h3 className="font-bold text-gray-09">Next project</h3>
                <StyledLink href={`/work/${bebopMeta.urlSlug}`}>
                  {bebopMeta.name}
                </StyledLink>
              </div>
            </div>
          </div>
        </Band>
        {/* <Band gridless id="results">
          <div className="flex justify-center">
            <figure className="w-fit">
              <blockquote
                className="text-2xl"
                cite="https://clips.twitch.tv/PuzzledCredulousWerewolfDoubleRainbow-MMiwIWFES531KU-u"
              >
                <MDX
                  components={{
                    a: ({ href, ...rest }) => (
                      <StyledLink
                        href={href as string}
                        className="no-underline"
                        {...rest}
                      />
                    ),
                  }}
                >
                  {`[“This is what EPUBs should be”](https://clips.twitch.tv/PuzzledCredulousWerewolfDoubleRainbow-MMiwIWFES531KU-u)`}
                </MDX>
              </blockquote>
              <figcaption className="text-center">
                <MDX>{`Brynn, Co-founder @ [pingdotgg](https://ping.gg/)`}</MDX>
              </figcaption>
            </figure>
          </div>
          <div className={cn(grid())}>
            <ul></ul>
          </div>
        </Band> */}

        {/* <Band headline={{ bold: "05", thin: "Results" }}>
          <MDX>
            {`
               424 chapters,

               8 translations,
               
               490 pages,
               
               13200 dom elements in a page,
               
               straight 100s in Lighthouse,
               
               build times on vercel?

               ## Screenshots

               ## Testimonials

               https://clips.twitch.tv/PuzzledCredulousWerewolfDoubleRainbow-MMiwIWFES531KU-u
              `}
          </MDX>
        </Band>
        <Band headline={{ bold: "03", thin: "Attributions" }}>
          <MDX
            components={{
              ul: (props) => (
                <ul
                  className="list-outside list-disc marker:text-gray-08"
                  {...props}
                />
              ),
            }}
          >
            {`
              - Epictetus Version from [el.wikisource.org](https://el.wikisource.org/wiki/%CE%95%CE%B3%CF%87%CE%B5%CE%B9%CF%81%CE%AF%CE%B4%CE%B9%CE%BF%CE%BD)
              - Elizabeth Carter Translation from [mit.edu](http://classics.mit.edu/Epictetus/epicench.html)
              - George Long Translation from [wikisource.org](http://en.wikisource.org/wiki/Enchiridion)
              - P.E. Matheson Translation from [letsreadgreek.com](http://www.letsreadgreek.com/epictetus/mattheson.htm)
              - Stephen Walton Translation from [ideonautics.net](http://www.ideonautics.net/manual2.htm)
              - T.W. Higginson Translation from [tufts.edu](http://www.perseus.tufts.edu/hopper/text?doc=urn:cts:greekLit:tlg0557.tlg002.perseus-eng2:1)
              - T.W. Rolleston Translation from [letsreadgreek.com](http://www.letsreadgreek.com/epictetus/rolleston.htm)
              - William Abbott Oldfather Translation from [en.wikisource.org](https://en.wikisource.org/wiki/Epictetus,_the_Discourses_as_reported_by_Arrian,_the_Manual,_and_Fragments/Manual)
              <br/>
              I took eight markdown files from [Tasuki's website](https://enchiridion.tasuki.org/), then updated their metadata and divided them into 424 files for the individual chapters. My versions of the files are available on [Github](https://github.com/bdsqqq/psykip/tree/master/src/data).
            `}
          </MDX>
        </Band> */}
      </div>
    </Container>
  );
}
