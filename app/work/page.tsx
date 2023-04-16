import { bebopMeta, ibmMeta, issMeta, psykipMeta, wasmGifMeta } from "./metas";

import Container from "@/components/Container";
import { grid } from "@/components/ui/Grid";
import Band from "@/components/Band";
import { UnstyledLink } from "@/components/ui/primitives";
import HeroBand from "@/components/HeroBand";
import { cn } from "@/lib/styling";

const projects = [ibmMeta, psykipMeta, bebopMeta, issMeta, wasmGifMeta];

export default function Page() {
  return (
    <Container backable>
      <HeroBand>
        <span className="font-semibold">Work</span>
      </HeroBand>
      <Band gridless id="01">
        <ul
          className={cn(
            grid(),
            "pointer-events-none focus-within:text-gray-10 hover:text-gray-10"
          )}
        >
          {projects.map((p) => {
            return (
              <li
                className="col-span-4 -mx-4 px-0 lg:col-span-8 [&>a]:px-4"
                key={p.shortName}
              >
                <UnstyledLink
                  className="group pointer-events-auto block py-4 transition-colors duration-fast-02 ease-productive-standard hover:text-gray-12 focus:text-gray-12"
                  href={`/work/${p.urlSlug}`}
                >
                  <div className="flex flex-col ">
                    <div>
                      <h2 className="inline-block font-bold">{p.name}</h2>{" "}
                      <span className="text-bold inline-block transform text-end text-xs tracking-tighter text-gray-11 transition-all duration-moderate-01 ease-productive-standard group-hover:translate-x-0 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100 md:-translate-x-4 md:opacity-0">
                        {p.date}
                      </span>
                    </div>
                    <p>{p.description}</p>
                  </div>
                </UnstyledLink>
              </li>
            );
          })}
        </ul>
      </Band>
    </Container>
  );
}
