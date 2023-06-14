#! /usr/bin/env node

import { Command } from 'commander';
import {LoggerOptions} from "../types";
import * as chalk from "chalk";
import {Logger} from "../index";

const program = new Command("Prime Console");

const log = new Logger({logLevel: 5})

const main = async () => {
    const inquirer = await import('inquirer').then((m) => m.default);
    program
        .command('generate')
        .description('Generates config for Prime Console')
        .action(async () => {
            const colors = ["red", "green", "yellow", "blue", "magenta", "cyan", "white", "gray", "redBright", "greenBright", "yellowBright", "blueBright", "magentaBright", "cyanBright", "whiteBright"];
            const editColors = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'editColors',
                    message: 'Do you want to edit the colors for the different log levels?'
                }
            ]);
            let answers;
            if(editColors.editColors){
                answers = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'infoColor',
                        message: 'What color do you want to use for the "info" log level?',
                        choices: colors
                    },
                    {
                        type: 'list',
                        name: 'errorColor',
                        message: 'What color do you want to use for the "error" log level?',
                        choices: colors
                    },
                    {
                        type: 'list',
                        name: 'warningColor',
                        message: 'What color do you want to use for the "warning" log level?',
                        choices: colors
                    },
                    {
                        type: 'list',
                        name: 'debugColor',
                        message: 'What color do you want to use for the "debug" log level?',
                        choices: colors
                    },
                    {
                        type: 'list',
                        name: 'verboseColor',
                        message: 'What color do you want to use for the "verbose" log level?',
                        choices: colors
                    },
                    {
                        type: 'list',
                        name: 'sillyColor',
                        message: 'What color do you want to use for the "silly" log level?',
                        choices: colors
                    }
                ]);
            }

            const otherAnswers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'format',
                    message: 'What format do you want to use for your logs?'
                },
                {
                    type: 'input',
                    name: 'logFile',
                    message:
                        'Enter the path to the file where you want to save your logs:'
                },
                {
                    type: 'input',
                    name: 'logLevel',
                    message:
                        `What is the maximum log level you want to display?`,
                    validate: function (input) {
                        if (isNaN(input)) {
                            return 'The log level must be a number!';
                        }
                        if (input > 5) {
                            return 'The log level cannot be higher than 5!';
                        }
                        return true
                    }
                },
                {
                    type:
                        `list`,
                    name:
                        `logFileFormat`,
                    message:
                        `In what format do you want to save your logs in the file?`,
                    choices:
                        [`text`, `json`]
                }
            ]);

            const options : LoggerOptions = {
                config :{
                    info:{
                        color : answers?.infoColor,
                    },
                    error:{
                        color : answers?.errorColor,
                    },
                    warning:{
                        color : answers?.warningColor,
                    },
                    debug:{
                        color : answers?.debugColor,
                    },
                    verbose:{
                        color : answers?.verboseColor,
                    },
                    silly:{
                        color : answers?.sillyColor,
                    }
                },
                format : otherAnswers.format,
                logFile : otherAnswers.logFile,
                logLevel : otherAnswers.logLevel,
                logFileFormat : otherAnswers.logFileFormat
            }

            console.log(options);

            log.info("Successfully generated config file! Copy this json object and paste it into your Logger instance.")
        });

    program.parse(process.argv);
}

main()
