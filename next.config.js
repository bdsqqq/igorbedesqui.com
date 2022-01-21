const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextTranslate = require("next-translate");
// if you ever need to add more configs, check out the documentation for next-translate on github
module.exports = nextTranslate({
  withMDX: withMDX({
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  }),
});
