# Console Queen

Logging library for Node.js

## Installation

Install my-project with npm or yarn

```bash
  npm install console-king
```

or

```bash
  yarn add console-king
```

### Usage

#### Logging messages to the console

**Important** if messages don't show in console, you will have to change log level in Logger instance.

```javascript
import { Logger } from "./Logger";

const logger = new Logger({ logLevel: 5 });

logger.debug("test debug message");
logger.info("test info message");
logger.warning("test warning message");
logger.error("test error message");
logger.verbose("test verbose message");
logger.silly("test silly message");
```

- In this example, we create an instance of the Logger class with the log level set to 5, which means that all messages will be logged. Then, we call various methods of the Logger class to log messages of different types.

#### Logging messages to a file

```javascript
import { Logger } from "./Logger";

const logger = new Logger({ logLevel: 5, logFile: "log.txt" });

logger.info("test file log message");
```

- In this example, we create an instance of the Logger class with the log level set to 5 and the log file set to log.txt. Then, we call the info method to log a message of type info to the console and the specified log file.

#### Adding custom log levels

```js
import { Logger } from "./Logger";

const logger = new Logger({ logLevel: 5 });

logger.addCustomLevel("custom", 3, "blue");
logger.custom("test custom message", "custom");
```

- In this example, we create an instance of the Logger class with the log level set to 5. Then, we call the addCustomLevel method to add a custom log level named custom with a level of 3 and a color of blue. Finally, we call the custom method to log a message of type custom.

## Authors

- [@malezjaa](https://www.github.com/malezjaa)
