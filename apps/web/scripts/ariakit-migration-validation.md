# ariakit migration validation

run from the repository root:

```sh
pnpm --filter @igorbedesqui/web check:ui
pnpm build
PORT=3101 pnpm --filter @igorbedesqui/web start
# in another terminal:
MIGRATION_BASE_URL=http://127.0.0.1:3101 pnpm --filter @igorbedesqui/web test:ui
```

start through the web package: the source-showcase loaders read files relative to its working directory. starting `.output/server/index.mjs` from the repository root gives misleading route failures.

the runtime suite requires an existing server. it never starts, restarts, or selects a server port. `MIGRATION_CHROMIUM_EXECUTABLE` selects an existing browser when playwright's default executable is unavailable. `MIGRATION_TEST_OUTPUT` and `MIGRATION_EVIDENCE_DIR` override the artifact directories, which default to `ariakit-migration-results` and `ariakit-migration-evidence` under `os.tmpdir()`.

on nixos, provide the chromium runtime libraries, including `libgbm`, through the host's library environment. keep machine-specific store paths and cached-browser versions out of repository configuration.

## state matrix

| consumer                 | action/state                          | assertion/evidence                                                                                                             | viewport                         |
| ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| home/work                | internal link then keyboard back      | href, URL and destination content                                                                                              | desktop                          |
| email popover            | copy, Escape                          | clipboard payload, success label, mailto href, dismissal and focus restoration                                                 | desktop                          |
| composed popover         | keyboard open, Escape, outside click  | expanded state, content visibility, restored focus, no nested buttons                                                          | desktop                          |
| lightbox                 | keyboard open, Tab/Shift+Tab, Escape  | accessible name, inert background, no background control focus, transparent surface, zero padding, one close icon, restoration | desktop                          |
| lightbox                 | close button and surrounding canvas   | dismissal                                                                                                                      | desktop                          |
| game cells               | pointer, Space, Enter                 | live pressed state, no duplicate toggle                                                                                        | desktop                          |
| game board               | copy, step, play/pause, reset         | live serialized board and pressed state                                                                                        | desktop                          |
| grid overlay             | keyboard toggle                       | pressed state and actual computed opacity                                                                                      | desktop                          |
| code CopyButton          | copy and feedback reset               | payload matches displayed code, success label and reset                                                                        | desktop                          |
| button library           | link and composite keyboard selection | href, arrow focus, exclusive Space selection, no nested buttons                                                                | desktop                          |
| tooltip                  | hover, keyboard focus, Escape         | visibility, dismissal and retained anchor focus                                                                                | desktop                          |
| all static public routes | source-derived route inventory        | main content, client portal mounted, no uncaught hydration exceptions, source fingerprint attachment                           | desktop                          |
| email surface            | open in each theme/size               | visible ink, computed frame radius/padding, canvas, bounds, screenshot and source fingerprint                                  | 1280×900 and 390×844; light/dark |

## scope and limits

the source audit walks production `components`, `src`, and `lib` recursively. it checks behavior imports/re-exports/dynamic imports/requires, native button syntax, local frame composition, adaptive bordering relationships, silhouette borders, text that erases a layer, shared button/popover/dialog boundaries, semantic theme tokens and body canvas. icons remain allowed. native elements directly passed to an imported ariakit control's `render` prop are legitimate composition.

standalone class factories and component callers may supply fragments whose base comes from elsewhere. the checker does not attempt whole-program rendering analysis or treat prose/comment examples as executable markup. source checks cannot prove runtime accessibility, colors or geometry; the browser suite supplies those observations for the matrix above. theme checks are not a full contrast audit. clipboard writes use a browser-local stub; OS clipboard permissions and mail client launch remain untested. screenshots are local review artifacts, not published evidence. inspect screenshots before claiming visual coverage.

the node suite also evaluates the real DialogClose wrapper with installed ariakit, using isolated icon-slot and text consumers. an isolated mutation restoring the old `undefined` fallback must introduce the extra icon. native-button, import, class, theme, route discovery, quoted CSS glob and inventory fixtures exercise both bad and near-match source.

the route smoke derives public page paths from source; API routes, dynamic parameters, and the parent `/writing` layout are excluded. its child index is included. modal assertions follow ariakit's inert-based contract: `body` is an allowed Tab destination; interactive background elements are not.

