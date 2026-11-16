"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  createContext,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Button as AriakitButton,
  Disclosure,
  DisclosureContent,
  DisclosureProvider,
  Portal,
} from "@ariakit/react";
import { grid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import type { AxiomBeat, AxiomReceipt, AxiomReveal } from "./types";
import {
  createReceiptIndex,
  emptyCollection,
  normalizeCollection,
  updateCollection,
  type AxiomCollectionState,
} from "./model";
export type {
  AxiomBeat,
  AxiomReceipt,
  AxiomReveal,
  AxiomRevealNode,
} from "./types";
export type { AxiomCollectionState } from "./model";
const receiptLayoutId = (id: string) => `axiom-attachment-${id}`;
const fastEase = [0.16, 1, 0.3, 1] as const;
const fastSpring = {
  damping: 42,
  mass: 0.7,
  stiffness: 520,
  type: "spring" as const,
};
const layoutSpring = {
  damping: 34,
  mass: 0.9,
  stiffness: 340,
  type: "spring" as const,
};
const MotionButton = motion.create(AriakitButton);
const MotionDisclosureContent = motion.create(DisclosureContent);

const fanBias = 0.85;
const maxFanWidth = 880;

const receiptStyles = {
  calendar: {
    pigment: "ak-text-[#d29922]",
    kind: "calendar",
  },
  commit: {
    pigment: "ak-text-[#238636]",
    kind: "commit",
  },
  issue: {
    pigment: "ak-text-[#1f6feb]",
    kind: "linear issue",
  },
  pr: {
    pigment: "ak-text-[#8957e5]",
    kind: "merged pull request",
  },
  review: {
    pigment: "ak-ink-70",
    kind: "performance review",
  },
  screenshot: {
    pigment: "ak-text-[#db6d28]",
    kind: "screenshot",
  },
} satisfies Record<AxiomReceipt["kind"], { pigment: string; kind: string }>;

type CollectionInteraction = {
  activeId: string | null;
  dismissPreview: (id: string) => void;
  previewId: string | null;
  receiptOrder: readonly string[];
  reorder: (id: string, targetIndex: number) => void;
  select: (id: string) => void;
  selectedId: string | null;
  setActive: (id: string | null) => void;
  showPreview: (id: string) => void;
};

function ReceiptArtifact({
  number,
  receipt,
}: {
  number?: number;
  receipt: AxiomReceipt;
}) {
  const style = receiptStyles[receipt.kind];

  return (
    <div
      className="ak-layer ak-layer-lighten-6 ak-frame ak-frame-card/5 ak-frame-border -ak-frame-m-px flex min-h-44 w-[calc(100vw-2rem)] max-w-[29.5rem] flex-col text-left shadow-xl shadow-[color-mix(in_oklab,var(--ak-layer),transparent_80%)]"
      data-receipt-id={receipt.id}
    >
      <span className="mb-4 flex items-center justify-between font-sans text-xs uppercase tracking-wide ak-ink-70">
        <span className={cn("ak-text", style.pigment)}>{style.kind}</span>
        {number ? <span>{String(number).padStart(2, "0")}</span> : null}
      </span>
      <strong
        className={cn(
          "block text-base leading-tight",
          receipt.kind === "review" && "font-serif text-lg font-normal",
        )}
      >
        {receipt.label}
      </strong>
      <span
        className={cn(
          "mt-3 block text-base leading-snug",
          receipt.kind === "review" && "font-serif",
        )}
      >
        {receipt.detail}
      </span>
      <span className="mt-auto block pt-4 font-sans text-xs ak-ink-70">
        {receipt.source}
      </span>
    </div>
  );
}

function FoundReceiptReference({
  interaction,
  receipt,
}: {
  interaction: CollectionInteraction;
  receipt: AxiomReceipt;
}) {
  const { receiptNumberById } = useAxiomStory();
  const contentId = useId();
  const prefersReducedMotion = useReducedMotion();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [anchorPosition, setAnchorPosition] = useState<{
    bottom: number;
    left: number;
  } | null>(null);
  const isOpen = interaction.previewId === receipt.id;
  const isDiscovered = interaction.receiptOrder.includes(receipt.id);
  const number = receiptNumberById.get(receipt.id);

  if (!number) return null;

  const preview = () => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const bounds = anchor.getBoundingClientRect();
    const cardWidth = Math.min(472, window.innerWidth - 32);
    setAnchorPosition({
      bottom: window.innerHeight - bounds.top + 8,
      left: Math.max(
        16,
        Math.min(
          window.innerWidth - cardWidth - 16,
          bounds.left + bounds.width / 2 - cardWidth / 2,
        ),
      ),
    });
    interaction.showPreview(receipt.id);
  };
  const dismiss = () => {
    interaction.setActive(null);
    interaction.dismissPreview(receipt.id);
  };

  return (
    <>
      <AriakitButton
        aria-controls={contentId}
        aria-expanded={isOpen}
        aria-label={`attachment ${number}: ${receipt.label}`}
        className={cn(
          "ak-frame ak-frame-field/0 px-0.5 text-xs font-semibold leading-none ak-ink-70 underline decoration-dotted underline-offset-2",
          "motion-safe:transition-colors hover:ak-ink-100 focus-visible:ak-ink-100 focus-visible:ak-outline focus-visible:outline-2 focus-visible:outline-offset-2",
          interaction.activeId === receipt.id && "ak-ink-100",
        )}
        onBlur={dismiss}
        onClick={preview}
        onFocus={preview}
        onKeyDown={(event) => {
          if (event.key === "Escape") dismiss();
        }}
        onPointerEnter={preview}
        onPointerLeave={dismiss}
        ref={anchorRef}
        type="button"
      >
        {number}
      </AriakitButton>
      {isOpen && anchorPosition ? (
        <Portal>
          <motion.div
            animate={{
              filter: "blur(0px)",
              opacity: 1,
              rotate: 0,
              scale: 1,
              y: 0,
            }}
            className="pointer-events-none fixed z-50 w-fit origin-bottom outline-none"
            id={contentId}
            initial={
              prefersReducedMotion || isDiscovered
                ? false
                : {
                    filter: "blur(2px)",
                    opacity: 0,
                    rotate: -1,
                    scale: 0.94,
                    y: 4,
                  }
            }
            layout="position"
            layoutId={receiptLayoutId(receipt.id)}
            role="tooltip"
            style={anchorPosition}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    ...fastSpring,
                    layout: layoutSpring,
                  }
            }
          >
            <ReceiptArtifact number={number} receipt={receipt} />
          </motion.div>
        </Portal>
      ) : null}
    </>
  );
}

