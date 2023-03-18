/** @type {import('next').NextConfig} */

import bundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer({
  swcMinify: true,
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  experimental: {
    appDir: true,
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
});
