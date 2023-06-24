# Prime Console

Logging library for Node.js. Supports custom colors, background and formats

## Installation

Install my project with npm or yarn

```bash
  npm install prime-console
```

or

```bash
  yarn add prime-console
```

## Features

- 📁 Lots of default log levels
- 📄 Saving logs to files, both to .txt and .json
- ⚙️ Custom log levels
- 🔨 Highly customizable

## CLI

`npx prime generate` - run this to easily generate Logger config

## Usage

#### Logging messages to the console

```javascript
import { Logger } from "prime-console";

const logger = new Logger({ logLevel: 5 });

logger.debug("test debug message");
logger.info("test info message");
logger.warning("test warning message");
logger.error("test error message");
logger.verbose("test verbose message");
logger.silly("test silly message");
```

- In this example, we create an instance of the Logger class with the log level set to 5, which means that all messages will be logged. Then, we call various methods of the Logger class to log messages of different types.

## Logger options

```js
import { Logger } from "prime-console";

const options: LoggerOptions = {
  config: {
    info: {
      color: "blue",
      background: "black",
    },
    error: {
      color: "#e17607",
      background: "none",
    },
    warning: {
      color: "yellow",
      background: "none",
    },
    debug: {
      color: "magenta",
      background: "#e17607",
    },
    verbose: {
      color: "cyan",
      background: "none",
    },
    silly: {
      color: "green",
      background: "none",
    },
  },
  format: "[%t] %d %m",
  logLevel: 5,
  file: {
    dir: "{cwd}/logs",
    name: "logfile",
    format: "text" | "json",
  },
  time: {
    color: "blue",
    bold: true,
  },
};

const logger = new Logger(options);
```

- {cwd} - current working directory

- **color** - can be hex or color's name
- **format** - way of message being displayed
  - **%t** - type
  - **%d** - date/time
  - **%m** - message
- **logLevel** - The minimum level of messages to log. Only messages with a level greater than or equal to this value will be logged.
- **file** - options for file logging
  - **dir** - directory where log file will be saved
  - **name** - name of log file
  - **format** - format of log file (json or text)
- **time** - options for time
  - **color** - color of text
  - **bold** - bold text
  -

#### Logging messages to a file

```javascript
import { Logger } from "prime-console";

const logger = new Logger({
  logLevel: 5,
  file: {
    dir: "{cwd}/logs",
    name: "logfile",
    format: "text" | "json",
  },
});

logger.info("test file log message");
```

- In this example, we create an instance of the Logger class with the log level set to 5 and the log file set to log.txt. Then, we call the info method to log a message of type info to the console and the specified log file.

#### Adding custom log levels

```js
import {Logger} from 'prime-console';

const logger = new Logger({logLevel: 5});

logger.addCustomLevel('custom', 3, 'blue', "black);
logger.custom('test custom message', 'custom');
```

- In this example, we create an instance of the Logger class with the log level set to 5. Then, we call the addCustomLevel method to add a custom log level named custom with a level of 3, a color of blue and black background. Finally, we call the custom method to log a message of type custom.

#### Clear function

```js
import {Logger} from 'prime-console';

const logger = new Logger({logLevel: 5});

logger.clear() or logger.clear(true)
```

- Clear function will clear the console. If true is provided as first argument, function will also clear the log file.

# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| <1.1.5  | :white_check_mark: |
| < 1.1.0 | :x:                |
| 1.0.5   | :white_check_mark: |
| < 1.0.5 | :x:                |

## Reporting a Vulnerability

Please open new issue, to report any vulnerability.

## Authors

- [@malezjaa](https://www.github.com/malezjaa)