function ReceiptReferences({
  interaction,
  receiptIds,
}: {
  interaction: CollectionInteraction;
  receiptIds: readonly string[];
}) {
  const { receiptById } = useAxiomStory();
  return (
    <sup className="ml-0.5 inline-flex gap-0.5 align-super">
      {receiptIds.map((receiptId) => {
        const receipt = receiptById.get(receiptId);
        if (!receipt) return null;

        return (
          <FoundReceiptReference
            interaction={interaction}
            key={receipt.id}
            receipt={receipt}
          />
        );
      })}
    </sup>
  );
}

function InlineReveal({
  interaction,
  path,
  reveal,
}: {
  interaction: CollectionInteraction;
  path: string;
  reveal: AxiomReveal;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `${path}-content`;
  const isRelated = reveal.receiptIds?.includes(interaction.activeId ?? "");

  return (
    <DisclosureProvider open={isOpen} setOpen={setIsOpen}>
      <span
        className={cn(
          "motion-safe:transition-colors",
          interaction.activeId && (isRelated ? "ak-ink-100" : "ak-ink-50"),
        )}
      >
        {reveal.before}
        <Disclosure
          aria-controls={contentId}
          aria-expanded={isOpen}
          className={cn(
            "ak-layer ak-layer-transparent ak-frame ak-frame-field/0 mx-0.5 inline px-1 text-[0.9em] font-medium leading-none",
            "motion-safe:transition-colors hover:ak-state-5 active:ak-state-darken-5",
            "focus-visible:ak-outline focus-visible:outline-2 focus-visible:outline-offset-2",
            "aria-expanded:ak-state-8",
          )}
          type="button"
        >
          {reveal.trigger}
        </Disclosure>
        {reveal.after}
        {reveal.receiptIds?.length ? (
          <ReceiptReferences
            interaction={interaction}
            receiptIds={reveal.receiptIds}
          />
        ) : null}

        <AnimatePresence initial={false}>
          {isOpen ? (
            <MotionDisclosureContent
              alwaysVisible
              render={<span />}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      filter: "blur(1px)",
                      opacity: 0,
                      transition: {
                        duration: 0.12,
                        ease: [0.4, 0, 1, 1],
                      },
                    }
              }
              id={contentId}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { filter: "blur(2px)", opacity: 0 }
              }
              key={contentId}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.18,
                ease: fastEase,
              }}
            >
              {reveal.content.map((node, index) =>
                typeof node === "string" ? (
                  node
                ) : (
                  <InlineReveal
                    interaction={interaction}
                    key={`${path}-${index}`}
                    path={`${path}-${index}`}
                    reveal={node}
                  />
                ),
              )}
            </MotionDisclosureContent>
          ) : null}
        </AnimatePresence>
      </span>
    </DisclosureProvider>
  );
}

