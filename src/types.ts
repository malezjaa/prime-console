export interface ILogger {
  info: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  debug: (message: string) => void;
  verbose: (message: string) => void;
  silly: (message: string) => void;
  clear: () => void;
}

export interface LoggerConfig {
  [key: string]: {
    color: string;
  };
}

export interface LoggerOptions {
  config?: LoggerConfig;
  format?: string;
  logFile?: string | null;
  logLevel?: number;
  logFileFormat?: "text" | "json";
}

export interface LogEntry {
  timestamp: string;
  type: string;
  message: string;
}