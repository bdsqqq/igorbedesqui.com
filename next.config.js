const nextTranslate = require("next-translate");
const withPreact = require("next-plugin-preact");
// if you ever need to add more configs, check out the documentation for next-translate on github
module.exports = withPreact(nextTranslate());
