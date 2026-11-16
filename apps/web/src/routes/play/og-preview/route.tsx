import { createFileRoute } from "@tanstack/react-router";
import Container from "@/components/Container";
import Band from "@/components/Band";
import { OgPreview } from "@/components/features/og-preview";

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

export const Route = createFileRoute("/play/og-preview")({
  component: OgPreviewPlayPage,
  head: () => ({
    meta: [{ title: "OG Preview — Play — Igor Bedesqui" }],
  }),
});