## follow-up motion and geometry regressions

`ariakit-followup.spec.mjs` runs alongside the original route/navigation/copy/game/keyboard suite. run it alone against the existing server with:

```sh
MIGRATION_BASE_URL=http://127.0.0.1:3105 pnpm --filter @igorbedesqui/web test:ui ariakit-followup.spec.mjs
```

normal-motion tests observe native `getAnimations()` effects for popover, tooltip, scales presets and the modal lightbox backdrop. the probe observes lifecycle/style mutations as well as animation frames, so a short exit or shared-layout update cannot disappear between samples. it pauses, seeks and restores each effect in one synchronous browser turn; it does not inject transition CSS or replace browser clocks. attachments contain actual keyframes, durations and computed start/middle/end opacity and scale. a negative-control fixture must fail the same assertion when content simply appears without an effect. reduced-motion tests separately assert settled state, no running shell/backdrop effects, dismissal and focus restoration. the full-screen lightbox intentionally leaves image geometry to Motion rather than scaling its coordinate space twice.

the document contract replaces the old collection/timeline card and concentric-box requirements. at desktop/narrow widths, list groups, rows, timeline section/article/prose, inline code, default controls, inline fields and disclosure triggers must have zero computed persistent border and visible ring/shadow. focus outlines are allowed independently of surface edges. native floating popovers, menus, tooltips, listboxes and receipt previews may retain one meaningful edge; these checks deliberately do not impose borderless overlays. timeline markers/rails and interactive attachment artifacts are outside the prose-shell rule.

geometry checks read bounding boxes, text ranges, all four border/padding/margin widths and computed shadows. row text is compared with the list host's content coordinate. timeline period/title/story text is compared with its grid cell content coordinate, including the intentional rail reservation and gutter. retained Stage/media/code edges must be exactly 1px and place their inner edge on an independently chosen baseline: `frame.left + border.left = baseline - gutter`. the tolerance is 0.25 CSS px, so a 1px inward shift fails. no rule requires every wrapper's margin to equal minus its border: prose media/code deliberately combine a 16px gutter and 1px stroke into a -17px horizontal margin. default MDX code text must start on the prose baseline; custom scrollable code adds its explicitly measured frame and scroll padding to `baseline - 16px`. images start at the compensated media content edge. centred Stage children have intentional placement, so the first flex-start permutation Stage checks the frame content origin rather than treating its centred child as document prose. the final Stage sibling checks the auto-width row's right inner edge; media/code check both inner edges against the prose host, catching fixed-width frames that fail to grow by the cancelled stroke.

`document-geometry.test.mjs` executes the pure coordinate verifier against an uncompensated b1 failure, a compensated frame, combined gutter offsets and a gutter missing only its stroke compensation. it also rejects visual offsets without the matching negative horizontal margins. it also checks rejection of persistent inline borders/rings, acceptance of focus outlines and computed shadow sampling. the browser suite has an isolated CSS/DOM fixture using the same verifier; it rejects b1 without compensation and accepts both valid offsets. production DOM/CSS is never patched to make geometry pass. reference: installed `@ariakit/tailwind/readme.md` → frame margin, borders and rings (rings paint outside the border box); `@ariakit/react-components/src/disclosure/disclosure-content.tsx` → double-frame entry and CSS-duration leave retention.

focused checks against an existing server:

```sh
node --test apps/web/scripts/document-geometry.test.mjs
MIGRATION_BASE_URL=http://127.0.0.1:3105 pnpm --filter @igorbedesqui/web test:ui ariakit-followup.spec.mjs --grep 'document geometry'
MIGRATION_BASE_URL=http://127.0.0.1:3105 pnpm --filter @igorbedesqui/web test:ui
```

`check:ui` runs the pure geometry fixtures alongside the source-contract tests; `test:ui` exercises computed layout and the browser negative control. use one stable source/build pair: a source fingerprint is useful only when the served artifact matches that source.

run the final combined suite against one stable production build. live development reloads and missing hydration markers are infrastructure failures, not evidence that motion assertions passed. the follow-up tests do not add production fixture routes or alter application styles to manufacture passing motion.
