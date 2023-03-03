const metas = [onWritingMeta, onWritingMeta, onWritingMeta, onWritingMeta];

export default function Writing() {
  return (
    <>
      <Seo title="Writing" description="" url="writing" ogText="*Writing*" />

      <Container backable key="index">
        <Band gridless id="main">
          <div className="mx-auto grid grid-cols-4">
            <h1 className="text-4xl">Writing</h1>

            <ul className="col-span-3 flex flex-col gap-6">
              {metas.map((meta) => {
                return (
                  <UnstyledLink
                    href={`/writing/${meta.urlSlug}`}
                    key={meta.name}
                  >
                    <li>
                      <h2 className="text-2xl">{meta.name}</h2>
                      <p>{meta.description}</p>
                    </li>
                  </UnstyledLink>
                );
              })}
            </ul>
          </div>
        </Band>
      </Container>
    </>
  );
}

import Seo from "@/components/Seo";
import Band from "@/components/Band";
import Container from "@/components/Container";

import { onWritingMeta } from "app/writing/metas";
import { UnstyledLink } from "@/components/ui/primitives";
