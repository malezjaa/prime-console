import {ILogger, LogEntry, LoggerConfig, LoggerOptions} from "./types";
import {getCurrentTime} from "./utils";

const chalk = require("chalk");
import fs from "fs";
import * as path from "path";

export * from "./types";

export class Logger implements ILogger {
    private config: LoggerConfig;
    private format: string;
    private logLevel: number;
    private customLevels: { [key: string]: number };
    private logEntries: LogEntry[];
    private file: LoggerOptions["file"]
    private time: LoggerOptions["time"]

    /**
     * Creates a new instance of the Logger class.
     * @param options - An object specifying the options for the logger.
     * @param options.config - An object specifying the colors to use for each log type.
     * @param options.format - A string specifying the format to use when logging messages. The format string can include placeholders for the log type (%t), date (%d), and message (%m).
     * @param options.logLevel - The minimum level of messages to log. Only messages with a level greater than or equal to this value will be logged.
     * @param options.file - An object specifying the options for the log file.
     */

    constructor(options: LoggerOptions = {}) {
        const defaultConfig: LoggerConfig = {
            info: {
                color: "blue",
                background: "none"
            },
            error: {
                color: "red",
                background: "none"
            },
            warning: {
                color: "yellow",
                background: "none"
            },
            debug: {
                color: "magenta",
                background: "none"
            },
            verbose: {
                color: "cyan",
                background: "none"
            },
            silly: {
                color: "green",
                background: "none"
            },
        };
        const defaultFormat = "[%t] %d %m";
        const defaultLogLevel = 0;

        this.config = options.config || defaultConfig;
        this.format = options.format || defaultFormat;
        this.logLevel = options.logLevel || defaultLogLevel;
        this.customLevels = {};
        this.logEntries = [];
        this.file = {
            dir: options.file?.dir || "",
            name: options.file?.name || "",
            format: options.file?.format || "text"
        }
        this.time = {
            color: options.time?.color || "white",
            bold: options.time?.bold || false
        }
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

    addCustomLevel(type: string, level: number, color?: string, background?: string) {
        if (this.customLevels[type]) {
            throw new Error(`Custom log level '${type}' is already defined.`);
        } else if (level < 0 || level > 5) {
            throw new Error(`Log level must be between 0 and 5.`);
        } else {
            this.customLevels[type] = level;
            if (color) {
                this.config[type] = {color, background: background || "none"}
            }
        }
    }

    private logMessage(message: string, type: string, level: number) {
        if (level <= this.logLevel) {
            const formattedMessage = this.formatMessage(message, type);
            console.log(formattedMessage)
            if (this.file?.dir && this.file?.name) {
                const fullPath = path.join(this.file?.dir.replace("{cwd}", process.cwd()), this.file?.name + `${this.file?.format === "text" ? ".txt" : ".json"}`);
                this.createFileIfNeeded(fullPath)
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

    private formatMessage(message: string, type: string, useColor = true) {
        if (
            useColor &&
            this.config[type] &&
            this.config[type].color
        ) {
            const color = this.config[type].color;
            const backgroundColor = this.config[type].background;
            const timeColors = this.time;

            const coloredType = this.applyColor(type.toUpperCase(), color, backgroundColor);
            let coloredTime = this.applyColor(getCurrentTime(), timeColors?.color, undefined);
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

    private applyColor(text: string, color: string | undefined, backgroundColor: string | undefined) {
        let coloredText = text;
        if (color) {
            if (chalk[color]) {
                coloredText = chalk[color](coloredText);
            } else if (color.startsWith("#")) {
                coloredText = chalk.hex(color)(coloredText);
            }
        }
        if (backgroundColor && backgroundColor !== "none") {
            if (chalk[backgroundColor]) {
                coloredText = chalk[`bg${backgroundColor[0].toUpperCase()}${backgroundColor.slice(1)}`](coloredText);
            } else if (backgroundColor.startsWith("#")) {
                coloredText = chalk.bgHex(backgroundColor)(coloredText);
            }
        }
        return coloredText;
    }


    clear(file?: boolean) {
        process.stdout.write('\x1b[2J')

        if (file && this.file?.dir && this.file?.name) {
            const fullPath = path.join(this.file?.dir.replace("{cwd}", process.cwd()), this.file?.name + `${this.file?.format === "text" ? ".txt" : ".json"}`);
            this.createFileIfNeeded(fullPath)
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
}