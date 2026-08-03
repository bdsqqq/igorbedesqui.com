// VERIFIED: beat facts are traced to the listed archive receipts.
// this is evidence for igor to write from, not page copy.
// the timeline spine must tell the whole story without interaction.
// the spine ends at the final marker; it does not imply a next chapter.
// selected words reveal the continuation inline; there is no details block.
// revealed continuations may contain deeper triggers.
// ped.ro is the interaction reference: trigger and continuation share a sentence.
// unlike ped.ro, closed text leaves flow so this page genuinely unfolds.
// a short blur masks insertion; paragraph layout itself does not distort.
// routine hover motion stays under 200ms and remains interruptible.
// discovery may travel farther, but never bounces or queues.
// large cards start near full scale; nothing grows from zero.
// closing a parent resets disclosures nested inside it.
// every closed sentence remains complete enough to skim.
// deeper levels add evidence and tension; they never repair a missing premise.
// multiple beats may stay open so readers can compare periods.
// reveal buttons expose expanded state and their controlled inline content.
// attachments behave like footnotes, not a portfolio gallery.
// every attachment must prove, complicate, or falsify its beat.
// counterevidence belongs beside successful work.
// private source links are author research handles, not public verification.
// public verification needs a safe on-page artifact or excerpt.
// references are numbered once in reading order across the page.
// hovering or focusing a reference previews its artifact at that anchor.
// leaving the first preview discovers the artifact into one global pile.
// exactly one artifact instance renders: hidden, anchored, or collected.
// later previews borrow the artifact from the pile until dismissed.
// anchor and pile locations share its id for the layout transition.
// the discovered pile sticks near the viewport top while the timeline scrolls.
// the pile floats independently of timeline columns rather than occupying a row.
// artifacts favor readable document proportions over thumbnail proportions.
// each artifact owns its dimensions; anchor and pile never override them.
// hovering or focusing the pile fans it like a hand of cards.
// every card contains its own title, description, and source context.
// source-specific styling should resemble the artifact without forging it.
// reference and card hover share one active artifact across the page.
// active artifacts brighten related story fragments; unrelated text recedes.
// sibling cards recede so the active artifact keeps visual ownership.
// undiscovered artifacts never render in a collection.
// the collection remains the sticky side pile; there is no bottom gallery.
// “free” artifacts need their own future discovery moment.
// free artifacts may preserve personal moments without proving a claim.
// full screenshots may use LightBox after the stack interaction.
// reduced motion keeps every disclosure without rotation or stagger.
// story fields are interaction scaffolds, not final prose.
// facts remain separate so rewriting the story cannot erase evidence.
// strengths and tensions are writing prompts, not verdicts.
// review excerpts keep author relationship and review-cycle context.
// Linear status proves workflow state, not deployment or impact.
// PR size proves scope, not quality or value.
// archive totals stay off-page until a sentence gives them meaning.
// closed PRs may be iterations superseded by cleaner merged work.
// the repository was axiomhq/app; the team called it nexus internally.
// HUNCH: the page arc is craft → reusable systems → agents.
// scope, focus, visibility, and completion are part of that arc.
// “a system that designs itself” is a hypothesis, not a factual claim.
// the supported mechanism is preserving intent through composition.
// HUNCH: users, colleagues, and agents consume one product model differently.
// HUNCH: users need coherence; colleagues need blocks; agents need contracts.
// igor writes the final prose; this file stays factual and terse.
// the route remains draft and unlisted until the story is written.

export type AxiomReceipt = {
  detail: string;
  href?: string;
  id: string;
  kind: "calendar" | "commit" | "issue" | "pr" | "review" | "screenshot";
  label: string;
  source: string;
};

export type AxiomRevealNode = AxiomReveal | string;

export type AxiomReveal = {
  after?: string;
  before?: string;
  content: readonly AxiomRevealNode[];
  receiptIds?: readonly string[];
  trigger: string;
};

export type AxiomBeat = {
  id: string;
  label: string;
  period: string;
  receipts: readonly AxiomReceipt[];
  story: AxiomReveal;
};

// personal screenshots and calendar moments can be added here without citations.
export const axiomFreeReceipts: readonly AxiomReceipt[] = [];

const placeholderReceipt = (
  id: string,
  kind: AxiomReceipt["kind"],
  href?: string,
): AxiomReceipt => ({
  detail: "Consectetur adipiscing elit, sed do eiusmod tempor.",
  href,
  id,
  kind,
  label: "Lorem ipsum dolor sit amet",
  source: "Ut labore et dolore magna aliqua",
});

const placeholderStory = (receiptIds: readonly string[]): AxiomReveal => {
  const splitAt = Math.ceil(receiptIds.length / 2);

  return {
    after: ".",
    before: "Lorem ipsum ",
    content: [
      " Consectetur adipiscing elit ",
      {
        after: ".",
        content: [" Tempor incididunt ut labore et dolore magna aliqua."],
        receiptIds: receiptIds.slice(splitAt),
        trigger: "sed do eiusmod",
      },
    ],
    receiptIds: receiptIds.slice(0, splitAt),
    trigger: "dolor sit amet",
  };
};

