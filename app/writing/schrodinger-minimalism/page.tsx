import Container from "@/components/Container";
import Band from "@/components/Band";

import { schrodingerMinimalism } from "app/writing/metas";

import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import type { Metadata } from "next";
import { grid } from "@/components/ui/Grid";

import { makeSeo } from "@/lib/makeSeo";

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
          <div className="col-start-1 col-end-5 space-y-4 md:col-start-2 md:col-end-8 lg:col-start-5 lg:col-end-13">
            <MDX
              components={{
                Blur: (props) => (
                  <Blur className="cursor-not-allowed" {...props} />
                  // https://twitter.com/MarcosNASAG/status/1656626373534916608?s=20
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
               > “Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.” 
                
               While I generally agree with this idea, and use it as guidance when designing, **there’s something that is lost when we omit details**, especially when writing. YES, I can express the same general idea with way less text, but it’s not the same.

               _// todo: make this a popover/link to the book_
               The author of **"The timeless way of building"** (great book btw) chooses to both follow and disregard the quote at once. **It’s a book you can read to the end while ignoring the majority of it**. Some paragraphs of the are written in normal text and others in italic, and the general idea the author tries to convey can be understood by reading exclusively the ones in italic. 

               I LOVED this concept, it is the best of both worlds! BUT it’s not granular enough. **The author doesn’t make an italic sentence in the middle of a paragraph**. **But who’s stopping me from doing it?**
               
               _**High contrast,** low contrast, **and <Blur>**hidden**</Blur> text became my building blocks.**_

               Yet, **it didn't feel finished.** Unlike the book, I can’t explain this system to the reader without disrupting their journey. And sometimes I just find the variation noisy. The reader can understand the general idea by only reading the high contrast bits, but **how do I expect them to ignore all the rest if it’s in front of them?**

               Enter "Hidden" text, as a way of expressing myself more freely, I’ve put some things in blurried bits of text that are revealed on hover. With progressive disclosure the ask goes from "ignore this" to "click this if you want to know more".

               **How do I make the reader know they can interact with something explicitly hidden?**

               Benji and Pedro got it... By starting with the minimum necessary to tell the story, and giving more context based on what interactive parts the reader clicks, both the simplified essential version and the richer more detailed version can exist in the same place at once without overloading the reader.

               // video of pedro and benji’s website goes here
               // https://ped.ro/
               // https://lfe.org/

               Anyways, nice site @peduarte, and thanks for taking my obsession with somehow applying progressive disclosure to the main content of something one step further.
              `}
            </MDX>
          </div>
        </div>
      </Band>
    </Container>
  );
}
