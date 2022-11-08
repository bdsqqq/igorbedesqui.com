declare module "*.mdx" {
  export const meta: Meta;

  export type Meta = {
    shortName: string;
    name: string;
    description: string;
    roles: string[];
    type: string;
    tools: string[];
    date: string;
    urlSlug: string;
    backMessage: string;
  };
}