function TimelineBeat({
  beat,
  index,
  interaction,
}: {
  beat: AxiomBeat;
  index: number;
  interaction: CollectionInteraction;
}) {
  const { beats, instanceId } = useAxiomStory();
  const beatId = `${instanceId}-${beat.id}`;
  return (
    <li
      className="relative grid grid-cols-4 pb-20 md:grid-cols-8 lg:grid-cols-9"
      id={beatId}
    >
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 top-0 flex w-16 flex-col items-center px-4 md:relative md:col-span-1 md:w-auto"
      >
        <span className="ak-layer ak-layer-lighten-6 ak-frame ak-frame-field/0 relative z-10 grid size-8 place-items-center text-xs tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        {index < beats.length - 1 ? (
          <span className="absolute bottom-0 left-1/2 top-8 w-px -translate-x-1/2 bg-(--ak-edge) md:-bottom-20" />
        ) : null}
      </div>

      <div className="col-span-4 min-w-0 pl-16 pr-4 md:col-start-2 md:col-end-8 md:px-4 lg:col-end-9">
        <section aria-labelledby={`${beatId}-period`}>
          <p
            id={`${beatId}-period`}
            className="pb-2 text-xs uppercase ak-ink-70"
          >
            {beat.period}
          </p>
          <article>
            <h2 className="text-xl font-semibold">{beat.label}</h2>
            <p className="mt-2 text-lg leading-relaxed">
              <InlineReveal
                interaction={interaction}
                path={beatId}
                reveal={beat.story}
              />
            </p>
          </article>
        </section>
      </div>
    </li>
  );
}

function PileCard({
  count,
  fanWidth,
  index,
  interaction,
  isFanned,
  onDraggingChange,
  onReorderAt,
  receipt,
}: {
  count: number;
  fanWidth: number;
  index: number;
  interaction: CollectionInteraction;
  isFanned: boolean;
  onDraggingChange: (
    isDragging: boolean,
    point?: { x: number; y: number },
  ) => void;
  onReorderAt: (pointerX: number) => void;
  receipt: AxiomReceipt;
}) {
  const { receiptNumberById } = useAxiomStory();
  const prefersReducedMotion = useReducedMotion();
  const didDrag = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const isActive = interaction.activeId === receipt.id;
  const isSelected = interaction.selectedId === receipt.id;
  const progress = count > 1 ? index / (count - 1) : 0.5;
  const fanned = {
    rotate: (progress - 0.5) * 12,
    scale: 1,
    x: (progress - fanBias) * fanWidth,
    y: Math.abs(progress - 0.5) * 18,
  };
  const stacked = {
    rotate: index === 0 ? 0 : index % 2 === 0 ? -2 : 2,
    scale: 1,
    x: Math.min(index * 2, 12),
    y: Math.min(index * 2, 12),
  };
  const restingPosition = isFanned ? fanned : stacked;
  const position =
    isActive || isSelected
      ? {
          ...restingPosition,
          rotate: 0,
          scale: 1.02,
          y: restingPosition.y - (isSelected ? 48 : 28),
        }
      : restingPosition;

  return (
    <MotionButton
      animate={{
        ...position,
        ...(prefersReducedMotion ? { rotate: 0, scale: 1 } : {}),
        opacity: interaction.activeId && !isActive ? 0.72 : 1,
      }}
      aria-label={`attachment ${receiptNumberById.get(receipt.id)}: ${receipt.label}`}
      aria-pressed={isSelected}
      className="col-start-1 row-start-1 h-fit w-fit touch-pan-y cursor-grab self-start justify-self-end ak-frame ak-frame-card/0 focus-visible:ak-outline focus-visible:outline-2 focus-visible:outline-offset-2 active:cursor-grabbing"
      drag="x"
      dragElastic={0.08}
      dragMomentum={false}
      dragSnapToOrigin
      initial={false}
      layout="position"
      layoutId={receiptLayoutId(receipt.id)}
      onBlur={() => interaction.setActive(null)}
      onClick={() => {
        if (!didDrag.current) interaction.select(receipt.id);
      }}
      onDrag={(_, info) => {
        didDrag.current = true;
        onReorderAt(info.point.x);
      }}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onDraggingChange(false, info.point);
        interaction.setActive(null);
        window.setTimeout(() => {
          didDrag.current = false;
        }, 0);
      }}
      onDragStart={() => {
        didDrag.current = true;
        setIsDragging(true);
        onDraggingChange(true);
        interaction.setActive(receipt.id);
      }}
      onFocus={() => interaction.setActive(receipt.id)}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        interaction.reorder(
          receipt.id,
          index + (event.key === "ArrowLeft" ? -1 : 1),
        );
      }}
      onPointerDown={() => {
        didDrag.current = false;
      }}
      onPointerEnter={() => interaction.setActive(receipt.id)}
      onPointerLeave={() => {
        if (!isDragging) interaction.setActive(null);
      }}
      style={{
        zIndex: isDragging ? 200 : isActive || isSelected ? 100 : index + 1,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { ...fastSpring, layout: layoutSpring }
      }
      type="button"
      whileDrag={
        prefersReducedMotion
          ? { rotate: 0, scale: 1 }
          : { rotate: 0, scale: 1.03, y: -48 }
      }
    >
      <ReceiptArtifact
        number={receiptNumberById.get(receipt.id)}
        receipt={receipt}
      />
    </MotionButton>
  );
}

