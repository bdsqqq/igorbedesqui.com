import nextConfig from "eslint-config-next";
import * as mdx from "eslint-plugin-mdx";

const config = [
  ...nextConfig,
  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
    }),
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
    },
  },
];

export default config;
