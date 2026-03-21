import { createFileRoute } from "@tanstack/react-router";
import WasmGifPage from "app/work/wasmgif/page";
import { wasmGifMeta } from "app/work/metas";

export const Route = createFileRoute("/work/wasmgif")({
  component: WasmGifPage,
  head: () => ({
    meta: [
      { title: `${wasmGifMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: wasmGifMeta.description,
      },
    ],
  }),
});
