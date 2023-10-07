import stripAnsi from "strip-ansi";
import stringWidth from "string-width";
import { LogType } from "./types";
import isUnicodeSupported from "is-unicode-supported";

export function join(...args: any[]) {
  return args.filter(Boolean).join(" ");
}

export function strWidth(str: string) {
  if (!Intl.Segmenter) {
    return stripAnsi(str).length;
  }
  return stringWidth(str);
}

const unicode = isUnicodeSupported();
const fallback = (c: string, fallback: string) => (unicode ? c : fallback);

export const icons: { [k in LogType]?: string } = {
  error: fallback("✖", "×"),
  fatal: fallback("✖", "×"),
  ready: fallback("✔", "√"),
  warn: fallback("⚠", "‼"),
  info: fallback("ℹ", "i"),
  success: fallback("✔", "√"),
  debug: fallback("⚙", "D"),
  trace: fallback("→", "→"),
  fail: fallback("✖", "×"),
  start: fallback("◐", "o"),
  verbose: fallback("◓", "o"),
  log: "",
};

export const logColors: { [k in LogType]?: string } = {
  info: "cyan",
  fail: "red",
  success: "green",
  ready: "green",
  start: "magenta",
  warn: "yellow",
  error: "red",
  fatal: "red",
  debug: "blue",
  trace: "gray",
  log: "white",
  verbose: "greenBright",
};
