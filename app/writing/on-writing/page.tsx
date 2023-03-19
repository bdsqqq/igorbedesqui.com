import Container from "@/components/Container";
import Band from "@/components/Band";

import { onWritingMeta } from "app/writing/metas";

import { MDX } from "@/components/MDX";
import PopOver from "@/components/ui/Popover";
import type { Metadata } from "next";

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
  title: `${onWritingMeta.name} - Igor Bedesqui`,
  description: onWritingMeta.description,
  slug: `/writing/${onWritingMeta.urlSlug}`,
  ogText: `*${onWritingMeta.name}*;/n ${onWritingMeta.description}`,
});

export default async function Basics() {
  return (
    <Container backable backAnchor="/writing">
      <Band id="01" gridless>
        <div className="mx-auto max-w-prose">
          <MDX>
            {`
               # On ways to write

               While chatting with amazing folks, I realized that content lies at the core of my passion for design and development. Picking apart past projects and things I’m excited about revealed the idea of “Elevating content through presentation” as a constant. The concept of content as the foundation of what I make brought attention to my personal site, as I like to describe it, [igorbedesqui.com](http://igorbedesqui.com) is a glorified playground, my safe space to overengineer and experiment. But *how can I hone the craft of elevating content through presentation if there’s no content?* my 2 year old site only had a few pages worth of text and although the project pages were fine, I felt a lot of resistance whenever I wanted to create something different. 
               <br/>

               ## On Resistance
               This resistance was primarily created by the disconnect between content and where it lived, due to my internationalization setup, I needed to keep every bit of content into files under an i18n folder and use it through functions in the actual pages and components. Since the content lived in JSON files, whenever I wanted to represent HTML tags or react elements, I needed to write fake tags and switch them on the page with a function from my i18n library. This was by no means a horrible experience and I even managed to [make it typesafe with autocomplete](https://twitter.com/bedesqui/status/1491902960187715584?s=20&t=yw9yRUPg5p0DBppP0ZaldQ), but it put enough resistance between me and writing that it was never my choice when asking “What should I do next?”. Additionally, internationalization is not only translating but making sure the tone, delivery, and structure are just right for both languages so the work of writing was always doubled.
               <br/>

               ## Escaping resistance

               To make writing as simple as possible, I dropped internationalization, cutting the effort needed in about half. To tackle the biggest barrier in the JSON files I switched to MDX, allowing me to write as if I was jotting down something on Notion but with the full power of React. Guilherme Rodz(GOAT) even [helped me with colocating the content in the same file it was used](https://twitter.com/guilherme_rodz/status/1593733413751734280?s=20&t=LrNxkFVt0nfuQcN429FgNQ). Look at this ~~perfect~~ solution

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
               <br/>
            `}
          </MDX>
          <MDX
            components={{
              Update1: () => (
                <time className="text-xs font-bold text-gray-9">
                  March 14th 2023
                </time>
              ),
              Popover: (props) => (
                <PopOver
                  content={
                    <MDX>
                      {`Especially in cases where your content heavily uses links, bolds, italics, and all the other things that would require a whole tag with props to express in JSX.`}
                    </MDX>
                  }
                >
                  {props.children}
                </PopOver>
              ),
            }}
          >
            {`
              ## Update <Update1 />

              After dogfooding this approach to markdown on this very website, I can confidently say <Popover>it helps</Popover>. As much as you can format your content in plain JSX, MDX makes it easier to write and *read* without taking power away. I prefer reading some *'s and _'s over a \`<span>\` soup every time.
              <br/>

              Preparing to migrate to Next.js 13’s [App directory](https://beta.nextjs.org/docs/routing/fundamentals#the-app-directory), I ran into enough bugs with my MDX solution that the absolute GOAT, [Marcos S.](https://twitter.com/MarcosNASAG), helped me [rewrite it into a much safer approach with no mutations](https://github.com/bdsqqq/igorbedesqui.com/commit/e32f8ab38d323105ce8f99e68387d91b34e1bbdf). While at it, he planted the seed of a simpler API in my head. What if \`<MDX>**Content**</MDX>\` just worked™? Knowing that the server has to serialize the content meant this approach would be hacky at best, and straight-up impossible at worst. That is, without server components.
              <br/>

              Fast forwarding to my migration to Next.js 13, the notion of "server code in getStaticProps, then prop drill to components" became obsolete. In the App directory, you can await server code on the component itself. With the only barrier between me and Marcos’ API shattered, I implemented it in what felt like seconds, thanks to the efforts of the Next.js team and the [Remote-MDX maintainers](https://github.com/hashicorp/next-mdx-remote/pull/331).
              <br/>

              Now, my concerns of MDX adding too many steps flipped upside down, NOT writing it has more overhead. The current API looks like the following:

              \`\`\`jsx
              import MDX from 'components/MDX';

              export default function Page(){
                return(
                  <MDX>
                    {\`
                      # Oh wow,
                      This just **works**.
                    \`}
                  </MDX>
                )
              }
              \`\`\`
              <br/>

              Finally, the editor is getting out of my way as I write. And if this approach sounds interesting to you, it's completely [open source](https://github.com/bdsqqq/igorbedesqui.com/commit/ca21b5310a46507ffced1cee661ffa841fc6e40c#diff-d74a4ce4a0768fddc7c86e5e492dbe087d78e9eb05a8e40f8d82c54392766437) and easy to incrementally adopt.
          `}
          </MDX>
        </div>
      </Band>
    </Container>
  );
}
