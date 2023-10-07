# ⚡ Prime Console
> Easy to use logger for your node.js application

[![npm version](https://img.shields.io/npm/v/prime-console?style=flat&logoColor=009933&color=ccff66)](https://www.npmjs.com/package/prime-console)
[![downloads](https://img.shields.io/npm/dt/prime-console?style=flat&logoColor=009933&color=ccff66)](https://www.npmjs.com/package/prime-console)
[![Bundle Size](https://img.shields.io/bundlephobia/min/prime-console?style=flat&logoColor=009933&color=ccff66)](https://bundlephobia.com/package/prime-console)

## Contents
* [Installation](#installation)
* [Usage](#usage)
* [Types](#types)
    * [`LoggerConfig`](#loggerconfig)
    * [`ReporterLevels`](#reporterlevels)
    * [`ReporterOverride`](#reporteroverride)

## Installation

Using npm:

```bash
npm i prime-console
```

Using yarn:

```bash
yarn add prime-console
```

Using pnpm:

```bash
pnpm i prime-console
```

## Usage

### Import already created instance. You can't configure it.
```ts
import { logger } from 'prime-console';

logger.info("Hello World!");
```

### Create your own instance and configure it.
```ts
import { createLogger } from 'prime-console';

export const logger = createLogger(options: LoggerConfig);
```
See [`LoggerConfig`][api-logger-config] for more details.

### Creating your own reporter
- There are two types of reporters:
    - [`ReporterLevels`][api-reporter-levels]
    - [`ReporterOverride`][api-reporter-override]
- Within ReporterLevels you can create a reporter for each log level. These without a reporter will use the default reporter or the reporterOverride if it is set.

```ts
import { createLogger } from 'prime-console';

const logger = createLogger({
    reporter: {
        error: ({ message, type, timestamp, icon, color }, options) => {
            console.log(`[${timestamp}] ${icon} ${message}`);
        } // This will override the default reporter for error level
    },
    reporterOverride: ({ message, type, timestamp, icon, color }, options) => {
        console.log(`[${timestamp}] ${icon} ${message}`);
    } // Level that aren't custom configured will fallback to this reporter
})
```

## Types
#### LoggerConfig
```ts
export type LoggerConfig = Partial<{
    level: number;
    files: Partial<{
        path: string; // Path to the folder where the logs will be saved
        extension: "text" | "json";
        fileName: string; // Name of the file
    }>;
    format: Partial<{
        colors: boolean;
        timestamp: boolean;
    }>;
    reporter: ReporterLevels;
    reporterOverride: ReporterOverride;
}>;
```

#### ReporterLevels
```ts
export type ReporterLevels = Partial<{
    [key in LogType]: (
        { message, type, timestamp, icon, color }: ReporterObject,
        options: LoggerConfig,
    ) => void;
}>;
```

#### ReporterOverride
```ts
// If this reporterOverride is set in a logger instance, it will override level that aren't custom configured
export type ReporterOverride = (
    { message, type, timestamp, icon, color }: ReporterObject,
    options: LoggerConfig,
) => void;

```

## Contributing

Pull requests and stars are always welcome. See [`contributing.md`](.github/CONTRIBUTING.md) for ways to get started.

This repository has a [`code of conduct`](.github/CODE_OF_CONDUCT.md). By interacting with this repository, organization, or community you agree to abide by its terms.

## Note
- Default styles were strongly inspired by [`consola`](https://github.com/unjs/consola)

## License

[MIT][license] © [malezjaa][author]

[api-logger-config]: #loggerconfig
[api-reporter-levels]: #reporterlevels
[api-reporter-override]: #reporteroverride
[license]: license
[author]: https://github.com/malezjaa