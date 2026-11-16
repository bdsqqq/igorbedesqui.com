import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/Container";
import { ArrowRightIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Border } from "@/components/ui/Border";

function StyleCompositionPlayPage() {
  return (
    <Container>
      <div className="flex flex-col gap-16">
        <div className="grid min-h-[80vh] place-items-center">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="ak-layer ak-layer-darken-3 ak-frame ak-frame-field/2">
                <pre className="w-28">
                  {`<Box />
<Image />`}
                </pre>
              </div>
              <div className="h-4 w-4 text-base">
                <ArrowRightIcon />
              </div>
              <div className="ak-layer ak-layer-lighten-6 ak-frame ak-frame-card/0.5 ak-frame-bordering flex flex-col gap-2">
                <div className="ak-layer ak-layer-6 ak-frame ak-frame-field/0 from-(--ak-layer) to-(--ak-edge) h-20 w-20 bg-gradient-to-br" />
                <div className="ak-frame ak-frame-field/0 h-20 w-20 bg-[url(https://images.unsplash.com/photo-1536311312982-31ed42ebc0f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=30)] bg-contain" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="ak-layer ak-layer-darken-3 ak-frame ak-frame-field/2">
                <pre className="w-28">
                  {`<Border>
  <Box />
</Border>

<Border>
  <Image />
</Border>
`}
                </pre>
              </div>
              <div className="h-4 w-4 text-base">
                <ArrowRightIcon />
              </div>
              <div className="ak-layer ak-layer-lighten-6 ak-frame ak-frame-card/0.5 ak-frame-bordering flex flex-col gap-2">
                <Border>
                  <div className="ak-layer ak-layer-6 ak-frame ak-frame-field/0 from-(--ak-layer) to-(--ak-edge) h-20 w-20 bg-gradient-to-br" />
                </Border>
                <Border>
                  <div className="ak-frame ak-frame-field/0 h-20 w-20 bg-[url(https://images.unsplash.com/photo-1536311312982-31ed42ebc0f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2274&q=30)] bg-contain" />
                </Border>
              </div>
            </div>
            <p className="text-right">
              <span className="inline-flex items-center gap-1">
                Inspect the boxes <ArrowUpIcon />
              </span>
              <br />
              No weird wrappers or helper divs!
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export const Route = createFileRoute("/play/style-composition")({
  component: StyleCompositionPlayPage,
  head: () => ({
    meta: [{ title: "Style composition — Play — Igor Bedesqui" }],
  }),
});
