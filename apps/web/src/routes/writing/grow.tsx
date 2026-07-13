import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { MDX } from "@/components/MDX";

export const growMeta = {
  shortName: "Grow",
  name: "Grow",
  description: "Isn't this what you wanted? To grow?",
  date: "",
  urlSlug: "grow",
  backMessage: "",
};

const getGrowContent = createServerFn({ method: "GET" }).handler(() => {
  return renderServerComponent(<GrowContent />);
});

export const Route = createFileRoute("/writing/grow")({
  loader: () => getGrowContent(),
  component: GrowRoute,
  head: () => ({
    meta: [
      { title: `${growMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: growMeta.description,
      },
    ],
  }),
});

function GrowRoute() {
  return Route.useLoaderData();
}

function GrowContent() {
  return (
    <MDX>
      {`
         Isn't this what you wanted?

         To grow?

         You wish to be kind so you are tested with negativity.

         You wish to be strong so you are tested with weakness.

         You wish to love so you are tested with loneliness.

         The universe doesn't work like you do. You wask for something, it provides you with to prove you deserve what you are asking for.

         Why do you think people stay the same their entire lives. To elevate is extremely hard. It is significantly easier to not improve yourself.

         It's a tough journey on your mind, body and souk. But I believe in you. Seek the infinite potential within you.
      `}
    </MDX>
  );
}
