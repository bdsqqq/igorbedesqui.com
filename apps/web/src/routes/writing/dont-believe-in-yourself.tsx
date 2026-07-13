import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { MDX } from "@/components/MDX";
import { Blur } from "@/components/ui/Blur";

export const dontBelieveMeta = {
  shortName: "\u201CDon\u2019t believe in yourself\u201D",
  name: "\u201CDon\u2019t believe in yourself\u201D",
  description: "Shutting up my inner monologue by listening to people I trust.",
  date: "08/05/2023",
  urlSlug: "dont-believe-in-yourself",
  backMessage: "",
};

const getDontBelieve = createServerFn({ method: "GET" }).handler(() =>
  renderServerComponent(<DontBelieveContent />),
);

export const Route = createFileRoute("/writing/dont-believe-in-yourself")({
  loader: () => getDontBelieve(),
  component: DontBelieveRoute,
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

function DontBelieveRoute() {
  return Route.useLoaderData();
}

function DontBelieveContent() {
  return (
    <>
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
          em: (props) => <em className="italic text-gray-10" {...props} />,
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
    </>
  );
}
