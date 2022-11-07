/** @type {import('next').NextConfig} */

import remarkGfm from "remark-gfm";

import bundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

import mdx from "@next/mdx";
const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

export default withBundleAnalyzer({
  ...withMDX({
    swcMinify: true,
    reactStrictMode: true,
    i18n: {
      locales: ["en", "pt"],
      defaultLocale: "en",
    },
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  }),
});
