import { LoggerConfig } from "./types";
import { ConsoleInstance } from "./instance";
import { createColors } from "./utils";

export const createLogger = (options: LoggerConfig = {}) => {
  return new ConsoleInstance(options);
};

export const logger = createLogger();
let colors = { ...createColors(true) };

export * from "./types";
export { logColors, icons, strWidth, join } from "./utils";
export { colors };
