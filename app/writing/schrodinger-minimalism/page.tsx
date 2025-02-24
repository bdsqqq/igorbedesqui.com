import Container from "@/components/Container";
import Band from "@/components/Band";

import { schrodingerMinimalism } from "app/writing/metas";

import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import type { Metadata } from "next";
import { grid } from "@/components/ui/Grid";

import { makeSeo } from "@/lib/makeSeo";
import { Border } from "@/components/ui/Border";
import Tooltip from "@/components/ui/Tooltip";
import {
  PopoverProvider,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

export const metadata: Metadata = makeSeo({
  title: `${schrodingerMinimalism.name} - Igor Bedesqui`,
  description: schrodingerMinimalism.description,
  slug: `/writing/${schrodingerMinimalism.urlSlug}`,
  ogText: `*${schrodingerMinimalism.name}*;/n ${schrodingerMinimalism.description}`,
});

export default async function Basics() {
  return (
    <Container
      backMessage={schrodingerMinimalism.backMessage}
      key="basics"
      backable
      backAnchor="/writing"
    >
      <Band id="01" gridless>
        <div className={grid()}>
          <div className="prose col-start-1 col-end-5 space-y-4 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15">
            <MDX
              components={{
                Blur: (props) => <Blur {...props} />,
                Popover: (props) => (
                  <PopoverProvider>
                    <PopoverTrigger {...props} />
                    <PopoverContent gutter={0}>
                      <MDX>
                        [Antoine de Saint-Exupéry: Terre des hommes, Gallimard,
                        France, 1939](https://amzn.eu/d/3FDtHJw)
                      </MDX>
                    </PopoverContent>
                  </PopoverProvider>
                ),
                Tooltip: (props) => (
                  <Tooltip content="great book btw" {...props} />
                ),
                blockquote: (props) => (
                  <blockquote
                    className="-indent-2 text-xl text-gray-12 sm:-indent-2 sm:text-xl"
                    {...props}
                  />
                ),
                strong: (props) => <span className="text-gray-12" {...props} />,
                em: (props) => (
                  <em className="italic text-gray-10" {...props} />
                ),
              }}
            >
              {`
                # **${schrodingerMinimalism.name}** <Blur>**AKA: me yapping about design patterns I like.**</Blur>

               > “Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.”
               > 
               > <div className="text-sm before:content-['—'] flex gap-1 justify-end w-full"><PopoverProvider><cite>Antoine de Saint-Exupéry</cite></PopoverProvider></div>
                
               While I generally agree with this idea, and use it as guidance when designing, **there’s something that is lost when we omit details**, especially when writing. YES, I can express the same general idea with way less text, but it’s not the same.

               The author of <Tooltip>[**The timeless way of building**](https://a.co/d/htgOE1S)</Tooltip> chooses to both follow and disregard the quote at once. **It’s a book you can read to the end while ignoring the majority of it**. It’s main concept can be grasped by reading only the paragraphs written in italic; As the author explains: surface understanding of the whole is more valuable than deeper understanding of a fraction.

               I LOVED this concept, it is the best of both worlds! BUT it’s not granular enough. **The author doesn’t make an italic sentence in the middle of a paragraph**. **But who’s stopping me from doing it?**
               
               _**High contrast,** low contrast, **and <Blur>**hidden**</Blur> text became my building blocks.**_

               Yet, **it didn't feel finished.** Unlike the book, I can’t explain this system to the reader without disrupting their journey. And sometimes I just find the variation noisy. The reader can understand the general idea by only reading the high contrast bits, but **how do I expect them to ignore all the rest if it’s in front of them?**

               **Enter "Hidden" text**, as a way of expressing myself more freely, I’ve put some things in blurried bits of text that are revealed on hover. **With progressive disclosure the ask goes from "ignore this" to "click this if you want to know more"**.

               [Benji](https://x.com/benjitaylor) and [Pedro](https://x.com/peduarte) arrived at the same conclusion with slightly different approaches; By starting with the minimum necessary to tell the story, and giving more context based on what interactive parts the reader clicks, both the simplified essential version and the richer more detailed version can exist in the same place at once without overloading the reader.
               
               No better way to see it than to look at their sites:
            `}
            </MDX>

            <figure>
              <Border asWrapper className="rounded">
                <video
                  poster="/images/minimalism/pedro.jpg"
                  autoPlay={true}
                  controls={false}
                  loop={true}
                  muted={true}
                >
                  <source
                    src="/videos/minimalism/pedro.webm"
                    type="video/webm; codecs=vp9,vorbis"
                  />
                  <source src="/videos/minimalism/pedro.mp4" type="video/mp4" />
                </video>
              </Border>
              <figcaption className="text-end">
                <MDX>{`https://ped.ro/`}</MDX>
              </figcaption>
            </figure>

            <figure>
              <Border asWrapper className="rounded">
                <video
                  poster="/images/minimalism/los_feliz.jpg"
                  autoPlay={true}
                  controls={false}
                  loop={true}
                  muted={true}
                >
                  <source
                    src="/videos/minimalism/los_feliz.webm"
                    type="video/webm; codecs=vp9,vorbis"
                  />
                  <source
                    src="/videos/minimalism/los_feliz.mp4"
                    type="video/mp4"
                  />
                </video>
              </Border>
              <figcaption className="text-end">
                <MDX>{`https://lfe.org/`}</MDX>
              </figcaption>
            </figure>

            <MDX>
              {`
               Anyways, nice site [@peduarte](https://x.com/peduarte), and thanks for taking my obsession with somehow applying progressive disclosure to main content one step further.
               `}
            </MDX>
          </div>
        </div>
      </Band>
    </Container>
  );
}
