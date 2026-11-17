# page-owned features

a showcase page is part of the feature it demonstrates. keep its implementation, operations, types, tests, and assets in the same directory. reuse does not transfer ownership to a central `components/features` tree.

`route.tsx` is the router entry; `-`-prefixed files are importable feature modules ignored by route discovery. import those modules directly—even from another feature—rather than importing the route entry. physical colocation does not make an operation depend on the router or a mounted page.

page adapters compose layout, navigation, and toolbox placement with feature roots. roots own data interpretation and local behavior; parts use the nearest root. changing a host or replacing an input must not require another implementation of that behavior.

these demos have no business-data query layer. static metadata, presets, cells, and sprite indexes stay static; there is no invented ID-fetch mode. supplied `[]`, `0`, empty drafts, and `false` are deliberate values. OG previews still load the selected image URL; supplied previews bypass URL generation, not image loading.

## choose data, state, and markup independently

```tsx
// supplied data; feature owns state and default markup
<AxiomStory beats={beats} />;
<GameOfLife initialCells={cells} />;

// caller coordinates state without replacing markup
<Scales values={draft} onValuesChange={setDraft} presets={[]} />;
<OgPreview text={text} onTextChange={setText} previewUrl={suppliedUrl} />;

// caller owns structure, not simulation behavior
<GameOfLifeRoot store={game}>
  <GameOfLifeControls />
  <aside>
    <GameOfLifeBoard />
  </aside>
</GameOfLifeRoot>;

// the same form parts work inside an interactive overlay
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <Scales presets={[]}>
      <ScalesResults />
      <ScalesInputs />
    </Scales>
  </DialogContent>
</Dialog>;
```

`useScales`, `useOgPreview`, and `useAxiomInteraction` let custom parts retain the root's native stores/actions. the default parts use those same hooks. game, cursor, and bouncy-tooltip modules likewise expose their roots, parts, stores, and hooks. parts report a missing root rather than falling back to a page context. tooltips are for read-only presentation; use a dialog/popover for editing.

ownership defaults initialize once. keep controlled/uncontrolled mode and supplied-store identity stable after mount; remount with a key to replace the owner or reset the draft. controlled values follow caller props. each story scopes receipt indexes, DOM IDs, and layout animation identity to its own root.

receipt cards can lift 48px above their hand. packed hosts can reserve that overhang through `AxiomCollection`'s native layout props (the bounded fixture uses 64px top padding); changing layout does not change selection or data ownership.

game playback accepts a `PlaybackScheduler` dependency at `createGameOfLifeStore(cells, scheduler)`. UI callers use its runtime default; standalone callers/tests supply `repeat(tick, periodMs) => cancel` without replacing timer globals.

creators own external-store disposal. unmounting a supplied game root does not stop its store's timer; unmounting an owned root does. removing or replacing controls does not own playback. seeds, replacements, and snapshots are copied so one game cannot mutate another caller's cells. `clear()` preserves current dimensions; `reset()` restores the seed.

## effects and shells

`copyText` in `lib/clipboard.ts` is callable without a component and resolves its browser adapter only when invoked. it returns a tagged success/error result for unavailable or rejected clipboard access; synchronous adapter bugs still reject. `CopyButton` and `EmailPopoverContent` handle failure and permit retry without calling `onCopied` or closing a host. image loading likewise returns ready/error outcomes, independently of its preview UI. a caller can choose that outcome explicitly:

```tsx
<EmailPopoverContent
  email={email}
  copyButtonProps={{ onCopied: () => setOpen(false) }}
/>
```

native render props preserve handlers, refs, ARIA, and event cancellation. pass behavioral props through a replacement; the isolated fixture intentionally drops them in negative controls. image refs address the actual image; unpic owns layout styles, so use its supported layout/class props rather than an unsupported style prop.

`MainNav` can use application history, while `MainNavView` takes explicit history. supplied empty history does not subscribe to the application service. a supplied `UnstyledLink.render` owns routing instead of secretly requiring the router. `Container` remains an application shell and documents its portal dependency through the fixture; features do not import that shell. native layout props, explicit section IDs, headline/media replacements, project rows, and project-band option overrides remain independent of data ownership.

## checks

- `pnpm check:ui`: source/geometry guards, clipboard/ownership failures, pure feature models, and real-component static output.
- `pnpm check:api`: positive/negative consumer calls plus an in-memory weakened-union control. the normal build typechecks those consumers too. strict null checking is required; explicit `undefined` follows the absent-prop path with the current optional-property configuration.
- `scripts/composition-fixture/README.md`: actual page/dialog/popover hosts, request counters, independent instances, dirty drafts, retries, native replacement contracts, and resource lifetime checks. this fixture is not a production route.
