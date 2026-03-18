/**
 * ```md
 * with ios 26, apple made all of our browsers a bit more immervise,
 * by letting content render behind the url, and status bars in safari.
 *
 * ┌────────────────┐ ┐
 * ├time──notch─wifi┤ │
 * │                │ │ content can fill
 * │                │ │ ALL of this, including
 * ├──┌─http//───┐──┤ │ behind the url and status bar
 * └──└──────────┘──┘ ┘
 *
 * i dig it a lot, but they made the annoying decision to CLIP the
 * viewport we can use just outside of these newly visible areas,
 * so our beautiful "fullscreen" overlays are now NOT fullscreen.
 *
 * ┌────────────────┐
 * ├time──notch─wifi┤ ┐ our viewport is
 * │                │ │ limited to this tho.
 * │                │ │ anything outside
 * ├──┌─http//───┐──┤ ┘ gets clipped.
 * └──└──────────┘──┘
 *
 * after ripping my hair out, and dumpster diving through people's
 * repos, I found that there isn't a way to FORCE a non-body element
 * to render behind the url and status bar. (as of 2026-03-17)
 *
 * so the unforunate best solution is to gaslight safari into rendering
 * solid backdrops behind those areas for us.
 *
 * shoutouts
 * to @andesco for https://github.com/andesco/safari-color-tinting?tab=readme-ov-file#safari-26-position-fixed-or-body
 * and to @pcraig3 for https://github.com/pcraig3/ghog-day/commit/e73de0df3ef592f3cee68a4c8732938988294d24
 *
 *
 * as of 2026-03-17, the gaslighting needs a `fixed` element,
 * at least `4px`(for top) or `5px`(for bottom) tall,
 * with a `background color`, and `z-index` HIGHER than everything else
 * ```
 */
export function Fuck_you_safari_for_taking_my_fullscreen_overlays_I_guess_Im_stuck_rendering_solids_behind_your_liquid_ass() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: "4px",
          background: "var(--color-gray-01)",
          pointerEvents: "none",

          zIndex: 999,
        }}
      />
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          height: "5px",
          background: "var(--color-gray-01)",
          pointerEvents: "none",
          zIndex: 999,
        }}
      />
    </>
  );
}
