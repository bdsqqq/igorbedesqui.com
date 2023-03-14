import remarkGfm from "remark-gfm";
import { SerializeOptions } from "next-mdx-remote/dist/types";
import { MDXProvider } from "@mdx-js/react";
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import StyledLinkWithIcon from "@/components/ui/StyledLink";
import { HTMLProps } from "react";

const defaultComponents = {
  // @ts-ignore
  a: (props) => <StyledLinkWithIcon {...props} />,
  h1: (props: HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-2xl text-gray-11 mb-8" {...props} />
  ),
  h2: (props: HTMLProps<HTMLHeadingElement>) => (
    <h1 className="text-lg font-bold my-2" {...props} />
  ),
  strong: (props: HTMLProps<HTMLElement>) => (
    <strong className="font-bold text-gray-12" {...props} />
  ),
  pre: (props: HTMLProps<HTMLPreElement>) => (
    <pre
      className="bg-gray-2 rounded p-4 my-2 overflow-x-auto text-sm"
      {...props}
    />
  ),
  code: (props: HTMLProps<HTMLElement>) => (
    <code className="bg-gray-2 rounded py-0.5 px-1" {...props} />
  ),
};

export const MDX = ({
  children,
  components,
  ...rest
}: { children: string } & {
  // TODO: allow children OR source
  options?: SerializeOptions | undefined;
  components?: React.ComponentProps<typeof MDXProvider>["components"];
}) => {
  return (
    // workaround https://beta.nextjs.org/docs/data-fetching/fetching#asyncawait-in-server-components
    /* @ts-expect-error Server Component */
    <MDXRemote
      {...rest}
      source={children}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [],
        },
      }}
      components={{ ...defaultComponents, ...(components || {}) }}
    />
  );
};
