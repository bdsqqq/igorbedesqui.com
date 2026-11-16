import { cn } from "@/lib/styling";
import { usePortalStore } from "@/components/ui/Portal";

/**
 * Keeps track of the name and type of rendered portals.
 */
export function PortalDevtools() {
  const { inPortals: inPortalsMap, outPortals: outPortalsMap } =
    usePortalStore();

  const inPortals = Array.from(inPortalsMap.values());
  const outPortals = Array.from(outPortalsMap.values());

  return (
    <div className="ak-layer ak-layer-lighten-3 ak-frame ak-frame-card/2 ak-frame-ring ak-edge-10 min-w-0">
      <h2 className="ak-frame ak-frame-cover ak-frame-start border-b px-2 pb-2 font-bold">
        Portals
      </h2>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="min-w-0">
          <h3 className="ak-ink-60">out</h3>
          <ul className="ak-layer ak-layer-darken-2 ak-frame ak-frame-field/0.5 ak-frame-bordering break-words">
            {outPortals.map((p) => {
              const linked = inPortals.find((i) => i.intendedOut === p.name);

              return (
                <li
                  className={cn(
                    "ak-frame ak-frame-field/0.5",
                    linked ? "ak-ink-100" : "ak-ink-85",
                  )}
                  key={p.name}
                >
                  {p.name}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="ak-ink-60">in</h3>
          <ul className="ak-layer ak-layer-darken-2 ak-frame ak-frame-field/0.5 ak-frame-bordering break-words">
            {inPortals.map((p) => {
              const linked = outPortals.find((o) => o.name === p.intendedOut);

              return (
                <li
                  className={cn(
                    "ak-frame ak-frame-field/0.5",
                    linked ? "ak-ink-100" : "ak-ink-85",
                  )}
                  key={p.name}
                >
                  {p.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
