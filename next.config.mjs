/** @type {import('next').NextConfig} */

import { withAxiom } from "next-axiom";
import bundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAxiom(
  withBundleAnalyzer({
    swcMinify: true,
    reactStrictMode: true,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    experimental: {
      appDir: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    redirects: async () => {
      return [
        {
          source: "/p/:slug",
          destination: "/work/:slug",
          permanent: true,
        },
      ];
    },
  })
);
