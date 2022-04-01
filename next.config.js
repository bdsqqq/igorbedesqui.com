const nextTranslate = require("next-translate");
// if you ever need to add more configs, check out the documentation for next-translate on github

module.exports = nextTranslate({
  reactStrictMode: true,
  i18n: {
    locales: ["en", "pt"],
    defaultLocale: "en",
  },

  webpack: (config, { dev, isServer }) => {
    // Replace React with Preact only in client production build
    // if (!dev && !isServer) {
    //   // IGOR, THIS WILL PROBABLY BREAK AT SOME POINT, IT IS A WORKAROUND, USUALLY jsx-runtime DOESN'T NEED THE .js
    //   config.resolve.alias["react/jsx-runtime.js"] = "preact/jsx-runtime";
    //   config.resolve.alias["react"] = "preact/compat";
    //   config.resolve.alias["react-dom"] = "preact/compat";
    // }

    return config;
  },
});
