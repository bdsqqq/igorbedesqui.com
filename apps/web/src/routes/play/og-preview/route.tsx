import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import Container from "@/components/Container";
import Band from "@/components/Band";
import { Suspense, useDeferredValue, use } from "react";
import {
  FormInput,
  FormLabel,
  useFormStore,
  useStoreState,
} from "@ariakit/react";

const imageCache = new Map<string, Promise<string>>();

function loadImage(src: string): Promise<string> {
  if (typeof window === "undefined") {
    return Promise.resolve(src);
  }
  if (!imageCache.has(src)) {
    imageCache.set(
      src,
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = reject;
      }),
    );
  }
  return imageCache.get(src)!;
}

function OgImage({ src }: { src: string }) {
  use(loadImage(src));
  return (
    <img
      src={src}
      alt="OG image preview"
      className="ak-frame aspect-[1200/630] w-full object-cover"
    />
  );
}

function OgPreviewPlayPage() {
  const form = useFormStore({
    defaultValues: { text: "hello, *world*\nthis is a new line" },
  });
  const text = useStoreState(form, (state) => state.values.text);
  const deferredText = useDeferredValue(text);
  const isStale = text !== deferredText;

  const toApiFormat = (str: string) => str.replace(/\n/g, "/n");
  const ogUrl = `/api/og?text=${encodeURIComponent(toApiFormat(deferredText))}`;
  const displayUrl = `/api/og?text=${encodeURIComponent(toApiFormat(text))}`;
  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${displayUrl}`
      : displayUrl;

  return (
    <Container>
      <div className="flex flex-col gap-16">
        <Band headline={{ bold: "OG", thin: "Preview" }}>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <FormLabel store={form} name="text" className="text-sm ak-ink-80">
                text parameter (*text* for bold)
              </FormLabel>
              <FormInput
                store={form}
                name="text"
                id="og-text"
                render={<textarea rows={3} />}
                placeholder="hello, *world*"
                className="ak-layer ak-layer-lighten-6 ak-frame ak-frame-field/2 w-full resize-none px-3 placeholder:ak-ink-50 hover:ak-state-6 focus-visible:ak-outline focus-visible:outline-2 focus-visible:outline-offset-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm ak-ink-80">generated url</span>
              <code className="ak-layer ak-layer-darken-3 ak-frame ak-frame-field/2 block overflow-x-auto px-3 text-sm ak-ink-80">
                <ClientOnly fallback={displayUrl}>{fullUrl}</ClientOnly>
              </code>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm ak-ink-80">preview (1200×630)</span>
              <div
                className="ak-layer ak-layer-darken-2 ak-frame ak-frame-card/0 ak-frame-border -ak-frame-m-px transition-opacity duration-200"
                style={{ opacity: isStale ? 0.7 : 1 }}
              >
                <Suspense
                  fallback={
                    <div className="ak-layer ak-layer-6 ak-frame aspect-[1200/630] w-full animate-pulse" />
                  }
                >
                  <OgImage src={ogUrl} />
                </Suspense>
              </div>
            </div>
          </div>
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
