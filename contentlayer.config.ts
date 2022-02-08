import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer/source-files";

const Alternate = defineNestedType(() => ({
  name: "Alternate",
  fields: {
    slug: { type: "string", required: true },
    locale: { type: "string", required: true },
  },
}));

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/*.mdx`,
  bodyType: "mdx",

  fields: {
    title: {
      type: "string",
      description: "The title of the project",
      required: true,
    },
    lang: {
      type: "string",
      description: "The language of the project",
      required: true,
    },
    alternate: {
      type: "nested",
      of: [Alternate],
      description: "Slug and locale of other language alternative",
      required: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ""),
    },
  },
}));

export default makeSource({
  contentDirPath: "data",
  documentTypes: [Project],
  mdx: {},
});
