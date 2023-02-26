// Shamelessly stolen (with permission this time) from
// https://twitter.com/guilherme_rodz/status/1593733505954914304?s=20&t=SHDo264Bq_1KA7sg11ex9Q

import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import remarkGfm from "remark-gfm";

export type SerializeResult = Awaited<MDXRemoteSerializeResult>;

export type RecursiveSerialize<T> = {
  [P in keyof T]: T[P] extends string
    ? SerializeResult
    : RecursiveSerialize<T[P]>;
};

export async function mutateSerializeMdx<
  T extends object,
  R extends RecursiveSerialize<T>
>(obj: T): Promise<R> {
  const entries = Object.entries(obj);

  const temp = entries.flatMap(async ([key, value]) => {
    if (typeof value == "string") {
      return [
        key,
        await serialize(value, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [],
          },
        }),
      ];
    }

    if (typeof value === "object" && value !== null) {
      return [key, await mutateSerializeMdx(value)];
    }

    console.error("Not a string or object", key, value);
    return [];
  });

  const result = Object.fromEntries(await Promise.all(temp));

  return result;
}
