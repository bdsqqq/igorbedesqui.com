"use client";

import {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { FormInput, FormLabel, useFormStore } from "@ariakit/react";
import { Button } from "~/routes/library/button/-button";
import { createImageLoad, defaultOgText, generateOgUrl } from "./-model";
export { createImageLoad, defaultOgText, generateOgUrl } from "./-model";

type TextOwnership =
  | { text: string; onTextChange: (text: string) => void; defaultText?: never }
  | {
      text?: never;
      defaultText?: string;
      onTextChange?: (text: string) => void;
    };
export type OgPreviewData = { url: string; displayUrl?: string; alt?: string };
type PreviewOwnership =
  | { preview: OgPreviewData; previewUrl?: never; generatePreviewUrl?: never }
  | { previewUrl: string; preview?: never; generatePreviewUrl?: never }
  | {
      generatePreviewUrl?: (text: string) => string;
      previewUrl?: never;
      preview?: never;
    };
export type OgPreviewProps = TextOwnership &
  PreviewOwnership & { children?: ReactNode; origin?: string };

function useOgState(props: OgPreviewProps) {
  const inputId = useId();
  const [internal, setInternal] = useState(
    () => props.defaultText ?? defaultOgText,
  );
  const text = props.text ?? internal;
  const form = useFormStore({
    values: { text },
    setValues: ({ text: next }) => {
      if (props.text === undefined) setInternal(next);
      props.onTextChange?.(next);
    },
  });
  const deferredText = useDeferredValue(text);
  const generate = props.generatePreviewUrl ?? generateOgUrl;
  const previewUrl = props.preview?.url ?? props.previewUrl;
  const url = previewUrl !== undefined ? previewUrl : generate(deferredText);
  const displayUrl =
    props.preview?.displayUrl ??
    (previewUrl !== undefined ? previewUrl : generate(text));
  const [browserOrigin, setBrowserOrigin] = useState("");
  useEffect(() => {
    setBrowserOrigin(window.location.origin);
  }, []);
  const origin = props.origin ?? browserOrigin;
  const fullUrl =
    displayUrl.startsWith("/") && !displayUrl.startsWith("//")
      ? `${origin}${displayUrl}`
      : displayUrl;
  return {
    inputId,
    form,
    url,
    fullUrl,
    alt: props.preview?.alt ?? "OG image preview",
    isStale: text !== deferredText,
  };
}
const OgContext = createContext<ReturnType<typeof useOgState> | null>(null);
/** Custom editors share the root's form; replacing markup does not take over data. */
export function useOgPreview() {
  const context = useContext(OgContext);
  if (!context) throw new Error("og preview parts require OgPreview");
  return context;
}

/** Text defaults initialize once; key the root to reset. Keep ownership stable after mount.
 * Supplied previews bypass generation. Image completion never writes the text draft.
 */
export function OgPreview(props: OgPreviewProps) {
  const state = useOgState(props);
  return (
    <OgContext.Provider value={state}>
      {props.children === undefined ? <OgPreviewBody /> : props.children}
    </OgContext.Provider>
  );
}

export function OgPreviewBody() {
  return (
    <div className="flex flex-col gap-8">
      <OgTextEditor />
      <OgGeneratedUrl />
      <OgImagePreview />
    </div>
  );
}

export function OgTextEditor() {
  const { form, inputId } = useOgPreview();
  return (
    <div className="flex flex-col gap-2">
      <FormLabel store={form} name="text" className="text-sm ak-ink-80">
        text parameter (*text* for bold)
      </FormLabel>
      <FormInput
        store={form}
        name="text"
        id={inputId}
        render={<textarea rows={3} />}
        placeholder="hello, *world*"
        className="ak-layer ak-layer-lighten-6 ak-frame ak-frame-field/2 w-full resize-none px-3 placeholder:ak-ink-50 hover:ak-state-6 focus-visible:ak-outline focus-visible:outline-2 focus-visible:outline-offset-2"
      />
    </div>
  );
}

export function OgGeneratedUrl() {
  const { fullUrl } = useOgPreview();
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm ak-ink-80">generated url</span>
      <code className="ak-layer ak-layer-darken-3 ak-frame ak-frame-field/2 block overflow-x-auto px-3 text-sm ak-ink-80">
        {fullUrl}
      </code>
    </div>
  );
}

export function OgImagePreview() {
  const { url, isStale, alt } = useOgPreview();
  const [attempt, setAttempt] = useState(0);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string;
    status: "loading" | "ready" | "error";
  }>({
    url,
    status: "loading",
  });
  useEffect(() => {
    let active = true;
    const load = createImageLoad(url);
    setResult({ url, status: "loading" });
    load.promise.then(
      (outcome) => {
        if (!active) return;
        if (outcome.status === "ready") {
          setLoadedUrl(outcome.src);
          setResult({ url, status: "ready" });
        } else {
          setResult({ url, status: "error" });
        }
      },
      () => {
        if (active) setResult({ url, status: "error" });
      },
    );
    return () => {
      active = false;
      load.dispose();
    };
  }, [url, attempt]);
  const status = result.url === url ? result.status : "loading";
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm ak-ink-80">preview (1200×630)</span>
      <div
        className="ak-layer ak-layer-darken-2 ak-frame ak-frame-card/0 ak-frame-border -ak-frame-m-px transition-opacity duration-200"
        style={{
          opacity:
            isStale || (loadedUrl !== null && status === "loading") ? 0.7 : 1,
        }}
        aria-busy={status === "loading"}
      >
        {loadedUrl !== null ? (
          <img
            src={loadedUrl}
            alt={alt}
            className="ak-frame aspect-[1200/630] w-full object-cover"
          />
        ) : (
          <div className="ak-layer ak-layer-6 ak-frame aspect-[1200/630] w-full animate-pulse" />
        )}
        {status === "error" ? (
          <div role="alert">
            unable to load preview.{" "}
            <Button
              type="button"
              onClick={() => setAttempt((value) => value + 1)}
            >
              retry
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
