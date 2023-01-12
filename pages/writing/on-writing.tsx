export default function Page({
  mdx,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Seo
        title={meta.name + " — Igor Bedesqui"}
        description={meta.description}
        url={`writing/${meta.urlSlug}`}
        ogText={meta.description}
      />
      <Container backable backAnchor="/writing">
        <Band id="01" gridless>
          <div className="max-w-prose mx-auto">
            <MDXRemote {...mdx.content} />
          </div>
        </Band>
      </Container>
    </>
  );
}

export const meta = {
  shortName: "on-writing",
  name: "On writing",
  description: "Thoughts on my relationship with writting.",
  date: "12/12/2022",
  urlSlug: "on-writing",
  backMessage: "",
};

const MDs = {
  content: `
   # On ways to write

   While chatting with amazing folks, I realized that content lies at the core of my passion for design and development. Picking apart past projects and things I’m excited about revealed the idea of “Elevating content through presentation” as a constant. The concept of content as the foundation of what I make brought attention to my personal site, as I like to describe it, [igorbedesqui.com](http://igorbedesqui.com) is a glorified playground, my safe space to overengineer and experiment. But *how can I hone the craft of elevating content through presentation if there’s no content?* my 2 year old site only had a few pages worth of text and although the project pages were fine, I felt a lot of resistance whenever I wanted to create something different. 
   <br/>

   ## On Resistance
   This resistance was primarily created by the disconnect between content and where it lived, due to my internationalization setup, I needed to keep every bit of content into files under an i18n folder and use it through functions in the actual pages and components. Since the content lived in JSON files, whenever I wanted to represent HTML tags or react elements, I needed to write fake tags and switch them on the page with a function from my i18n library. This was by no means a horrible experience and I even managed to [make it typesafe with autocomplete](https://twitter.com/bedesqui/status/1491902960187715584?s=20&t=yw9yRUPg5p0DBppP0ZaldQ), but it put enough resistance between me and writing that it was never my choice when asking “What should I do next?”. Additionally, internationalization is not only translating but making sure the tone, delivery, and structure are just right for both languages so the work of writing was always doubled.
   <br/>

   ## Escaping resistance

   To make writing as simple as possible, I dropped internationalization, cutting the effort needed in about half. To tackle the biggest barrier in the JSON files I switched to MDX, allowing me to write as if I was jotting down something on Notion but with the full power of React. Guilherme Rodz(GOAT) even [helped me with colocating the content in the same file it was used](https://twitter.com/guilherme_rodz/status/1593733413751734280?s=20&t=LrNxkFVt0nfuQcN429FgNQ). Look at this perfect solution

   \`\`\`jsx
   const MDs = {
      update: \`
         Lorem *ipsum* ...
      \`,
      why: {
         paragraph: \`... <Popover />\`
         popoverContent: \`...\`
      },
      ...
   }

   export const getStaticProps = async () => {
      const mdx = await mutateSerializeMdx(MDs);
      return { props: { mdx } };
   }

   export default function Page({mdx}){
      return(
         <MDXRemote {...mdx.update} />
         <MDXRemote {...mdx.why.paragraph} />
         ...
      )
   }
   \`\`\`
   <br/>
   But wait…
   although this is a cool API with clear benefits, it felt wrong, it still has too many steps. Before going further with anything, I took a break to think (or was forced to, time to move abroad!).

   <br/>
   first off, I did content in JSON because I needed it for i18n, but why am I using MDX now? markdown is an easier way to write HTML, and MDX is the same but with support for React stuff. I’m conflicted about this approach, it’s simple enough but it still takes the content away from where it belongs. It does allow me to write MDX so for the time being I’ll be using it in some places and ignoring it in others.
   `,
  popoverContent: `
   This resistance was primarily created by the disconnect between content and where it lived, due to my internationalization setup, I needed to keep every bit of content into files under an i18n folder and use it through functions in the actual pages and components. Since the content lived in JSON files, whenever I wanted to represent HTML tags or react elements, I needed to write fake tags and switch them on the page with a function from my i18n library. This was by no means a horrible experience and I even managed to [make it typesafe with autocomplete](https://twitter.com/bedesqui/status/1491902960187715584?s=20&t=yw9yRUPg5p0DBppP0ZaldQ), but it put enough resistance between me and writing that it was never my choice when asking “What should I do next?”. Additionally, internationalization is not only translating but making sure the tone, delivery, and structure are just right for both languages so the work of writing was always doubled.
  `,
};

export const getStaticProps: GetStaticProps<{
  mdx: RecursiveSerialize<typeof MDs>;
}> = async () => {
  const mdx = await mutateSerializeMdx(MDs);
  return { props: { mdx } };
};

import Band from "@/components/Band";
import Container from "@/components/Container";
import Seo from "@/components/Seo";
import PopOver from "@/components/ui/Popover";
import {
  mutateSerializeMdx,
  RecursiveSerialize,
} from "@/lib/mutateSerializeMdx";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
