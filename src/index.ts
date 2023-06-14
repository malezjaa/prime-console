import {ILogger, LogEntry, LoggerConfig, LoggerOptions} from "./types";
import {getCurrentTime} from "./helpers";

const chalk = require("chalk");
import fs from "fs";

export * from "./types";

export class Logger implements ILogger {
    private config: LoggerConfig;
    private format: string;
    private logFile: string | null;
    private logLevel: number;
    private customLevels: { [key: string]: number };
    private logFileFormat: "text" | "json";
    private logEntries: LogEntry[];

    /**
     * Creates a new instance of the Logger class.
     * @param options - An object specifying the options for the logger.
     * @param options.config - An object specifying the colors to use for each log type.
     * @param options.format - A string specifying the format to use when logging messages. The format string can include placeholders for the log type (%t), date (%d), and message (%m).
     * @param options.logFile - The path of the file to log messages to. If not provided, messages will only be logged to the console.
     * @param options.logLevel - The minimum level of messages to log. Only messages with a level greater than or equal to this value will be logged.
     * @param options.logFileFormat - The format of the log file. Can be either "text" or "json". Defaults to "text".
     * @param options.logEntries - An array of log entries to initialize the logger with. Only used when logFileFormat is set to "json".
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
        this.logFileFormat = options.logFileFormat || "text";
        this.logEntries = [];
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
                this.config[type] = {color};
            }
        }
    }


    private logMessage(message: string, type: string, level: number) {
        if (level <= this.logLevel) {
            const formattedMessage = this.formatMessage(message, type);
            if (this.logFile) {
                if (this.logFileFormat === "json") {
                    const filePath = this.logFile.endsWith(".txt") ? this.logFile.replace(".txt", ".json") : `${this.logFile}.json`
                    let logFileExists = false;
                    try {
                        const logFileContent = fs.readFileSync(filePath, "utf8");
                        this.logEntries = JSON.parse(logFileContent);
                    } catch (e) {
                        this.logEntries = [];
                    }

                    const logEntry: LogEntry = {
                        timestamp: getCurrentTime(),
                        type,
                        message,
                    };
                    this.logEntries.push(logEntry);
                    fs.writeFileSync(filePath, JSON.stringify(this.logEntries));
                } else {
                    const uncoloredMessage = this.formatMessage(message, type, false);
                    fs.appendFileSync(this.logFile, uncoloredMessage + "\n");
                }
            }
        }
    }


    private formatMessage(message: string, type: string, useColor = true) {
        if (
            useColor &&
            this.config[type] &&
            this.config[type].color
        ) {
            const color = this.config[type].color;
            if (chalk[color]) {
                return this.format
                    .replace("%t", chalk[color](type.toUpperCase()))
                    .replace("%d", chalk.bold.black(getCurrentTime()))
                    .replace("%m", message);
            } else if (color.startsWith("#")) {
                return this.format
                    .replace("%t", chalk.hex(color)(type.toUpperCase()))
                    .replace("%d", chalk.bold.black(getCurrentTime()))
                    .replace("%m", message);
            }
        } else {
            return this.format
                .replace("%t", type.toUpperCase())
                .replace("%d", getCurrentTime())
                .replace("%m", message);
        }
    }

    clear(file?: boolean) {
        process.stdout.write('\x1b[2J')

        if (file && this.logFile) {
            fs.truncate(this.logFile, 0, function (err) {
                if (err) throw err;
            });
        }
    }
}