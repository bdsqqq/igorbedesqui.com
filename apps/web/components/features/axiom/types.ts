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
