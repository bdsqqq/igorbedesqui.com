import { bebopMeta, ibmMeta, issMeta, psykipMeta, wasmGifMeta } from "./metas";

import Container from "@/components/Container";
import { grid } from "@/components/ui/Grid";
import Band from "@/components/Band";
import { cx } from "class-variance-authority";
import { UnstyledLink } from "@/components/ui/primitives";
import HeroBand from "@/components/HeroBand";

const projects = [ibmMeta, psykipMeta, bebopMeta, issMeta, wasmGifMeta];

export default function Page() {
  return (
    <Container backable>
      <HeroBand>
        <span className="font-semibold">Work</span>
      </HeroBand>
      <Band gridless id="01">
        <ul
          className={cx(
            grid(),
            "hover:text-gray-10 focus-within:text-gray-10 pointer-events-none"
          )}
        >
          {projects.map((p) => {
            return (
              <li
                className="col-span-4 lg:col-span-8 -mx-4 px-0 [&>a]:px-4"
                key={p.shortName}
              >
                <UnstyledLink
                  className="block py-4 pointer-events-auto hover:text-gray-12 focus:text-gray-12 transition-colors duration-fast-02 ease-productive-standard group"
                  href={`/work/${p.urlSlug}`}
                >
                  <div className="flex flex-col ">
                    <div>
                      <h2 className="inline-block font-bold">{p.name}</h2>{" "}
                      <span className="inline-block text-xs text-bold tracking-tighter text-gray-11 text-end md:opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform md:-translate-x-4 group-hover:translate-x-0 group-focus:translate-x-0 transition-all duration-moderate-01 ease-productive-standard">
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
