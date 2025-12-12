import MillionLint from "@million/lint";
import MillionCompiler from "@million/lint";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: true,
  reactStrictMode: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
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
};

// export default MillionLint.next({
//   enabled: true
// })(MillionCompiler.next({ rsc: true })(nextConfig));

export default nextConfig
