import { ParsedStackFrame } from "./types";
import fs from "fs";

export const getCurrentTime = () => {
  const date = new Date();
  return date.toLocaleTimeString();
};

export const parseErrorStack = (error: Error): ParsedStackFrame[] => {
  const stackTrace = error.stack;
  if (!stackTrace) {
    return [];
  }

  const stackFrames = stackTrace
    .split("\n")
    .slice(1)
    .map((line) => {
      const frameParts = line.trim().match(/at (.*?) \((.*?):(\d+):(\d+)\)/);
      if (frameParts) {
        const [, functionName, fileName, lineNumber, columnNumber] = frameParts;

        let sourceLines: string[] = [];
        try {
          const fileContents = fs.readFileSync(fileName, "utf8");
          const lines = fileContents.split("\n");
          const startLine = Math.max(0, Number(lineNumber) - 3);
          const endLine = Math.min(lines.length - 1, Number(lineNumber) + 2);
          sourceLines = lines
            .slice(startLine, endLine + 1)
            .map((line) =>
              line.trim().replace("file://", "").replace(process.cwd(), "")
            );
        } catch (error) {}

        return {
          functionName,
          fileName,
          lineNumber: parseInt(lineNumber, 10),
          columnNumber: parseInt(columnNumber, 10),
          sourceLines,
        };
      } else {
        return null;
      }
    })
    .filter((frame) => frame !== null) as ParsedStackFrame[];

  return stackFrames;
};

export const isErrorStack = (obj: any): boolean => {
  return obj instanceof Error && typeof obj.stack === "string";
};
