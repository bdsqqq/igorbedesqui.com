import assert from "node:assert/strict";

// Smaller than one CSS pixel: the regression is a whole-pixel inward shift.
export function aligned(actual, expected, label = "document coordinate") {
  assert.ok(
    Number.isFinite(actual) && Number.isFinite(expected),
    `${label}: missing geometry`,
  );
  assert.ok(
    Math.abs(actual - expected) <= 0.25,
    `${label}: ${actual} != ${expected}`,
  );
}

export function borderless(box) {
  assert.deepEqual(box.border, [0, 0, 0, 0], `${box.tag}: persistent border`);
  assert.equal(
    box.visibleShadow,
    false,
    `${box.tag}: persistent ring/shadow: ${box.shadow}`,
  );
  // Focus outlines are deliberately independent of persistent surface edges.
}

/** The budget is supplied by the consumer, never inferred from the border or
 * its margin: otherwise an uncompensated edge could define its own baseline.
 * Gutters may combine with frame margins in one calc() declaration.
 */
export function compensated(
  box,
  { baseline, gutter = 0, padding = box.padding[3] },
) {
  assert.deepEqual(
    box.border,
    [1, 1, 1, 1],
    `${box.tag}: expected one 1px edge`,
  );
  aligned(
    box.left + box.border[3],
    baseline - gutter,
    "inner edge cancels stroke",
  );
  aligned(
    box.margin[3] + box.border[3],
    -gutter,
    "negative start margin cancels stroke",
  );
  aligned(
    box.margin[1] + box.border[1],
    -gutter,
    "negative end margin cancels stroke",
  );
  aligned(box.contentLeft, baseline - gutter + padding, "frame content start");
}

// Self-contained so Playwright can serialize it into the page. Reads only.
export function measure(element) {
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const sides = ["Top", "Right", "Bottom", "Left"];
  const border = sides.map((side) => parseFloat(style[`border${side}Width`]));
  const padding = sides.map((side) => parseFloat(style[`padding${side}`]));
  const margin = sides.map((side) => parseFloat(style[`margin${side}`]) || 0);
  // Computed Tailwind shadows include transparent zero-size placeholders.
  const shadows = style.boxShadow.split(/,(?![^()]*\))/);
  const visibleShadow = shadows.some((shadow) => {
    if (shadow.trim() === "none") return false;
    if (
      /rgba\([^)]*,\s*0(?:\.0+)?\s*\)|\/\s*0(?:\.0+)?\s*\)|#(?:0000|00000000)\b|\btransparent\b/.test(
        shadow,
      )
    )
      return false;
    const lengths =
      shadow
        .replace(/(?:rgba?|oklab|oklch|color)\([^)]*\)/g, "")
        .match(/-?[\d.]+px/g) ?? [];
    return lengths.some((length) => Math.abs(parseFloat(length)) > 0);
  });
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node;
  let textLeft = null;
  while ((node = walker.nextNode())) {
    const index = node.textContent.search(/\S/);
    if (index < 0) continue;
    const range = document.createRange();
    range.setStart(node, index);
    range.setEnd(node, index + 1);
    const first = range.getClientRects()[0];
    if (first?.width > 0) {
      textLeft = first.left;
      break;
    }
  }
  return {
    tag: element.tagName,
    left: rect.left,
    right: rect.right,
    width: rect.width,
    border,
    padding,
    margin,
    shadow: style.boxShadow,
    visibleShadow,
    contentLeft: rect.left + border[3] + padding[3],
    contentRight: rect.right - border[1] - padding[1],
    textLeft,
  };
}
