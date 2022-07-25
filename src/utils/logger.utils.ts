import { createLogger, transports, format } from "winston";

const isDev = process.env.NODE_ENV !== "production";

const consoleTransport = new transports.Console({
  format: format.simple(),
});

export const Logger = createLogger({
  level: isDev ? "debug" : "info",
  exitOnError: false,
  handleExceptions: true,
  transports: consoleTransport,
});
