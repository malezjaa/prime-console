import { Logger } from "./index";

const log = new Logger({
  logLevel: 5,
  config: {
    error: {
      color: "black",
      background: "red",
    },
  },
  file: {
    dir: "{cwd}/siema/logs",
    name: "log",
    format: "json",
  },
  time: {
    color: "blue",
  },
  format: "%t %m",
  icon: false,
});

log.info("Hello world!");
log.error("Hello world!");
log.warning("Hello world!");
log.debug("Hello world!");
log.verbose("Hello world!");
log.silly("Hello world!");
