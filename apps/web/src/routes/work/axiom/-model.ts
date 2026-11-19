import type { AxiomBeat, AxiomReceipt } from "./-types";

export type AxiomCollectionState = {
  hoveredId: string | null;
  previewId: string | null;
  receiptOrder: readonly string[];
  selectedId: string | null;
};

export function emptyCollection(): AxiomCollectionState {
  return {
    hoveredId: null,
    previewId: null,
    receiptOrder: [],
    selectedId: null,
  };
}

/** Each story indexes only supplied beats; an empty collection is a complete dataset. */
export function createReceiptIndex(beats: readonly AxiomBeat[]) {
  const storyReceipts = beats.flatMap((beat) => beat.receipts);
  return {
    storyReceipts,
    receiptById: new Map(storyReceipts.map((receipt) => [receipt.id, receipt])),
    receiptNumberById: new Map(
      storyReceipts.map((receipt, index) => [receipt.id, index + 1]),
    ),
  };
}

export function normalizeCollection(
  state: AxiomCollectionState,
  receipts: ReadonlyMap<string, AxiomReceipt>,
): AxiomCollectionState {
  const valid = (id: string | null) =>
    id !== null && receipts.has(id) ? id : null;
  return {
    hoveredId: valid(state.hoveredId),
    previewId: valid(state.previewId),
    selectedId: valid(state.selectedId),
    receiptOrder: [
      ...new Set(state.receiptOrder.filter((id) => receipts.has(id))),
    ],
  };
}

type CollectionAction =
  | { type: "hover"; id: string | null }
  | { type: "preview" | "dismiss" | "select"; id: string }
  | { type: "reorder"; id: string; targetIndex: number };

export function updateCollection(
  state: AxiomCollectionState,
  action: CollectionAction,
): AxiomCollectionState {
  const collect = (id: string | null) =>
    id === null || state.receiptOrder.includes(id)
      ? state.receiptOrder
      : [...state.receiptOrder, id];
  switch (action.type) {
    case "hover":
      return { ...state, hoveredId: action.id };
    case "preview":
      return {
        ...state,
        receiptOrder:
          state.previewId !== action.id
            ? collect(state.previewId)
            : state.receiptOrder,
        hoveredId: action.id,
        previewId: action.id,
      };
    case "dismiss":
      return {
        ...state,
        receiptOrder: collect(action.id),
        previewId: state.previewId === action.id ? null : state.previewId,
      };
    case "select":
      return {
        ...state,
        selectedId: state.selectedId === action.id ? null : action.id,
      };
    case "reorder": {
      const from = state.receiptOrder.indexOf(action.id);
      const to = Math.max(
        0,
        Math.min(state.receiptOrder.length - 1, action.targetIndex),
      );
      if (from === -1 || from === to) return state;
      const receiptOrder = [...state.receiptOrder];
      const [id] = receiptOrder.splice(from, 1);
      receiptOrder.splice(to, 0, id);
      return { ...state, receiptOrder };
    }
  }
}
