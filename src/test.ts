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
});
