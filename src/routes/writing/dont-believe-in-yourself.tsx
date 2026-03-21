import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/Container";
import Band from "@/components/Band";
import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";
import { grid } from "@/components/ui/Grid";

export const dontBelieveMeta = {
  shortName: "\u201CDon\u2019t believe in yourself\u201D",
  name: "\u201CDon\u2019t believe in yourself\u201D",
  description: "Shutting up my inner monologue by listening to people I trust.",
  date: "08/05/2023",
  urlSlug: "dont-believe-in-yourself",
  backMessage: "",
};

export const Route = createFileRoute("/writing/dont-believe-in-yourself")({
  component: DontBelievePage,
  head: () => ({
    meta: [
      { title: `${dontBelieveMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: dontBelieveMeta.description,
      },
    ],
  }),
});

function DontBelievePage() {
  return (
    <Container key="basics" backable backAnchor="/writing">
      <Band id="01" gridless>
        <div className={grid()}>
          <div className="prose col-start-1 col-end-5 space-y-4 md:col-start-2 md:col-end-8 lg:col-start-3 lg:col-end-15">
            <MDX
              components={{
                Blur: (props) => (
                  <Blur className="cursor-not-allowed" {...props} />
                  // https://twitter.com/MarcosNASAG/status/1656626373534916608?s=20
                ),
                blockquote: (props) => (
                  <blockquote
                    className="-indent-4 text-3xl text-gray-12 sm:-indent-6 sm:text-5xl"
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
               > "Don't believe in yourself. Believe in the me that believes in you"
               
               Is a cheesy quote from an over the top animation that had way too much of an impact on me recently. 
               
               <br />
               Throughout my development, I had the privilege to consider a few people "mentors" and even if we didn't talk frequently, their sheer existence made me grow. Of course, their direct input played a big role, but something maybe more important is the fact that **I can ignore my own limits by acknowledging that they trust me; Who the f<Blur>**uck**</Blur> am I to say that I can't do something if THEY think I can?**
               
               Taking this idea further, I often find myself adding my own thoughts on top of things people I admire say or giving my own meaning to their words, somehow this makes me more confident in ideas that were my own to begin with. 
               
               _The people who make others grow the most didn't master being meaningful, but presenting the opportunity for meaning._
               
               <br />
               I'll eventually outgrow this, but right now, I'm happy to use such amazing people as facades that enable trust in myself, even if indirectly.
            `}
            </MDX>
          </div>
        </div>
      </Band>
    </Container>
  );
}
