import { LoggerConfig } from "./types";
import { ConsoleInstance } from "./instance";

export const createLogger = (options: LoggerConfig = {}) => {
  return new ConsoleInstance(options);
};

export const logger = createLogger();

export * from "./types";
export { logColors, icons, strWidth, join } from "./utils";
