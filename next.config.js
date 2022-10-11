/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate");
// if you ever need to add more configs, check out the documentation for next-translate on github

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

module.exports = withBundleAnalyzer({
  ...withMDX({
    ...nextTranslate({
      swcMinify: true,
      reactStrictMode: true,
      i18n: {
        locales: ["en", "pt"],
        defaultLocale: "en",
      },
      pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    }),
  }),
});
