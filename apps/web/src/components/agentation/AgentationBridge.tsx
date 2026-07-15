import { Agentation, type Annotation } from "agentation";
import * as React from "react";
import { createPortal } from "react-dom";

const AGENTATION_SETTINGS_KEY = "feedback-toolbar-settings";
const AGENTATION_SERVER = "http://127.0.0.1:4748";
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

const Streamdown = React.lazy(() =>
  import("streamdown").then(({ Streamdown: Component }) => ({ default: Component })),
);

type ProgressStatus = "queued" | "running" | "completed" | "failed";

type AnnotationProgress = {
  annotation: Annotation;
  batchId?: string;
  markdown: string;
  status: ProgressStatus;
  statusText: string;
};

type ProgressEvent = {
  type:
    | "batch.queued"
    | "child.started"
    | "tool.started"
    | "assistant.delta"
    | "child.completed"
    | "child.failed";
  annotationIds: string[];
  batchId: string;
  delta?: string;
  markdown?: string;
  message?: string;
  toolName?: string;
};

function updateProgress(
  current: Map<string, AnnotationProgress>,
  event: ProgressEvent,
): Map<string, AnnotationProgress> {
  const next = new Map(current);
  for (const annotationId of event.annotationIds) {
    const progress = next.get(annotationId);
    if (!progress) continue;
    if (event.type !== "batch.queued" && progress.batchId !== event.batchId) continue;

    switch (event.type) {
      case "batch.queued":
        next.set(annotationId, {
          ...progress,
          batchId: event.batchId,
          status: "queued",
          statusText: "Queued",
        });
        break;
      case "child.started":
        next.set(annotationId, { ...progress, status: "running", statusText: "Working" });
        break;
      case "tool.started":
        next.set(annotationId, {
          ...progress,
          status: "running",
          statusText: `Running ${event.toolName ?? "tool"}`,
        });
        break;
      case "assistant.delta":
        next.set(annotationId, {
          ...progress,
          markdown: `${progress.markdown}${event.delta ?? ""}`,
          status: "running",
          statusText: "Responding",
        });
        break;
      case "child.completed":
        next.set(annotationId, {
          ...progress,
          markdown: event.markdown ?? progress.markdown,
          status: "completed",
          statusText: "Completed",
        });
        break;
      case "child.failed":
        next.set(annotationId, {
          ...progress,
          markdown: `**Failed:** ${event.message ?? "Unknown error"}`,
          status: "failed",
          statusText: "Failed",
        });
        break;
    }
  }
  return next;
}

function ProgressCard({ progress, spinner }: { progress: AnnotationProgress; spinner: string }) {
  const { annotation, markdown, status, statusText } = progress;
  const isStreaming = status === "queued" || status === "running";
  const placeLeft = annotation.x > 65;

  return (
    <aside
      aria-live="polite"
      className="agentation-progress-card pointer-events-none w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-A04 bg-gray-01/95 text-gray-12 shadow-2xl backdrop-blur-xl"
      style={{
        left: `${annotation.x}%`,
        position: annotation.isFixed ? "fixed" : "absolute",
        top: annotation.y,
        transform: placeLeft
          ? "translate(calc(-100% - 20px), -50%)"
          : "translate(20px, -50%)",
        zIndex: 2_147_483_646,
      }}
    >
      <div className="flex items-center gap-2 border-b border-gray-A03 px-3 py-2 font-mono text-[11px] text-gray-10">
        <span className={status === "failed" ? "text-red-500" : "text-gray-12"}>
          {isStreaming ? spinner : status === "completed" ? "✓" : "×"}
        </span>
        <span>{statusText}</span>
      </div>
      {markdown ? (
        <div className="max-h-56 overflow-auto px-3 py-2 text-xs leading-relaxed">
          <React.Suspense fallback={<p className="whitespace-pre-wrap">{markdown}</p>}>
            <Streamdown
              animated
              className="[&_p]:my-1 [&_pre]:max-w-full [&_pre]:overflow-auto"
              isAnimating={isStreaming}
              mode={isStreaming ? "streaming" : "static"}
            >
              {markdown}
            </Streamdown>
          </React.Suspense>
        </div>
      ) : null}
    </aside>
  );
}

