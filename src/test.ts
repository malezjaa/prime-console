import {Logger} from "./index";

const log = new Logger({
    logLevel: 5,
    config: {
        info: {
            color: "red",
            background: "none",
        }
    },
    file: {
        dir: "{cwd}/siema/logs",
        name: "log",
        format: "json"
    },
    time: {
        color: "blue",
    }
})

log.info("Hello, world!")