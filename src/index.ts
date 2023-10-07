import { LoggerConfig } from "./types";
import { ConsoleInstance } from "./instance";

export const createLogger = (options: LoggerConfig = {}) => {
  return new ConsoleInstance(options);
};

export const logger = createLogger();

import { createColors } from "./utils";

export const colors = createColors(true);
