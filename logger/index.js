const buildDevLogger = require("./dev-logger");
const buildProdLogger = require("./prod-logger");

let logger = null;

logger =
  process.env.NODE_ENV === "development" ? buildDevLogger() : buildProdLogger();

module.exports = logger;
