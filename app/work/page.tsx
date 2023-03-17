import { bebopMeta, ibmMeta, issMeta, psykipMeta, wasmGifMeta } from "./metas";

import Container from "@/components/Container";
import Link from "next/link";
import { grid } from "@/components/ui/Grid";
import Band from "@/components/Band";
import { cx } from "class-variance-authority";

const projects = [ibmMeta, psykipMeta, bebopMeta, issMeta, wasmGifMeta];

export default function Page() {
  return (
    <Container backable>
      <Band gridless id="01">
        <div className={cx(grid(), "flex flex-col gap-y-6")}>
          <div className="col-span-6">
            <h1 className="font-semibold text-3xl">Projects</h1>
          </div>
          <div className="col-start-1 md:col-start-2 lg:col-start-3 col-span-full">
            <ul className="group hover:text-gray-8 focus-within:text-gray-8">
              {projects.map((p) => (
                <li key={p.urlSlug} className="">
                  <Link
                    className="flex flex-col py-3 px-4 -mx-4 hover:text-gray-12 hover:bg-gray-A3 focus:text-gray-12 focus:bg-gray-A3 transition-colors"
                    href={`/work/${p.urlSlug}`}
                  >
                    <h3 className="flex justify-between">
                      <span className="font-semibold">{p.name}</span>
                      <span>{p.date}</span>
                    </h3>
                    <p className="block md:w-2/3">{p.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>
    </Container>
  );
}
