import { LoggerConfig } from "./types";
import { ConsoleInstance } from "./instance";

export const createLogger = (options: LoggerConfig = {}) => {
  return new ConsoleInstance(options);
};

export const logger = createLogger();

import { createColors } from "colorette";

export const colors = createColors({ useColor: true });
