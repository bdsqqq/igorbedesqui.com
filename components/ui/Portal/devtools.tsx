import { useStore } from "zustand";
import { PortalStore } from ".";
import { cn } from "@/lib/styling";

/**
 * Keeps track of the name and type of rendered portals.
 */
export function PortalDevtools() {
  const { inPortals, outPortals } = useStore(PortalStore);

  return (
    <div className="border-gray-05 bg-gray-03 fixed bottom-4 left-4 rounded border p-2">
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
                    className={cn(linked ? "text-[green]" : "text-[orange]")}
                    key={p.id}
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
                    className={cn(linked ? "text-[green]" : "text-[orange]")}
                    key={p.id}
                  >
                    {p.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
