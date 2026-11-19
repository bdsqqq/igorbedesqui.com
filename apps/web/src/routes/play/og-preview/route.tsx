import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/route-catalog";
import Container from "@/components/Container";
import Band from "@/components/Band";
import { OgPreview } from "~/routes/play/og-preview/-preview";

function OgPreviewPlayPage() {
  return (
    <Container>
      <div className="flex flex-col gap-16">
        <Band headline={{ bold: "OG", thin: "Preview" }}>
          <OgPreview />
        </Band>
      </div>
    </Container>
  );
}

const page = {
  name: "OG Preview",
};

export const Route = createFileRoute("/play/og-preview")({
  component: OgPreviewPlayPage,
  staticData: { page },
  head: () => pageHead(page, "Play"),
});