/** Cards can lift 48px above the hand; packed hosts can reserve room via padding. */
export function AxiomCollection(
  props: Omit<React.ComponentPropsWithRef<"div">, "children">,
) {
  const { interaction, receiptById, storyReceipts } = useAxiomStory();
  const [isFanned, setIsFanned] = useState(false);
  const [fanWidth, setFanWidth] = useState(120);
  const handRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const receipts = interaction.receiptOrder.flatMap((id) => {
    if (id === interaction.previewId) return [];
    const receipt = receiptById.get(id);
    return receipt ? [receipt] : [];
  });

  if (interaction.receiptOrder.length === 0) return null;

  const expandHand = () => {
    const hand = handRef.current;
    if (!hand) return;

    const bounds = hand.getBoundingClientRect();
    const card = hand.querySelector<HTMLElement>("[data-receipt-id]");
    if (!card) return;

    const halfCard = card.getBoundingClientRect().width / 2;
    const center = bounds.right - halfCard;
    const leftRoom = (center - halfCard - 16) / fanBias;
    const rightRoom =
      (window.innerWidth - center - halfCard - 16) / (1 - fanBias);
    setFanWidth(
      Math.max(
        120,
        Math.min(maxFanWidth, (receipts.length - 1) * 72, leftRoom, rightRoom),
      ),
    );
    setIsFanned(true);
  };

  const reorderAt = (id: string, pointerX: number) => {
    const hand = handRef.current;
    if (!hand || receipts.length < 2) return;

    const bounds = hand.getBoundingClientRect();
    const card = hand.querySelector<HTMLElement>("[data-receipt-id]");
    if (!card) return;

    const center = bounds.right - card.getBoundingClientRect().width / 2;
    const fanLeft = center - fanWidth * fanBias;
    const progress = Math.max(0, Math.min(1, (pointerX - fanLeft) / fanWidth));
    interaction.reorder(id, Math.round(progress * (receipts.length - 1)));
  };

  const setDragging = (
    isDragging: boolean,
    point?: { x: number; y: number },
  ) => {
    isDraggingRef.current = isDragging;
    const hand = handRef.current;
    if (isDragging || !hand || !point) return;

    const bounds = hand.getBoundingClientRect();
    const releasedOutside =
      point.x < bounds.left ||
      point.x > bounds.right ||
      point.y < bounds.top ||
      point.y > bounds.bottom;
    if (releasedOutside) setIsFanned(false);
  };

  return (
    <div {...props}>
      <p className="mb-4 text-xs uppercase ak-ink-60">
        attachments {interaction.receiptOrder.length}/{storyReceipts.length}
      </p>
      <div
        aria-label="discovered attachments. drag cards or use left and right arrow keys to reorder"
        className="grid min-h-56 grid-cols-1 grid-rows-1"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsFanned(false);
            interaction.setActive(null);
          }
        }}
        onFocus={expandHand}
        onPointerEnter={expandHand}
        onPointerLeave={() => {
          if (isDraggingRef.current) return;
          setIsFanned(false);
          interaction.setActive(null);
        }}
        ref={handRef}
        role="group"
      >
        {receipts.map((receipt, index) => (
          <PileCard
            count={receipts.length}
            fanWidth={fanWidth}
            index={index}
            interaction={interaction}
            isFanned={isFanned}
            key={receipt.id}
            onDraggingChange={setDragging}
            onReorderAt={(pointerX) => reorderAt(receipt.id, pointerX)}
            receipt={receipt}
          />
        ))}
      </div>
    </div>
  );
}