export const axiomBeats = [
  // anchor: first months; broad product/codebase exposure; early praise.
  // counterpoint: ask for help sooner and keep changes smaller.
  {
    id: "learn-the-product",
    label: "Lorem ipsum dolor sit amet",
    period: "Lorem 01",
    receipts: [
      placeholderReceipt(
        "pr-345",
        "pr",
        "https://github.com/axiomhq/app/pull/345",
      ),
      placeholderReceipt("review-2023-07", "review"),
    ],
    story: placeholderStory(["pr-345", "review-2023-07"]),
  },
  // anchor: Tailwind, color ownership, and primitives became shared foundations.
  // counterpoint: migration breadth could hide the conceptual change.
  {
    id: "plant-the-system",
    label: "Lorem ipsum dolor sit amet",
    period: "Lorem 02",
    receipts: [
      placeholderReceipt(
        "pr-463",
        "pr",
        "https://github.com/axiomhq/app/pull/463",
      ),
      placeholderReceipt(
        "pr-545",
        "pr",
        "https://github.com/axiomhq/app/pull/545",
      ),
      placeholderReceipt(
        "pr-1101",
        "pr",
        "https://github.com/axiomhq/app/pull/1101",
      ),
      placeholderReceipt(
        "pr-1200",
        "pr",
        "https://github.com/axiomhq/app/pull/1200",
      ),
    ],
    story: placeholderStory(["pr-463", "pr-545", "pr-1101", "pr-1200"]),
  },
  // anchor: navigation joined entities, hierarchy, routes, and interactions.
  // counterpoint: estimation, scope, and deciding when to stop.
  {
    id: "unify-navigation",
    label: "Lorem ipsum dolor sit amet",
    period: "Lorem 03",
    receipts: [
      placeholderReceipt(
        "pr-610",
        "pr",
        "https://github.com/axiomhq/app/pull/610",
      ),
      placeholderReceipt("review-2024-06", "review"),
    ],
    story: placeholderStory(["pr-610", "review-2024-06"]),
  },
  // anchor: peers sought product-quality judgment and credited visual quality.
  // counterpoint: support work and informal ownership were hard to make visible.
  {
    id: "design-authority",
    label: "Lorem ipsum dolor sit amet",
    period: "Lorem 04",
    receipts: [
      placeholderReceipt("review-2023-12", "review"),
      placeholderReceipt("review-2025-08", "review"),
    ],
    story: placeholderStory(["review-2023-12", "review-2025-08"]),
  },
  // anchor: query, datasets, and views exercised reusable UI under product load.
  // counterpoint: datasets repeated focus and visibility concerns.
  {
    id: "systems-in-features",
    label: "Lorem ipsum dolor sit amet",
    period: "Lorem 05",
    receipts: [
      placeholderReceipt(
        "pr-1724",
        "pr",
        "https://github.com/axiomhq/app/pull/1724",
      ),
      placeholderReceipt(
        "pr-3221",
        "pr",
        "https://github.com/axiomhq/app/pull/3221",
      ),
      placeholderReceipt(
        "pr-5039",
        "pr",
        "https://github.com/axiomhq/app/pull/5039",
      ),
      placeholderReceipt(
        "pr-4962",
        "pr",
        "https://github.com/axiomhq/app/pull/4962",
      ),
    ],
    story: placeholderStory(["pr-1724", "pr-3221", "pr-5039", "pr-4962"]),
  },
  // anchor: typography, icons, lint, and docs encoded design constraints.
  // counterpoint: invisible systems work still needed project-level visibility.
  {
    id: "encode-judgment",
    label: "Lorem ipsum dolor sit amet",
    period: "Lorem 06",
    receipts: [
      placeholderReceipt(
        "pr-5078",
        "pr",
        "https://github.com/axiomhq/app/pull/5078",
      ),
      placeholderReceipt(
        "pr-6484",
        "pr",
        "https://github.com/axiomhq/app/pull/6484",
      ),
      placeholderReceipt(
        "pr-6494",
        "pr",
        "https://github.com/axiomhq/app/pull/6494",
      ),
      placeholderReceipt(
        "pr-6547",
        "pr",
        "https://github.com/axiomhq/app/pull/6547",
      ),
    ],
    story: placeholderStory(["pr-5078", "pr-6484", "pr-6494", "pr-6547"]),
  },
  // anchor: agent workflows reused product contracts, feedback, and verification.
  // counterpoint: this work competed with concentrated UI ownership.
  {
    id: "design-for-agents",
    label: "Lorem ipsum dolor sit amet",
    period: "Lorem 07",
    receipts: [
      placeholderReceipt(
        "pr-7172",
        "pr",
        "https://github.com/axiomhq/app/pull/7172",
      ),
      placeholderReceipt("review-2026-02", "review"),
      placeholderReceipt(
        "pr-7184",
        "pr",
        "https://github.com/axiomhq/app/pull/7184",
      ),
      placeholderReceipt(
        "pr-7357",
        "pr",
        "https://github.com/axiomhq/app/pull/7357",
      ),
    ],
    story: placeholderStory([
      "pr-7172",
      "review-2026-02",
      "pr-7184",
      "pr-7357",
    ]),
  },
  // anchor: feature freeze, the new product, emerging explicit ownership.
  // counterpoint: the layoff ended unfinished work and was not performance-based.
  {
    id: "unfinished-resolution",
    label: "Lorem ipsum dolor sit amet",
    period: "Lorem 08",
    receipts: [
      placeholderReceipt(
        "pr-7694",
        "pr",
        "https://github.com/axiomhq/app/pull/7694",
      ),
      placeholderReceipt("review-termination", "review"),
    ],
    story: placeholderStory(["pr-7694", "review-termination"]),
  },
] as const satisfies readonly AxiomBeat[];
