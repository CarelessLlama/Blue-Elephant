import createDebug from 'debug';

import { Scenes } from 'telegraf';

import {
    UnknownError,
    InvalidTextError,
    InvalidInputTypeError,
} from '../exceptions';

import { BotContext } from '../BotContext';

const debug = createDebug('bot:add_project_command');

/**
 * Creates a new project in the database.
 * @returns A scene with middleware functions that handles the creation of a project.
 */
const invalidTextName = (text: string) =>
    text.length < 3 || text.startsWith('/');

const askForProjectName = async (ctx: BotContext) => {
    debug(`Entering addProject scene.`);
    await ctx.reply(
        `Please enter a name for your project. The project name should be at least 3 characters long and cannot start with /.`,
    );
    return ctx.wizard.next();
};

const handleProjectName = async (ctx: BotContext) => {
    try {
        if (!ctx.message) {
            throw new UnknownError(
                'An unknown error occurred. Please try again later.',
            );
        }

        if (!('text' in ctx.message)) {
            throw new InvalidInputTypeError(
                'Invalid input type. Please enter a text message.',
            );
        }

        const text = ctx.message.text;
        if (!text || invalidTextName(text)) {
            throw new InvalidTextError(
                'Please enter a valid project name. A project name needs to be at least 3 characters long and cannot start with /.',
            );
        }

        // Save the project name and ask for the next piece of information
        await ctx.reply(
            `Project name saved. Please enter a short description for your project.`,
        );
        return ctx.wizard.next();
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const askForProjectDescription = async (ctx: BotContext) => {
    try {
        if (!ctx.message) {
            throw new UnknownError(
                'An unknown error occurred. Please try again later.',
            );
        }
        if (!('text' in ctx.message)) {
            throw new InvalidInputTypeError(
                'Invalid input type. Please enter a text message.',
            );
        }
        const text = ctx.message.text;
        if (!text) {
            throw new InvalidTextError(
                'Please enter a valid project description.',
            );
        }
        // Save the project description and ask for the next piece of information
        debug(`Valid project description: ${text}`);
        await ctx.reply(`Project description saved. Exiting scene now.`);
        return ctx.scene.leave();
    } catch (error) {
        const errorMessage = (error as Error).message;
        debug(errorMessage);
        await ctx.reply(errorMessage);
        return ctx.scene.reenter();
    }
};

const addProjectScene = new Scenes.WizardScene<BotContext>(
    'addProject',
    askForProjectName,
    handleProjectName,
    askForProjectDescription,
);

export { addProjectScene };
