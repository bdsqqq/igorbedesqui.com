import { createFileRoute } from "@tanstack/react-router";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import Band from "@/components/Band";
import Container from "@/components/Container";
import HeroBand from "@/components/HeroBand";
import type { Meta } from "@/components/ProjectStuff/Projects";
import { grid } from "@/components/ui/Grid";
import { cn } from "@/lib/styling";
import {
  axiomBeats,
  type AxiomBeat,
  type AxiomReceipt,
  type AxiomReveal,
} from "./-timeline";

export const axiomMeta: Meta = {
  shortName: "Axiom",
  name: "Axiom",
  description: "Lorem ipsum dolor sit amet.",
  roles: ["Lorem ipsum"],
  type: "Lorem ipsum",
  tools: [],
  date: "Lorem ipsum",
  urlSlug: "axiom",
  draft: true,
};

const storyReceipts: readonly AxiomReceipt[] = axiomBeats.flatMap(
  (beat) => beat.receipts as readonly AxiomReceipt[],
);
const receiptById = new Map(
  storyReceipts.map((receipt) => [receipt.id, receipt]),
);
const receiptNumberById = new Map(
  storyReceipts.map((receipt, index) => [receipt.id, index + 1]),
);
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
const fanBias = 0.85;
const maxFanWidth = 880;

