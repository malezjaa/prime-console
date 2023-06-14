import { ILogger, LoggerConfig, LoggerOptions } from "./types";
import { getCurrentTime } from "./helpers";
const chalk = require("chalk");
import fs, { PathLike } from "fs";

export class Logger implements ILogger {
  private config: LoggerConfig;
  private format: string;
  private logFile: string | null;
  private logLevel: number;
  private customLevels: { [key: string]: number };

  /**
   * Creates a new instance of the Logger class.
   * @param options - An object specifying the options for the logger.
   * @param options.config - An object specifying the colors to use for each log type.
   * @param options.format - A string specifying the format to use when logging messages. The format string can include placeholders for the log type (%t), date (%d), and message (%m).
   * @param options.logFile - The path of the file to log messages to. If not provided, messages will only be logged to the console.
   * @param options.logLevel - The minimum level of messages to log. Only messages with a level greater than or equal to this value will be logged.
   */

  constructor(options: LoggerOptions = {}) {
    const defaultConfig: LoggerConfig = {
      info: {
        color: "blue",
      },
      error: {
        color: "red",
      },
      warning: {
        color: "yellow",
      },
      debug: {
        color: "magenta",
      },
      verbose: {
        color: "cyan",
      },
      silly: {
        color: "green",
      },
    };
    const defaultFormat = "[%t] %d %m";
    const defaultLogFile: string | null = null;
    const defaultLogLevel = 0;

    this.config = options.config || defaultConfig;
    this.format = options.format || defaultFormat;
    this.logFile = options.logFile || defaultLogFile;
    this.logLevel = options.logLevel || defaultLogLevel;
    this.customLevels = {};
  }

  info(message: string) {
    this.logMessage(message, "info", 1);
  }

  error(message: string) {
    this.logMessage(message, "error", 0);
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
    if (
      this.customLevels[type] != null ||
      this.customLevels[type] != undefined
    ) {
      this.logMessage(message, type, this.customLevels[type]);
    } else {
      throw new Error(`Custom log level '${type}' is not defined.`);
    }
  }

  addCustomLevel(type: string, level: number, color?: string) {
    if (this.customLevels[type]) {
      throw new Error(`Custom log level '${type}' is already defined.`);
    } else if (level < 0 || level > 5) {
      throw new Error(`Log level must be between 0 and 5.`);
    } else if (color && !chalk[color]) {
      throw new Error(`Invalid color '${color}'.`);
    } else {
      this.customLevels[type] = level;
      if (color) {
        this.config[type] = { color };
      }
    }
  }

  private logMessage(message: string, type: string, level: number) {
    if (level <= this.logLevel) {
      const formattedMessage = this.formatMessage(message, type);
      console.log(formattedMessage);
      if (this.logFile) {
        const uncoloredMessage = this.formatMessage(message, type, false);
        fs.appendFileSync(this.logFile, uncoloredMessage + "\n");
      }
    }
  }

  private formatMessage(message: string, type: string, useColor = true) {
    if (
      useColor &&
      this.config[type] &&
      this.config[type].color &&
      chalk[this.config[type].color]
    ) {
      return this.format
        .replace("%t", chalk[this.config[type].color](type.toUpperCase()))
        .replace("%d", chalk.bold.black(getCurrentTime()))
        .replace("%m", message);
    } else {
      return this.format
        .replace("%t", type.toUpperCase())
        .replace("%d", getCurrentTime())
        .replace("%m", message);
    }
  }

  public clear(file?: boolean) {
    console.clear();

    const log = this.logMessage("File and console was cleared", "info", 1);

    if (file) {
      fs.truncate(this.logFile as PathLike, 0, function (err) {
        if (err) throw err;
        log;
      });
    }
  }
}
