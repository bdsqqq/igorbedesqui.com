import { createFileRoute } from "@tanstack/react-router";
import { MDX } from "@/components/MDX";

export const growMeta = {
  shortName: "Grow",
  name: "Grow",
  description: "Isn't this what you wanted? To grow?",
  date: "",
  urlSlug: "grow",
  backMessage: "",
};

export const Route = createFileRoute("/writing/grow")({
  component: GrowPage,
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

function GrowPage() {
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