const receiptStyles = {
  calendar: {
    card: "border-l-[3px] border-l-[#d29922] bg-gray-02",
    kind: "calendar",
  },
  commit: {
    card: "border-l-[3px] border-l-[#238636] bg-gray-02",
    kind: "commit",
  },
  issue: {
    card: "border-l-[3px] border-l-[#1f6feb] bg-gray-02",
    kind: "linear issue",
  },
  pr: {
    card: "border-l-[3px] border-l-[#8957e5] bg-gray-02",
    kind: "merged pull request",
  },
  review: {
    card: "border-l-[3px] border-l-gray-A08 bg-gray-01",
    kind: "performance review",
  },
  screenshot: {
    card: "border-l-[3px] border-l-[#db6d28] bg-gray-02",
    kind: "screenshot",
  },
} satisfies Record<AxiomReceipt["kind"], { card: string; kind: string }>;

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
      className={cn(
        "flex min-h-44 w-[calc(100vw-2rem)] max-w-[29.5rem] flex-col rounded-sm border border-gray-A05 p-5 text-left shadow-xl shadow-black/40",
        style.card,
      )}
      data-receipt-id={receipt.id}
    >
      <span className="mb-4 flex w-full items-center justify-between font-sans text-xs uppercase tracking-wide text-gray-10">
        <span>{style.kind}</span>
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
      <span className="mt-auto block pt-4 font-sans text-xs text-gray-10">
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
  const prefersReducedMotion = useReducedMotion();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [anchorPosition, setAnchorPosition] = useState<{
    bottom: number;
    left: number;
  } | null>(null);
  const isOpen = interaction.previewId === receipt.id;
  const isDiscovered = interaction.receiptOrder.includes(receipt.id);
  const number = receiptNumberById.get(receipt.id);
  const contentId = `receipt-preview-${receipt.id}`;

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
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        aria-label={`attachment ${number}: ${receipt.label}`}
        className={cn(
          "rounded-sm px-0.5 text-xs font-semibold leading-none text-gray-10 underline decoration-dotted underline-offset-2",
          "motion-safe:transition-colors hover:text-gray-12 focus-visible:text-gray-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-A08",
          interaction.activeId === receipt.id && "text-gray-12",
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
      </button>
      {isOpen && anchorPosition
        ? createPortal(
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
          </motion.div>,
          document.body,
        )
        : null}
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
    <span
      className={cn(
        "motion-safe:transition-colors",
        interaction.activeId && (isRelated ? "text-gray-12" : "text-gray-08"),
      )}
    >
      {reveal.before}
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className={cn(
          "mx-0.5 inline rounded-sm border border-gray-A05 bg-gray-A02 px-1 text-[0.9em] font-medium leading-none",
          "motion-safe:transition-colors hover:border-gray-A08 hover:bg-gray-A03",
          "focus-visible:border-gray-A08 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-A06",
          "data-[state=open]:border-gray-A08 data-[state=open]:bg-gray-A04",
        )}
        data-state={isOpen ? "open" : "closed"}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {reveal.trigger}
      </button>
      {reveal.after}
      {reveal.receiptIds?.length ? (
        <ReceiptReferences
          interaction={interaction}
          receiptIds={reveal.receiptIds}
        />
      ) : null}

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.span
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
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
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
  return (
    <li
      className="relative grid grid-cols-4 pb-20 md:grid-cols-8 lg:grid-cols-9"
      id={beat.id}
    >
      <div className="absolute bottom-0 left-0 top-0 flex w-16 flex-col items-center px-4 md:relative md:col-span-1 md:w-auto">
        <span className="relative z-10 grid size-8 place-items-center rounded-full border border-gray-A05 bg-gray-01 text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>
        {index < axiomBeats.length - 1 ? (
          <span className="absolute bottom-0 left-1/2 top-8 w-px -translate-x-1/2 bg-gray-A04" />
        ) : null}
      </div>

      <div className="col-span-4 min-w-0 pl-16 pr-4 md:col-start-2 md:col-end-8 md:px-4 lg:col-end-9">
        <p className="text-xs uppercase text-gray-09">{beat.period}</p>
        <h2 className="text-xl font-semibold">{beat.label}</h2>
        <p className="mt-2 text-lg leading-relaxed">
          <InlineReveal
            interaction={interaction}
            path={beat.id}
            reveal={beat.story}
          />
        </p>
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
    <motion.button
      animate={{
        ...position,
        opacity: interaction.activeId && !isActive ? 0.72 : 1,
      }}
      aria-label={`attachment ${receiptNumberById.get(receipt.id)}: ${receipt.label}`}
      aria-pressed={isSelected}
      className="col-start-1 row-start-1 h-fit w-fit cursor-grab self-start justify-self-end rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-A08 active:cursor-grabbing"
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
      whileDrag={{ rotate: 0, scale: 1.03, y: -48 }}
    >
      <ReceiptArtifact
        number={receiptNumberById.get(receipt.id)}
        receipt={receipt}
      />
    </motion.button>
  );
}

function StickyCollection({
  interaction,
}: {
  interaction: CollectionInteraction;
}) {
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
    <div>
      <p className="mb-4 text-xs uppercase text-gray-09">
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

function AxiomWorkPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const collect = (id: string) => {
    setReceiptOrder((current) => {
      if (current.includes(id)) return current;
      return [...current, id];
    });
  };
  const interaction: CollectionInteraction = {
    activeId: hoveredId ?? selectedId,
    dismissPreview: (id) => {
      collect(id);
      setPreviewId((current) => (current === id ? null : current));
    },
    previewId,
    receiptOrder,
    reorder: (id, targetIndex) => {
      setReceiptOrder((current) => {
        const from = current.indexOf(id);
        const to = Math.max(0, Math.min(current.length - 1, targetIndex));
        if (from === -1 || from === to) return current;

        const next = [...current];
        const [receiptId] = next.splice(from, 1);
        next.splice(to, 0, receiptId);
        return next;
      });
    },
    select: (id) => {
      setSelectedId((current) => (current === id ? null : id));
    },
    selectedId,
    setActive: setHoveredId,
    showPreview: (id) => {
      if (previewId && previewId !== id) collect(previewId);
      setHoveredId(id);
      setPreviewId(id);
    },
  };

  return (
    <LayoutGroup id="axiom-attachments">
      <Container backable backAnchor="/work">
        <HeroBand>Axiom</HeroBand>
        <Band gridless id="timeline">
          <div className={cn(grid({ mode: "narrow" }), "mx-auto max-w-7xl")}>
            <ol className="col-span-full lg:col-span-9">
              {axiomBeats.map((beat, index) => (
                <TimelineBeat
                  beat={beat}
                  index={index}
                  interaction={interaction}
                  key={beat.id}
                />
              ))}
            </ol>
            <aside className="hidden self-start lg:sticky lg:top-4 lg:col-start-10 lg:col-end-17 lg:block">
              <StickyCollection interaction={interaction} />
            </aside>
          </div>
        </Band>
      </Container>
    </LayoutGroup>
  );
}

export const Route = createFileRoute("/work/axiom")({
  component: AxiomWorkPage,
  head: () => ({
    meta: [
      { title: `${axiomMeta.name} — Igor Bedesqui` },
      {
        name: "description",
        content: axiomMeta.description,
      },
    ],
  }),
});
