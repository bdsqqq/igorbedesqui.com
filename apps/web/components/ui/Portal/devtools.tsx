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
    <div className="min-w-0">
      <h2 className="pb-2 font-bold">Portals</h2>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="min-w-0">
          <h3 className="ak-ink-60">out</h3>
          <ul className="break-words">
            {outPortals.map((p) => {
              const linked = inPortals.find((i) => i.intendedOut === p.name);

              return (
                <li
                  className={linked ? "ak-ink-100" : "ak-ink-85"}
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
          <ul className="break-words">
            {inPortals.map((p) => {
              const linked = outPortals.find((o) => o.name === p.intendedOut);

              return (
                <li
                  className={linked ? "ak-ink-100" : "ak-ink-85"}
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