type CollectionOwnership =
  | {
      value: AxiomCollectionState;
      onValueChange: (value: AxiomCollectionState) => void;
      defaultValue?: never;
    }
  | {
      value?: never;
      defaultValue?: AxiomCollectionState;
      onValueChange?: (value: AxiomCollectionState) => void;
    };
export type AxiomStoryProps = CollectionOwnership & {
  beats: readonly AxiomBeat[];
  children?: ReactNode;
};
type StoryContext = ReturnType<typeof createReceiptIndex> & {
  beats: readonly AxiomBeat[];
  instanceId: string;
  interaction: CollectionInteraction;
};
const StoryContext = createContext<StoryContext | null>(null);
function useAxiomStory() {
  const context = useContext(StoryContext);
  if (!context) throw new Error("axiom parts require AxiomStory");
  return context;
}
/** Custom parts operate on their nearest story without owning its data or state. */
export function useAxiomInteraction() {
  return useAxiomStory().interaction;
}

/** Defaults initialize once. Keep ownership stable; remount with a key to reset reveals and collection.
 * Only current receipt IDs render. Data changes preserve internal state; key a new story to reset it.
 */
export function AxiomStory({ beats, children, ...props }: AxiomStoryProps) {
  const instanceId = useId();
  const index = useMemo(() => createReceiptIndex(beats), [beats]);
  const [internal, setInternal] = useState(
    () => props.defaultValue ?? emptyCollection(),
  );
  const state = normalizeCollection(props.value ?? internal, index.receiptById);
  const stateRef = useRef(state);
  stateRef.current = state;
  const dispatch = (action: Parameters<typeof updateCollection>[1]) => {
    const next = normalizeCollection(
      updateCollection(stateRef.current, action),
      index.receiptById,
    );
    stateRef.current = next;
    if (props.value === undefined) setInternal(next);
    props.onValueChange?.(next);
  };
  const interaction: CollectionInteraction = {
    activeId: state.hoveredId ?? state.selectedId,
    previewId: state.previewId,
    receiptOrder: state.receiptOrder,
    selectedId: state.selectedId,
    dismissPreview: (id) => dispatch({ type: "dismiss", id }),
    reorder: (id, targetIndex) =>
      dispatch({ type: "reorder", id, targetIndex }),
    select: (id) => dispatch({ type: "select", id }),
    setActive: (id) => dispatch({ type: "hover", id }),
    showPreview: (id) => dispatch({ type: "preview", id }),
  };
  return (
    <StoryContext.Provider value={{ ...index, beats, instanceId, interaction }}>
      <LayoutGroup id={instanceId}>
        {children === undefined ? <AxiomStoryBody /> : children}
      </LayoutGroup>
    </StoryContext.Provider>
  );
}
export function AxiomTimeline() {
  const { beats, interaction } = useAxiomStory();
  return (
    <ol className="col-span-full lg:col-span-9">
      {beats.map((beat, index) => (
        <TimelineBeat
          beat={beat}
          index={index}
          interaction={interaction}
          key={beat.id}
        />
      ))}
    </ol>
  );
}
export function AxiomStoryBody() {
  return (
    <div className={cn(grid({ mode: "narrow" }), "mx-auto max-w-7xl")}>
      <AxiomTimeline />
      <aside className="hidden self-start lg:sticky lg:top-4 lg:col-start-10 lg:col-end-17 lg:block">
        <AxiomCollection />
      </aside>
    </div>
  );
}
