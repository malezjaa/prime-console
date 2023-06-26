import { applyColor } from "./colors";
import { defaultColors } from "./constants";
import { ILogger, LogEntry, LoggerConfig, LoggerOptions } from "./types";
import { getCurrentTime, isErrorStack, parseErrorStack } from "./utils";
const chalk = require("chalk");
import fs from "fs";
import path from "path";

export * from "./types";

export class Logger implements ILogger {
  private config: LoggerConfig;
  private format: string;
  private logLevel: number;
  private customLevels: { [key: string]: number };
  private logEntries: LogEntry[];
  private file?: LoggerOptions["file"];
  private time?: LoggerOptions["time"];
  private icon?: boolean;

  constructor(options: LoggerOptions = {}) {
    const defaultConfig: LoggerConfig = defaultColors;
    const defaultFormat = "[%t] %d %m";
    const defaultLogLevel = 0;

    const config = { ...defaultConfig, ...options.config };
    const format = options.format || defaultFormat;
    const logLevel = options.logLevel || defaultLogLevel;
    const file = {
      dir: options.file?.dir || "",
      name: options.file?.name || "",
      format: options.file?.format || "text",
    };
    const time = {
      color: options.time?.color || "white",
      bold: options.time?.bold || false,
    };

    this.icon = options.icon === undefined ? false : options.icon;
    this.config = config;
    this.format = format;
    this.logLevel = logLevel;
    this.customLevels = {};
    this.logEntries = [];
    this.file = file;
    this.time = time;
  }

  addCustomLevel(
    type: string,
    level: number,
    color?: string,
    background?: string
  ) {
    if (this.customLevels[type] !== undefined) {
      throw new Error(`Custom log level '${type}' is already defined.`);
    } else if (level < 0 || level > 5) {
      throw new Error(`Log level must be between 0 and 5.`);
    } else {
      this.customLevels[type] = level;
      if (color) {
        this.config[type] = { color, background: background || "none" };
      }
    }
  }

  private logMessage(message: string, type: string, level: number) {
    if (level <= this.logLevel) {
      const formattedMessage = this.formatMessage(message, type);
      console.log(formattedMessage);
      if (this.file?.dir && this.file?.name) {
        const fullPath = path.join(
          this.file?.dir.replace("{cwd}", process.cwd()),
          this.file?.name + `${this.file?.format === "text" ? ".txt" : ".json"}`
        );
        this.createFileIfNeeded(fullPath);
        if (this.file.format === "text") {
          fs.appendFileSync(fullPath, formattedMessage + "\n");
        } else if (this.file.format === "json") {
          try {
            const logFileContent = fs.readFileSync(fullPath, "utf8");
            this.logEntries = JSON.parse(logFileContent);
          } catch (e) {
            this.logEntries = [];
          }

          const logEntry: LogEntry = {
            timestamp: Date.now(),
            type,
            message,
          };
          this.logEntries.push(logEntry);
          fs.writeFileSync(fullPath, JSON.stringify(this.logEntries));
        }
      }
    }
  }

  private formatMessage(
    message: string,
    type: string,
    useColor = true
  ): string {
    if (useColor && this.config[type] && this.config[type].color) {
      const color = this.config[type].color;
      const backgroundColor = this.config[type].background;
      const timeColors = this.time;

      const coloredType = applyColor(
        type.toUpperCase(),
        color,
        backgroundColor,
        true,
        type,
        this.icon
      );
      let coloredTime = applyColor(
        getCurrentTime(),
        timeColors?.color,
        undefined,
        undefined,
        undefined,
        this.icon
      );
      if (timeColors?.bold) {
        coloredTime = chalk.bold(coloredTime);
      }

      return this.format
        .replace("%t", coloredType)
        .replace("%d", coloredTime)
        .replace("%m", message);
    } else {
      return this.format
        .replace("%t", type.toUpperCase())
        .replace("%d", getCurrentTime())
        .replace("%m", message);
    }
  }

  clear(file?: boolean) {
    process.stdout.write("\x1b[2J");

    if (file && this.file?.dir && this.file?.name) {
      const fullPath = path.join(
        this.file?.dir.replace("{cwd}", process.cwd()),
        this.file?.name + `${this.file?.format === "text" ? ".txt" : ".json"}`
      );
      this.createFileIfNeeded(fullPath);
      fs.truncate(fullPath, 0, function (err) {
        if (err) throw err;
      });
    }
  }

  private createFileIfNeeded(fullPath: string) {
    const dirPath = path.dirname(fullPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    if (!fs.existsSync(fullPath)) fs.writeFileSync(fullPath, "");
  }

  info(message: string) {
    this.logMessage(message, "info", 1);
  }

  error(message: string | Error) {
    if (isErrorStack(message) && typeof message !== "string") {
      this.logMessage(message.message, "error", 0);
      const parsedStack = parseErrorStack(message).map((frame, index) => {
        return `${index === 0 ? "" : `   ${chalk.grey("at")} `}${
          frame.functionName
        } ${chalk.gray(
          `(${chalk.magenta(
            `${frame.fileName}${chalk.grey(":")}${frame.lineNumber}${chalk.grey(
              ":"
            )}${frame.columnNumber}`
          )})`
        )}`;
      });

      this.logMessage(parsedStack.join("\n"), "error", 0);
    } else if (typeof message === "string") {
      this.logMessage(message, "error", 0);
    }
  }

  warning(message: string) {
    this.logMessage(message, "warning", 2);
  }

  debug(message: string) {
    this.logMessage(message, "debug", 3);
  }

  verbose(message: string) {
    this.logMessage(message, "verbose", 4);
  }

  silly(message: string) {
    this.logMessage(message, "silly", 5);
  }

  custom(message: string, type: string) {
    if (this.customLevels[type] !== undefined) {
      this.logMessage(message, type, this.customLevels[type]);
    } else {
      throw new Error(`Custom log level '${type}' is not defined.`);
    }
  }
}
