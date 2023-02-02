const { timeStamp } = require("console");
const { format, createLogger, transports } = require("winston");
const { timestamp, combine, errors, json } = format;

function buildProdLogger() {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports: [
      new transports.File({
        filename: "logger/log-files/error.log",
        level: "error",
      }),
      new transports.File({ filename: "logger/log-files/combined.log" }),
    ],
  });
}

module.exports = buildProdLogger;
