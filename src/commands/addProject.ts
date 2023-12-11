import createDebug from 'debug';

import { Composer, Scenes } from 'telegraf';

import { BotContext } from './../BotContext';

import { message } from 'telegraf/filters';

import { author, name, version } from '../../package.json';

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
    if (!ctx.message) {
        debug(`An unknown error occurred. Please try again later.`);
        await ctx.reply(`An unknown error occurred. Please try again later.`);
        return ctx.scene.reenter();
    } else if ('text' in ctx.message) {
        const text = ctx.message.text;
        if (!text) {
            debug(`Invalid input type. Please enter a text message.`);
            await ctx.reply(`Invalid input type. Please enter a text message.`);
            return ctx.scene.reenter();
        }
        if (invalidTextName(text)) {
            debug(`Invalid project name: ${text}`);
            await ctx.reply(
                `Please enter a valid project name. A project name needs to be at least 3 characters long.`,
            );
            return ctx.scene.reenter();
        }
        // Save the project name and ask for the next piece of information
        debug(`Valid project name: ${text}`);
        await ctx.reply(
            `Project name saved. Please enter a short description for your project.`,
        );
        return ctx.wizard.next();
    }
};

const askForProjectDescription = async (ctx: BotContext) => {
    if (!ctx.message) {
        debug(`An unknown error occurred. Please try again later.`);
        await ctx.reply(`An unknown error occurred. Please try again later.`);
        return ctx.scene.reenter();
    } else if ('text' in ctx.message) {
        const text = ctx.message.text;
        debug(`Project description: ${text}`);
        if (!text) {
            debug(`Invalid input type. Please enter a text message.`);
            await ctx.reply(`Invalid input type. Please enter a text message.`);
            return ctx.scene.reenter();
        }
        // Save the project description and ask for the next piece of information
        debug(`Valid project description: ${text}`);
        await ctx.reply(`Project description saved. Exiting scene now.`);
        return ctx.scene.leave();
    }
};

const addProjectScene = new Scenes.WizardScene<BotContext>(
    'addProject',
    askForProjectName,
    handleProjectName,
    askForProjectDescription,
);
const addProjectStage = new Scenes.Stage<BotContext>([addProjectScene]);

export { addProjectStage };
