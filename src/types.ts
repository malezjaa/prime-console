export interface ILogger {
  info: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  debug: (message: string) => void;
  verbose: (message: string) => void;
  silly: (message: string) => void;
  custom: (message: string, type: string) => void;
  clear: () => void;
}

export interface LoggerConfig {
  [key: string]: {
    color: string;
    background: string;
  };
}

export interface LoggerOptions {
  config?: LoggerConfig;
  format?: string;
  logLevel?: number;
  file?: {
    dir: string;
    name: string;
    format: "text" | "json";
  };
  time?: {
    color?: string;
    bold?: boolean;
  };
  icon?: boolean;
}

export interface LogEntry {
  timestamp: number;
  type: string;
  message: string;
}

export interface ParsedStackFrame {
  functionName: string;
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}