function ProgressLayer({ progress }: { progress: Map<string, AnnotationProgress> }) {
  const [frame, setFrame] = React.useState(0);
  const isStreaming = [...progress.values()].some(
    ({ status }) => status === "queued" || status === "running",
  );

  React.useEffect(() => {
    if (!isStreaming) return;
    const timer = window.setInterval(
      () => setFrame((current) => (current + 1) % SPINNER_FRAMES.length),
      100,
    );
    return () => window.clearInterval(timer);
  }, [isStreaming]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div data-agentation-progress-layer>
      {[...progress.values()].map((item) => (
        <ProgressCard
          key={item.annotation.id}
          progress={item}
          spinner={SPINNER_FRAMES[frame]}
        />
      ))}
    </div>,
    document.body,
  );
}

/** Explicit submit is the execution boundary; live annotation webhooks stay disabled. */
export function AgentationBridge() {
  const [isReady, setIsReady] = React.useState(false);
  const [clientId] = React.useState(() => crypto.randomUUID());
  const pendingTimers = React.useRef(new Map<string, number>());
  const [progress, setProgress] = React.useState<Map<string, AnnotationProgress>>(
    () => new Map(),
  );

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(AGENTATION_SETTINGS_KEY);
      const settings = stored ? (JSON.parse(stored) as Record<string, unknown>) : {};
      localStorage.setItem(
        AGENTATION_SETTINGS_KEY,
        JSON.stringify({
          ...settings,
          webhookUrl: `${AGENTATION_SERVER}/agentation?clientId=${clientId}`,
          webhooksEnabled: false,
        }),
      );
    } catch {
      localStorage.setItem(
        AGENTATION_SETTINGS_KEY,
        JSON.stringify({
          webhookUrl: `${AGENTATION_SERVER}/agentation?clientId=${clientId}`,
          webhooksEnabled: false,
        }),
      );
    }
    setIsReady(true);
  }, [clientId]);

  React.useEffect(() => {
    const timers = pendingTimers.current;
    const events = new EventSource(`${AGENTATION_SERVER}/events?clientId=${clientId}`);
    events.onmessage = ({ data }) => {
      try {
        const event = JSON.parse(data) as ProgressEvent;
        if (event.type === "batch.queued") {
          for (const annotationId of event.annotationIds) {
            const timer = timers.get(annotationId);
            if (timer !== undefined) window.clearTimeout(timer);
            timers.delete(annotationId);
          }
        }
        setProgress((current) => updateProgress(current, event));
      } catch {
        // Ignore malformed progress events; EventSource will continue receiving later updates.
      }
    };
    return () => {
      events.close();
      for (const timer of timers.values()) window.clearTimeout(timer);
      timers.clear();
    };
  }, [clientId]);

  const removeAnnotation = React.useCallback((annotation: Annotation) => {
    setProgress((current) => {
      const next = new Map(current);
      next.delete(annotation.id);
      return next;
    });
  }, []);

  const clearAnnotations = React.useCallback((annotations: Annotation[]) => {
    const ids = new Set(annotations.map(({ id }) => id));
    setProgress((current) => {
      const next = new Map(current);
      for (const id of ids) next.delete(id);
      return next;
    });
  }, []);

  const updateAnnotation = React.useCallback((annotation: Annotation) => {
    setProgress((current) => {
      const existing = current.get(annotation.id);
      if (!existing) return current;
      const next = new Map(current);
      next.set(annotation.id, { ...existing, annotation });
      return next;
    });
  }, []);

  const submitAnnotations = React.useCallback((_output: string, annotations: Annotation[]) => {
    setProgress((current) => {
      const next = new Map(current);
      for (const annotation of annotations) {
        const previousTimer = pendingTimers.current.get(annotation.id);
        if (previousTimer !== undefined) window.clearTimeout(previousTimer);
        pendingTimers.current.set(
          annotation.id,
          window.setTimeout(() => {
            setProgress((latest) => {
              const item = latest.get(annotation.id);
              if (!item || item.batchId !== undefined) return latest;
              const failed = new Map(latest);
              failed.set(annotation.id, {
                ...item,
                markdown: "**Failed:** The Agentation coordinator is unavailable.",
                status: "failed",
                statusText: "Failed",
              });
              return failed;
            });
            pendingTimers.current.delete(annotation.id);
          }, 5_000),
        );
        next.set(annotation.id, {
          annotation,
          batchId: undefined,
          markdown: "",
          status: "queued",
          statusText: "Sending",
        });
      }
      return next;
    });
  }, []);

  return isReady ? (
    <>
      <Agentation
        onAnnotationDelete={removeAnnotation}
        onAnnotationsClear={clearAnnotations}
        onAnnotationUpdate={updateAnnotation}
        onSubmit={submitAnnotations}
        webhookUrl={`${AGENTATION_SERVER}/agentation?clientId=${clientId}`}
      />
      <ProgressLayer progress={progress} />
    </>
  ) : null;
}
