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

/**
 * @see {@link https://stackoverflow.com/questions/73835176/replace-all-the-nested-object-properties-to-particular-value}
 */
export async function mutateSerializeMdx<
  T extends object,
  R extends RecursiveSerialize<T>
>(obj: T): Promise<R> {
  const keys = Object.keys(obj) as Array<keyof typeof obj>;

  for (const key of keys) {
    const value = obj[key];

    if (typeof value === "string")
      // @ts-ignore
      obj[key] = await serialize(value, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      });
    if (typeof value === "object" && value !== null) {
      mutateSerializeMdx(value);
    }
  }

  // @ts-ignore
  return obj;
}
