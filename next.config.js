/** @type {import('next').NextConfig} */
const nextTranslate = require("next-translate");
// if you ever need to add more configs, check out the documentation for next-translate on github

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  ...nextTranslate({
    swcMinify: true,
    reactStrictMode: true,
    i18n: {
      locales: ["en", "pt"],
      defaultLocale: "en",
    },
  }),
});
