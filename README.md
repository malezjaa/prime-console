
# Prime Console

Logging library for Node.js

## Installation

Install my-project with npm or yarn

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
```npx prime generate``` - run this to easily generate Logger config
 
## Usage

#### Logging messages to the console

```javascript
import {Logger} from 'prime-console';

const logger = new Logger({logLevel: 5});

logger.debug('test debug message');
logger.info('test info message');
logger.warning('test warning message');
logger.error('test error message');
logger.verbose('test verbose message');
logger.silly('test silly message');
```
- In this example, we create an instance of the Logger class with the log level set to 5, which means that all messages will be logged. Then, we call various methods of the Logger class to log messages of different types.

#### Logging messages to a file

```javascript
import {Logger} from 'prime-console';

const logger = new Logger({logLevel: 5, logFile: 'log.txt'});

logger.info('test file log message');
```

- In this example, we create an instance of the Logger class with the log level set to 5 and the log file set to log.txt. Then, we call the info method to log a message of type info to the console and the specified log file.

#### Adding custom log levels

```js
import {Logger} from 'prime-console';

const logger = new Logger({logLevel: 5});

logger.addCustomLevel('custom', 3, 'blue');
logger.custom('test custom message', 'custom');
```

- In this example, we create an instance of the Logger class with the log level set to 5. Then, we call the addCustomLevel method to add a custom log level named custom with a level of 3 and a color of blue. Finally, we call the custom method to log a message of type custom.

#### Clear function

```js
import {Logger} from 'prime-console';

const logger = new Logger({logLevel: 5});

logger.clear() or logger.clear(true)
```

- Clear function will clear the console. If true is provided as first argument, function will also clear the log file.
## Logger options

```js
import {Logger} from 'prime-console';

const options: LoggerOptions = {
  config: {
    info: {
      color: "blue",
    },
    error: {
        color: "#e17607",
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
  },
  format: "[%t] %d %m",
  logFile: "./log.txt",
  logLevel: 5,
  logFileFormat: "json",
};

const logger = new Logger(options);
```

- **color** - can be hex or color's name
- **format** - way of message being displayed
  - %t - type
  - %d - date/time
  - %m - message
- **logFile** - location to file where your messages will be saved. For default use `.txt` ("./file.txt") extension. If you want to use json instead set `logFileFormat` as `"json"` and remove extension from logFile ("./file"). If not provided, messages will only be logged to the console.
- **logLevel** - The minimum level of messages to log. Only messages with a level greater than or equal to this value will be logged.

# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are
currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.5   | :white_check_mark: |
| 1.0.4   | :white_check_mark: |
| < 1.0.4   | :x:                |

## Reporting a Vulnerability

Please open new issue, to report any vulnerablility.

## Authors

- [@malezjaa](https://www.github.com/malezjaa)

