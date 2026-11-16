# isolated composition fixture

exercise actual production components without the application router/server. each host owns its own layout and outcomes; the same feature receives supplied data, state, or markup without a second implementation.

run from `apps/web`, sequentially on the 4 gb host:

```sh
pnpm exec vite build --config scripts/composition.vite.config.mts
pnpm exec vite preview --config scripts/composition.vite.config.mts --host 127.0.0.1 --port 3116
```

with preview running, use another terminal:

```sh
COMPOSITION_BASE_URL=http://127.0.0.1:3116 pnpm exec playwright test --config scripts/composition.playwright.config.mjs
```

set `MIGRATION_CHROMIUM_EXECUTABLE` when using an existing chromium binary. this suite never starts a server. one worker, zero retries, failure screenshots and retained failure traces go to `/tmp/composition-playwright-results`. build output is the ignored `apps/web/node_modules/.cache/composition-fixture` directory. this config deliberately excludes tanstack/start, nitro and route generation.

all eight scenarios import production components directly. `fixture.css` imports the real route stylesheet and explicitly includes production component sources in tailwind discovery. the body uses `ak-layer ak-layer-canvas`. no production route or component was added. no component implementation, patched production DOM, or copied production styles stand in for a real component.

| query              | assertions                                                                                                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `?case=primitives` | empty/default/getter copy, actual ref and native click forwarding, cancellation, success/error/retry callbacks, email content, controlled tooltip and false/zero content                                                         |
| `?case=images`     | image and lightbox refs, actual image completion, controlled opening, nested modal focus and dismissal                                                                                                                           |
| `?case=game`       | empty board then real nine-cell boards, independent supplied/owned roots, board/cell props and cancellation, default controls and custom playback, replacement/removal while running, external timer survival and owned disposal |
| `?case=axiom`      | supplied empty beats then identical beat/receipt ids in two roots, controlled/default collection, reordered parts, unique aria targets, reveals, previews, selection and keyboard order independence                             |
| `?case=scales`     | empty presets/drafts then default presets, controlled/default roots, reordered inputs/results, invalid draft retention while defaults compute, valid zero output                                                                 |
| `?case=og`         | supplied preview and preview url bypass generator requests, empty/dirty controlled text, default/custom generation, delayed obsolete image completion, failed current image and retry                                            |
| `?case=motion`     | external/owned synced and bouncy roots, nested pointer geometry, repeated crosshairs, focused portalled content, static pokemon dex zero and no api requests                                                                     |
| `?case=layouts`    | supplied empty breadcrumbs/projects then custom rows, router bypass with native anchors, native refs/styles/aria, headline/hero slots, project band option overrides, documented portal provider                                 |

story collection fixtures reserve 64px above animated hands through the production `AxiomCollection.style` prop, so a lifted card cannot intercept an adjacent control during pointer focus changes. the default page geometry is unchanged.

append `&host=dialog` or `&host=popover` to mount the same scenario in a controlled production overlay, bounded to 340 px high. tests cover page/dialog/popover for the first seven scenarios; layout coverage uses the page. the overlay checks cover bounds, overflow scrolling when present, caller-controlled close/reopen, focus containment and escape restoration. feature fixtures receive no application provider; only the layout fixture uses a caller-created `PortalStoreProvider` because `Container` includes the toolbox portal consumer.

`window.composition` is typed in `controller.ts`. its actions only change caller state, manipulate caller stores through production contracts, or unmount subtrees. inspection reads refs, caller callback state and captured stores. timer observers intentionally outlive feature unmounts, so unsubscription cannot fake successful disposal.

`?case=primitives&fault=ref` and `&fault=click` deliberately use broken caller render endpoints around the actual `CopyButton`. the same `assertReplacement` helper checks good and broken endpoints. two tests expect rejection for the missing ref or click contract. they must fail the same assertion that accepts the forwarding endpoint; discovering the tests alone does not validate that sensitivity.

clipboard writes use a browser capability adapter installed before navigation. image requests use `page.route` responses with a small valid svg, including the real image component's vercel optimizer url. OG tests intercept the actual image url and count `/api/og` requests; supplied data must make none. this exercises browser loading and races without depending on remote image services. it does not validate the OG server renderer, clipboard permissions, vercel optimization, animation appearance, or every decorative element.

build from the same source as the application checks and inspect failure artifacts before claiming portability. the suite leaves production defects visible rather than patching component DOM/styles to pass. explicitly empty story output is attached but has no painted box. tooltip focus tests use real keyboard navigation: pointer-opened popover autofocus is not keyboard intent. image layout styles belong to unpic; its supported class/layout props, not a dropped style prop, provide customization.
