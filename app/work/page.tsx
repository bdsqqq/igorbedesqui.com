import { bebopMeta, ibmMeta, issMeta, psykipMeta, wasmGifMeta } from "./metas";

import Container from "@/components/Container";
import Link from "next/link";

const projects = [ibmMeta, psykipMeta, bebopMeta, issMeta, wasmGifMeta];

export default function Page() {
  return (
    <Container backable>
      <h1>Work</h1>

      <ul>
        {projects.map((p) => (
          <li key={p.urlSlug}>
            <Link href={`/work/${p.urlSlug}`}>
              {p.name} {p.draft.toString()}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
