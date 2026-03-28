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
    <div>
      <h2>Portals</h2>
      <div className="flex gap-2">
        <div>
          <h3>out</h3>
          <ul>
            {outPortals.map((p) => {
              const linked = inPortals.find((i) => i.intendedOut === p.name);

              return (
                <li
                  className={cn(linked ? "text-gray-12" : "text-gray-11")}
                  key={p.name}
                >
                  {p.name}
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3>in</h3>
          <ul>
            {inPortals.map((p) => {
              const linked = outPortals.find((o) => o.name === p.intendedOut);

              return (
                <li
                  className={cn(linked ? "text-gray-12" : "text-gray-11")}
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
